package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
)

func SessionHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	isValid, username, err := GetCookies(w, r)
	if err != nil || !isValid {
		http.Error(w, "No valid session", http.StatusUnauthorized)
		return
	}
	user, err := get.GetUserByUsernameOrEmail(username)
	if err != nil || user == nil {
		fmt.Println("error get user by nameoremail")
		http.Error(w, "Username or email does not exist", http.StatusForbidden)
		return
	}

	// w.Write([]byte("User is logged in: " + username))
	response := map[string]interface{}{
		"isLoggedIn":  true,
		"Username":    user.Username,
		"Email":       user.Email,
		"Firstname":   user.FirstName,
		"Lastname":    user.LastName,
		"DateOfBirth": user.DateofBirth,
		"Avatar":      user.Avatar,
		"Nickname":    user.Nickname,
		"AboutMe":     user.AboutMe,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
