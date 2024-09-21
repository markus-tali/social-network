package utils

import (
	"net/http"
	"os"
	"path/filepath"
)

func ServeAvatar(w http.ResponseWriter, r *http.Request) {
	filePath := filepath.Join("database/assets", filepath.Base(r.URL.Path))
	fileInfo, err := os.Stat(filePath)

	if os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	ext := filepath.Ext(fileInfo.Name())
	mimeType := "image/jpeg"
	switch ext {
	case ".png":
		mimeType = "image/png"
	case ".gif":
		mimeType = "image/gif"
	}

	w.Header().Set("Content-Type", mimeType)
	http.ServeFile(w, r, filePath)
}
