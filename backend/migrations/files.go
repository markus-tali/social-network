package utils

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func SaveFile(r *http.Request, username, method string) (string, error) {
	file, fileHeader, err := r.FormFile("avatar")
	if err != nil {
		fmt.Println("Register error decoding JSON", err)
		return "No avatar", err
	}
	defer file.Close()

	fileName := filepath.Base(fileHeader.Filename)
	uniquePath := fmt.Sprintf("%s_%s_%s", username, method, fileName)

	saveDir := "./database/assets"

	filePath := filepath.Join(saveDir, uniquePath)

	outFile, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer outFile.Close()

	if _, err := io.Copy(outFile, file); err != nil {
		return "", err
	}

	return filePath, nil

}
