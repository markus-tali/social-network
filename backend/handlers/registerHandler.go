package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"main.go/backend/database/get"
	"main.go/backend/database/set"
	"main.go/backend/helpers"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB limit
	if err != nil {
		http.Error(w, "Could not parse form", http.StatusBadRequest)
		return
	}

	dateofBirth := r.FormValue("dateofBirth")
	username := r.FormValue("username")
	password := r.FormValue("password")
	firstname := r.FormValue("firstName")
	lastname := r.FormValue("lastName")
	email := r.FormValue("email")
	aboutMe := r.FormValue("aboutMe")
	nickname := r.FormValue("nickname")

	// Check if email or username already exists
	if get.CheckExistingUsernameOrEmail(email) {
		http.Error(w, "Email already exists!", http.StatusConflict)
		return
	}
	if get.CheckExistingUsernameOrEmail(username) {
		http.Error(w, "Username already exists!", http.StatusConflict)
		return
	}

	// Handling avatar upload
	file, fileHeader, err := r.FormFile("avatar")
	if err != nil {
		fmt.Println("Error retrieving the file:", err)
		http.Error(w, "Error uploading file", http.StatusBadRequest)
		return
	}

	fmt.Printf("Received file: %s, Size: %d bytes\n", fileHeader.Filename, fileHeader.Size)

	var avatarPath string
	if err == nil {
		defer file.Close()

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
			return
		}
		defer outFile.Close()

		// Copy the file content to the destination file
		_, err = io.Copy(outFile, file)
		if err != nil {
			http.Error(w, "Failed to save file", http.StatusInternalServerError)
			return
		}
	} else {
		fmt.Println("No avatar uploaded")
		avatarPath = ""
	}

	hashedPswd, err := helpers.EncryptPassword(password)
	helpers.CheckError(err)

	set.InsertUser(username, firstname, lastname, email, hashedPswd, dateofBirth, aboutMe, nickname, avatarPath)
	if err != nil {
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
