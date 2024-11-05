package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
)

func GetSelectedUserHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var userData struct {
		Username string `json:"username"`
	}

	err := json.NewDecoder(r.Body).Decode(&userData)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	username := userData.Username

	user, err := get.GetUserByUsernameOrEmail(username)

	// fmt.Println("Da user is: ", user)

	if err != nil || user == nil {
		helpers.CheckError(err)
		return
	}

	sendData := map[string]interface{}{
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
	json.NewEncoder(w).Encode(sendData)
	if err != nil {
		http.Error(w, "Failed to encode user data", http.StatusInternalServerError)
		return
	}
}
