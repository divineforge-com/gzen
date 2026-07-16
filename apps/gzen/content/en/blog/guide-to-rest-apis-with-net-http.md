---
title: "Go's net/http: A Complete Guide to Building REST APIs"
description: "Building production-ready REST APIs using only Go's standard library — middleware, routing, JSON, and testing patterns."
date: 2026-07-16
tags: ["web", "api", "net-http", "rest", "testing"]
author: "GZen.io"
---

Go's standard library `net/http` package is surprisingly capable. Before reaching for Gin, Echo, or Chi, it's worth understanding what the stdlib gives you out of the box.

## The Request Handler

Every HTTP handler in Go is a function matching this signature:

```go
type Handler func(w http.ResponseWriter, r *http.Request)
```

Or, using the struct approach:

```go
type Server struct {
    db *sql.DB
}

func (s *Server) handleUsers(w http.ResponseWriter, r *http.Request) {
    // r.Method, r.URL.Path, r.Body, etc.
}
```

## Routing with Go 1.22+

Since Go 1.22, `net/http` supports method-based routing and path parameters:

```go
mux := http.NewServeMux()
mux.HandleFunc("GET /api/users", s.handleListUsers)
mux.HandleFunc("POST /api/users", s.handleCreateUser)
mux.HandleFunc("GET /api/users/{id}", s.handleGetUser)
mux.HandleFunc("PUT /api/users/{id}", s.handleUpdateUser)
mux.HandleFunc("DELETE /api/users/{id}", s.handleDeleteUser)
```

Access path parameters via `r.PathValue("id")`:

```go
func (s *Server) handleGetUser(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")

    user, err := s.db.GetUser(r.Context(), id)
    if err != nil {
        writeJSON(w, http.StatusNotFound, map[string]string{
            "error": "user not found",
        })
        return
    }

    writeJSON(w, http.StatusOK, user)
}
```

## JSON Encoding and Decoding

A reusable JSON helper keeps handlers clean:

```go
func writeJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(v)
}

func readJSON(r *http.Request, v any) error {
    defer r.Body.Close()
    return json.NewDecoder(r.Body).Decode(v)
}
```

Usage:

```go
func (s *Server) handleCreateUser(w http.ResponseWriter, r *http.Request) {
    var input struct {
        Name  string `json:"name"`
        Email string `json:"email"`
    }

    if err := readJSON(r, &input); err != nil {
        writeJSON(w, http.StatusBadRequest, map[string]string{
            "error": "invalid JSON",
        })
        return
    }
    // ...
}
```

## Middleware Pattern

Middleware in Go is just a wrapper around a handler:

```go
func logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
    })
}

func cors(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

Chaining:

```go
handler := logging(cors(mux))
```

## Graceful Shutdown

Production servers need graceful shutdown:

```go
func main() {
    srv := &http.Server{
        Addr:    ":8080",
        Handler: handler,
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatal(err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("server forced to shutdown:", err)
    }
}
```

## Testing Handlers

`net/http/httptest` is excellent for handler tests:

```go
func TestHandleGetUser(t *testing.T) {
    // table-driven test
    tests := []struct {
        name       string
        id         string
        wantStatus int
    }{
        {"existing user", "42", http.StatusOK},
        {"non-existent", "999", http.StatusNotFound},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            req := httptest.NewRequest("GET", "/api/users/"+tt.id, nil)
            rec := httptest.NewRecorder()

            srv := &Server{db: testDB}
            srv.handleGetUser(rec, req)

            if rec.Code != tt.wantStatus {
                t.Errorf("got %d, want %d", rec.Code, tt.wantStatus)
            }
        })
    }
}
```

## Stdlib vs Frameworks

| Need | Stdlib | Framework (Gin/Echo/Chi) |
|------|--------|-------------------------|
| Simple CRUD API | ✅ Perfect | Overkill |
| Complex routing (host-based, subdomain) | ⚠️ Limited | ✅ Advanced |
| Middleware ecosystem | ⚠️ Basic | ✅ Rich |
| Request validation | Manual | ✅ Built-in |
| OpenAPI/Swagger | Manual | ✅ Plugins |
| Performance | ✅ Excellent | ✅ Excellent |

## The Verdict

For most APIs, start with `net/http`. Add a framework only when you hit a specific limitation. The stdlib gives you:

- Production-grade HTTP/2 server
- No dependencies to manage
- The same API the frameworks are built on
- Easier upgrades (one dependency fewer to track)

Go's philosophy applies here too: prefer clarity, start simple, add complexity only when justified.
