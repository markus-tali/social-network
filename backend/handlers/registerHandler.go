package handlers

import (
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/database/set"
	"main.go/backend/helpers"
	"main.go/backend/utils"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	err := r.ParseMultipartForm(1 << 20) // 1 MB limit
	if err != nil {
		http.Error(w, "Could not parse form, file too big", http.StatusBadRequest)
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

	//read avatar formvalue
	avatarPath := utils.GetAvatars(username, w, r)

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
