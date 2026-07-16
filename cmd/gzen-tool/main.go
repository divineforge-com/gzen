package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

type App struct {
	Name        string
	Path        string
	ProjectName string
	Description string
}

var apps = []App{
	{Name: "gzen", Path: "apps/gzen", ProjectName: "gzen", Description: "Main GrowZen platform (gzen.io)"},
	{Name: "gzen-ki", Path: "apps/gzen-ki", ProjectName: "gzen-ki", Description: "Genki/Health notebooks (genki.gzen.io)"},
	{Name: "gzen-learn", Path: "apps/gzen-learn", ProjectName: "gzen-learn", Description: "Language learning platform (learn.gzen.io)"},
	{Name: "gzen-invest", Path: "apps/gzen-invest", ProjectName: "gzen-invest", Description: "Investment Infographics (invest.gzen.io)"},
}

func main() {
	loadEnv()

	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	command := os.Args[1]

	// Shift arguments for flag parsing
	os.Args = append(os.Args[:1], os.Args[2:]...)

	switch command {
	case "list":
		handleList()
	case "build":
		handleBuild()
	case "lint":
		handleLint()
	case "deploy":
		handleDeploy()
	case "help":
		printUsage()
	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}

func loadEnv() {
	file, err := os.Open(".env")
	if err != nil {
		return // Ignore if .env doesn't exist
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			val := strings.TrimSpace(parts[1])
			// Only set if not already set in environment
			if os.Getenv(key) == "" {
				os.Setenv(key, val)
			}
		}
	}
}

func printUsage() {
	fmt.Println("🪷 GrowZen Workspace Tool (`gzen-tool`)")
	fmt.Println("Usage:")
	fmt.Println("  gzen-tool <command> [arguments]")
	fmt.Println()
	fmt.Println("Commands:")
	fmt.Println("  list      List all applications in the monorepo")
	fmt.Println("  build     Build all Hugo applications concurrently")
	fmt.Println("  lint      Verify content structure rules on the main gzen app")
	fmt.Println("  deploy    Build and deploy all applications to Cloudflare Pages")
	fmt.Println("  help      Show this help info")
}

func handleList() {
	fmt.Println("🚀 Registered Monorepo Applications:")
	fmt.Println(strings.Repeat("-", 90))
	fmt.Printf("%-15s | %-20s | %-15s | %s\n", "Name", "Directory", "Cloudflare Proj", "Description")
	fmt.Println(strings.Repeat("-", 90))
	for _, app := range apps {
		fmt.Printf("%-15s | %-20s | %-15s | %s\n", app.Name, app.Path, app.ProjectName, app.Description)
	}
	fmt.Println(strings.Repeat("-", 90))
}

func handleBuild() {
	fmt.Println("⚡ Building all applications concurrently...")
	start := time.Now()

	var wg sync.WaitGroup
	results := make(chan string, len(apps))

	for _, app := range apps {
		wg.Add(1)
		go func(a App) {
			defer wg.Done()
			appStart := time.Now()

			// Check if directory exists
			if _, err := os.Stat(a.Path); os.IsNotExist(err) {
				results <- fmt.Sprintf("❌ [%s] directory does not exist: %s", a.Name, a.Path)
				return
			}

			// Run hugo --minify
			cmd := exec.Command("hugo", "--minify")
			cmd.Dir = a.Path
			output, err := cmd.CombinedOutput()

			duration := time.Since(appStart)
			if err != nil {
				results <- fmt.Sprintf("❌ [%s] Build failed in %v:\n%s", a.Name, duration, string(output))
			} else {
				results <- fmt.Sprintf("✅ [%s] Built successfully in %v", a.Name, duration)
			}
		}(app)
	}

	wg.Wait()
	close(results)

	fmt.Println("\n📋 Build Summary:")
	fmt.Println(strings.Repeat("-", 50))
	for res := range results {
		fmt.Println(res)
	}
	fmt.Println(strings.Repeat("-", 50))
	fmt.Printf("Total build time: %v\n", time.Since(start))
}

func handleDeploy() {
	token := os.Getenv("CLOUDFLARE_API_TOKEN")
	if token == "" {
		fmt.Println("❌ Error: CLOUDFLARE_API_TOKEN is not set in environment or .env file.")
		os.Exit(1)
	}

	// 1. Always build first
	handleBuild()
	fmt.Println("\n☁️ Starting deployment to Cloudflare Pages...")
	start := time.Now()

	for _, app := range apps {
		fmt.Printf("\n📦 Deploying [%s] to project [%s]...\n", app.Name, app.ProjectName)
		deployStart := time.Now()

		publicDir := filepath.Join(app.Path, "public")
		if _, err := os.Stat(publicDir); os.IsNotExist(err) {
			fmt.Printf("❌ Failed: Public directory does not exist for %s. Did the build fail?\n", app.Name)
			continue
		}

		// Run wrangler pages deploy <dir> --project-name=<name> --commit-dirty=true
		// We use --commit-dirty=true to allow deploying uncommitted local changes if needed
		cmd := exec.Command("npx", "wrangler", "pages", "deploy", publicDir, "--project-name="+app.ProjectName, "--commit-dirty=true")
		
		// Set credentials for wrangler in process environment
		cmd.Env = append(os.Environ(), "CLOUDFLARE_API_TOKEN="+token)
		
		// Redirect output so user sees real-time wrangler upload logs
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		err := cmd.Run()
		duration := time.Since(deployStart)

		if err != nil {
			fmt.Printf("❌ [%s] Deployment failed after %v: %v\n", app.Name, duration, err)
		} else {
			fmt.Printf("✅ [%s] Successfully deployed to Cloudflare Pages in %v\n", app.Name, duration)
		}
	}

	fmt.Println("\n🏁 All deployment processes complete.")
	fmt.Printf("Total execution time: %v\n", time.Since(start))
}

func handleLint() {
	lintPath := flag.String("path", "apps/gzen/content", "Path to content directory to lint")
	flag.Parse()

	fmt.Printf("🔍 Linting content in %s for GrowZen structural rules...\n", *lintPath)
	fmt.Println("Checking for: 1. Observation, 2. Principle, 3. Application parts.")
	fmt.Println(strings.Repeat("-", 80))

	errorsFound := 0
	filesChecked := 0

	err := filepath.Walk(*lintPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() || !strings.HasSuffix(info.Name(), ".md") || info.Name() == "_index.md" || info.Name() == "about.md" {
			return nil
		}

		filesChecked++
		fileErrors := lintFile(path)
		if len(fileErrors) > 0 {
			fmt.Printf("📄 File: %s\n", path)
			for _, fe := range fileErrors {
				fmt.Printf("   ⚠️  %s\n", fe)
				errorsFound++
			}
			fmt.Println()
		}
		return nil
	})

	if err != nil {
		fmt.Printf("Error checking files: %v\n", err)
		os.Exit(1)
	}

	fmt.Println(strings.Repeat("-", 80))
	fmt.Printf("Checked %d markdown files.\n", filesChecked)
	if errorsFound > 0 {
		fmt.Printf("❌ Lint failed with %d structure violation(s).\n", errorsFound)
		os.Exit(1)
	} else {
		fmt.Println("✅ All files match content structure standards.")
	}
}

func lintFile(path string) []string {
	file, err := os.Open(path)
	if err != nil {
		return []string{fmt.Sprintf("Failed to open file: %v", err)}
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var contentLines []string
	inFrontmatter := false
	frontmatterDone := false

	for scanner.Scan() {
		line := scanner.Text()
		if line == "---" {
			if !inFrontmatter && !frontmatterDone {
				inFrontmatter = true
			} else if inFrontmatter {
				inFrontmatter = false
				frontmatterDone = true
			}
			continue
		}
		if !inFrontmatter && frontmatterDone {
			contentLines = append(contentLines, line)
		}
	}

	fullText := strings.ToLower(strings.Join(contentLines, "\n"))
	var violations []string

	hasObservation := strings.Contains(fullText, "观察") || strings.Contains(fullText, "observation") || strings.Contains(fullText, "生活中") || strings.Contains(fullText, "生活中，")
	hasPrinciple := strings.Contains(fullText, "禅理") || strings.Contains(fullText, "principle") || strings.Contains(fullText, "教导") || strings.Contains(fullText, "佛陀") || strings.Contains(fullText, "dharma")
	hasApplication := strings.Contains(fullText, "实践") || strings.Contains(fullText, "修行") || strings.Contains(fullText, "application") || strings.Contains(fullText, "如何") || strings.Contains(fullText, "日常")

	if !hasObservation {
		violations = append(violations, "Missing 'Observation' (观察/Everyday situation) section/context.")
	}
	if !hasPrinciple {
		violations = append(violations, "Missing 'Principle' (禅理/Dharma teaching) section/context.")
	}
	if !hasApplication {
		violations = append(violations, "Missing 'Application' (修行/Daily life action) section/context.")
	}

	return violations
}
