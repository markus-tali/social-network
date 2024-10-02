package utils

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func ServeAvatar(w http.ResponseWriter, r *http.Request) {
	filePath := filepath.Join("backend/database/assets", filepath.Base(r.URL.Path))
	fmt.Println(r.URL.Path)
	fmt.Println(filePath)
	fileInfo, err := os.Stat(filePath)
	fmt.Println("servubg avaar")
	if os.IsNotExist(err) {
		fmt.Println("file nt forhj ")
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	fmt.Println("servubg avaar")

	ext := filepath.Ext(fileInfo.Name())
	mimeType := "image/jpeg"
	switch ext {
	case ".png":
		mimeType = "image/png"
	case ".gif":
		mimeType = "image/gif"
	}
	fmt.Println(ext, filePath)

	w.Header().Set("Content-Type", mimeType)
	http.ServeFile(w, r, filePath)
}

func GetAvatars(username string, w http.ResponseWriter, r *http.Request) string {

	// Handling avatar upload
	file, fileHeader, err := r.FormFile("avatar")
	if err != nil {
		fmt.Println("Error retrieving the file:", err)
		fmt.Println("here at avatar")
		return ""
	}

	fmt.Printf("Received file: %s, Size: %d bytes\n", fileHeader.Filename, fileHeader.Size)

	var avatarPath string
	if err == nil {
		defer file.Close()

		// Check if the file exceeds 1MB
		const maxFileSize = 1 * 1024 * 1024 // 1MB in bytes
		if fileHeader.Size > maxFileSize {
			http.Error(w, "File size exceeds 1MB", http.StatusRequestEntityTooLarge)
			return ""
		}

		// Ensure the uploads directory exists
		uploadDir := "./backend/database/assets/"

		// Create a unique file name
		fileName := fmt.Sprintf("%s_%s", username, fileHeader.Filename)
		avatarPath = filepath.Join(uploadDir, fileName)
		fmt.Println(avatarPath)

		// Create the file in the uploads directory
		outFile, err := os.Create(avatarPath)
		if err != nil {
			http.Error(w, "Could not save avatar", http.StatusInternalServerError)
			return ""
		}
		defer outFile.Close()

		// Copy the file content to the destination file
		_, err = io.Copy(outFile, file)
		if err != nil {
			http.Error(w, "Failed to save file", http.StatusInternalServerError)
			return ""
		}
	} else {
		fmt.Println("No avatar uploaded")
		avatarPath = ""
	}
	return avatarPath
}
