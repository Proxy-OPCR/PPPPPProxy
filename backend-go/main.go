package main

import (
    "io"
    "log"
    "net/http"
    "math/rand"
    "time"
)

var userAgents = []string{
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "Mozilla/5.0 (X11; Linux x86_64)",
}

func randomUserAgent() string {
    return userAgents[rand.Intn(len(userAgents))]
}

func proxyHandler(w http.ResponseWriter, r *http.Request) {
    target := r.URL.Query().Get("url")
    if target == "" {
        http.Error(w, "URL is required", http.StatusBadRequest)
        return
    }
    client := &http.Client{}
    req, _ := http.NewRequest("GET", target, nil)
    req.Header.Set("User-Agent", randomUserAgent())

    resp, err := client.Do(req)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()
    w.Header().Set("Content-Type", "text/html")
    io.Copy(w, resp.Body)
}

func main() {
    rand.Seed(time.Now().UnixNano())
    http.HandleFunc("/proxy", proxyHandler)
    log.Println("Go proxy running at :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
