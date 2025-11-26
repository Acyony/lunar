// Command testserver serves the frontend directory for running Jasmine tests.
// Usage: go run ./cmd/testserver
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
)

func main() {
	port := "8888"
	dir := "frontend"

	// Check if frontend directory exists
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		log.Fatalf("Directory %s does not exist. Run from project root.", dir)
	}

	url := fmt.Sprintf("http://localhost:%s/test/SpecRunner.html", port)

	fmt.Printf("Serving %s on http://localhost:%s\n", dir, port)
	fmt.Printf("Open %s in your browser\n", url)
	fmt.Println("Press Ctrl+C to stop")

	// Try to open browser automatically
	go openBrowser(url)

	// Serve the frontend directory
	fs := http.FileServer(http.Dir(dir))
	if err := http.ListenAndServe(":"+port, fs); err != nil {
		log.Fatal(err)
	}
}

func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "darwin":
		cmd = exec.Command("open", url)
	case "linux":
		cmd = exec.Command("xdg-open", url)
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	default:
		return
	}
	_ = cmd.Start()
}
