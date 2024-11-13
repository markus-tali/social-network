package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/set"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func CreateGroupHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	fmt.Println("got in creategrouphandler")

	var req structs.GroupCreationRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		helpers.CheckError(err)
		return
	}

	_, creatorUsername, err := GetCookies(w, r)
	if err != nil {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		helpers.CheckError(err)
		return
	}

	// Create group in the database
	groupID, err := set.CreateGroup(creatorUsername, req.Title, req.Description)
	if err != nil {
		http.Error(w, "Failed to create group", http.StatusInternalServerError)
		helpers.CheckError(err)
		return
	}

	//add the creator of the group into the group members
	err = set.AddGroupMember(groupID, creatorUsername, "accepted")

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(struct {
		ID    int    `json:"id"`
		Title string `json:"title"`
	}{ID: groupID, Title: req.Title})
}
