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
	if r.Method != "POST" {
		return
	}

	var loginData struct {
		Username string `json:"usernameOrEmail"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&loginData)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	usernameOrEmail := loginData.Username
	password := loginData.Password

	user, err := get.GetUserByUsernameOrEmail(usernameOrEmail)
	if err != nil || user == nil {
		fmt.Println("error get user by nameoremail")
		http.Error(w, "Username or email does not exist", http.StatusForbidden)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		fmt.Println("error compare pass")
		http.Error(w, "Incorrect password", http.StatusUnauthorized)
		return
	}

	fmt.Println("Received input in login: " + usernameOrEmail + " " + password)

	SetCookies(w, r, user.Username)
	c, _ := r.Cookie("accessToken")
	fmt.Println("login cookie", c)
}
