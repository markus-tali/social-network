package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
)

func GetAllGroupsHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	groups, err := get.GetAllGroups()

	helpers.CheckError(err)

	fmt.Println("here are thy groups, getusergroupshandler: ", groups)
	w.Header().Set("Content-Type", "application/json")

	if err != nil {
		http.Error(w, "Failed to encode user data", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(groups)
}
