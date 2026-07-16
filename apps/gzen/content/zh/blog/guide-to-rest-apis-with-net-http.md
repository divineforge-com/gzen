---
title: "Go net/http 完全指南：构建 REST API"
description: "仅使用 Go 标准库构建生产级 REST API —— 中间件、路由、JSON 处理与测试模式。"
date: 2026-07-16
tags: ["web", "api", "net-http", "rest", "testing"]
author: "GZen.io"
---

Go 标准库的 `net/http` 包功能强大。在引入 Gin、Echo 或 Chi 之前，值得先了解标准库的能力。

## Go 1.22+ 路由增强

自 Go 1.22 起，`net/http` 支持方法路由和路径参数：

```go
mux := http.NewServeMux()
mux.HandleFunc("GET /api/users", s.handleListUsers)
mux.HandleFunc("POST /api/users", s.handleCreateUser)
mux.HandleFunc("GET /api/users/{id}", s.handleGetUser)
```

路径参数通过 `r.PathValue("id")` 获取。

## JSON 编解码

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

## 中间件模式

```go
func logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
    })
}
```

## 测试

`net/http/httptest` 让测试变得简单：

```go
func TestHandleGetUser(t *testing.T) {
    req := httptest.NewRequest("GET", "/api/users/42", nil)
    rec := httptest.NewRecorder()
    srv.handleGetUser(rec, req)
    // assert rec.Code, rec.Body
}
```

## 结论

对于大多数 API 来说，从 `net/http` 开始就足够了。Go 的哲学在此适用：优先清晰，从简开始。
