package handlers

import (
	"encoding/json"
	"net/http"
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

	// w.Write([]byte("User is logged in: " + username))
	response := map[string]interface{}{
		"isLoggedIn": true,
		"username":   username,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
