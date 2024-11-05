package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"main.go/backend/database/get"
	"main.go/backend/helpers"
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
		helpers.CheckError(err)
		fmt.Println("error get user by nameoremail")
		http.Error(w, "Username or email does not exist", http.StatusForbidden)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		helpers.CheckError(err)
		fmt.Println("error compare pass")
		http.Error(w, "Incorrect password", http.StatusUnauthorized)
		return
	}

	SetCookies(w, r, user.Username)

	userData := map[string]interface{}{
		"Username":    user.Username,
		"Email":       user.Email,
		"Firstname":   user.FirstName,
		"Lastname":    user.LastName,
		"DateOfBirth": user.DateofBirth,
		"Avatar":      user.Avatar,
		"Nickname":    user.Nickname,
		"AboutMe":     user.AboutMe,
		"IsPrivate":   user.IsPrivate,
		"FollowedBy":  user.FollowedBy,
		"IsFollowing": user.IsFollowing,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userData)
	if err != nil {
		http.Error(w, "Failed to encode user data", http.StatusInternalServerError)
		return
	}
}
