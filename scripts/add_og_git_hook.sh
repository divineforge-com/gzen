#!/bin/bash
# Pre-commit hook to generate Open Graph images for new markdown files

HOOK_FILE=".git/hooks/pre-commit"

cat << 'HOOK_EOF' > $HOOK_FILE
#!/bin/bash
# Generate Open Graph images if there are staged markdown files

# Check if there are any staged markdown files
staged_md=$(git diff --cached --name-only | grep '\.md$')

if [ -n "$staged_md" ]; then
    echo "Found staged Markdown files. Generating missing Open Graph images..."
    if command -v python3 &> /dev/null; then
        python3 scripts/generate_og_images.py
        # Add the newly generated images to the commit
        git add assets/img/og-*.jpg
    else
        echo "Warning: python3 not found. Skipping Open Graph image generation."
    fi
fi
HOOK_EOF

chmod +x $HOOK_FILE
echo "Added pre-commit hook to generate OG images automatically."
