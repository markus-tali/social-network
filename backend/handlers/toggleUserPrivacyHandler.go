package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/update"
)

func ToggleUserPrivacyHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var userData struct {
		Username  string `json:"username"`
		IsPrivate bool   `json:"isPrivate"`
	}

	err := json.NewDecoder(r.Body).Decode(&userData)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	username := userData.Username
	isPrivate := userData.IsPrivate
	update.UpdateUserPrivacy(username, isPrivate)

	// Tagastab uuendatud isPrivate väärtuse JSON vastuses
	response := struct {
		IsPrivate bool `json:"isPrivate"`
	}{
		IsPrivate: isPrivate,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
