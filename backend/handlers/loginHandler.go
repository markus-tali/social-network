package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
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

	fmt.Println("Received input: " + usernameOrEmail + " " + password)

}
