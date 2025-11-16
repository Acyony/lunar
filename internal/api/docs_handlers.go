package api

import (
	"net/http"

	_ "embed"
)

var (
	//go:embed docs/index.html
	docsHTML []byte

	//go:embed docs/openapi.yaml
	openAPISpec []byte
)

// docsPageHandler serves the interactive API reference page.
func docsPageHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)
	if r.Method != http.MethodHead {
		_, _ = w.Write(docsHTML)
	}
}

// openAPISpecHandler returns the OpenAPI specification consumed by the docs UI.
func openAPISpecHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/yaml")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)
	if r.Method != http.MethodHead {
		_, _ = w.Write(openAPISpec)
	}
}
