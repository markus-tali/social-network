package handlers

import (
	"encoding/json"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
)

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	_, _, err := GetCookies(w, r)

	helpers.CheckError(err)

	users, err := get.GetAllUsers()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(users)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}
