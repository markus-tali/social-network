package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"main.go/backend/database/get"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	var loginData map[string]string

	err := json.NewDecoder(r.Body).Decode(&loginData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	usernameOrEmail := loginData["usernameOrEmail"]
	password := loginData["password"]

	user, err := get.GetUserByUsernameOrEmail(usernameOrEmail)
	if err != nil || user == nil {
		http.Error(w, "Username or email does not exist", http.StatusForbidden)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		http.Error(w, "Incorrect password", http.StatusUnauthorized)
		return
	}

	fmt.Println("Received input in login: " + usernameOrEmail + " " + password)

	SetCookies(w, r, user.Username)
	c, _ := r.Cookie("accessToken")
	fmt.Println("login cookie", c)

}
