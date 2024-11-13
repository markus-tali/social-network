package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetGroupMembersHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var receiveData struct {
		Group_id string `json:"Group_id"`
	}

	type ResponseData struct {
		Members []structs.GroupMembers `json:"group_members"`
	}

	err := json.NewDecoder(r.Body).Decode(&receiveData)
	if err != nil {
		fmt.Println("Decode error:", err) // lisatud log aitab jälgida, kas dekodeerimine õnnestub
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	groupIdStr, err := strconv.Atoi(receiveData.Group_id)
	helpers.CheckError(err)

	members, err := get.GetGroupMembers(groupIdStr)

	responseData := ResponseData{
		Members: members,
	}
	helpers.CheckError(err)
	jsonMembers, err := json.Marshal(responseData)
	if err != nil {
		http.Error(w, "Error marshaling posts to JSON", http.StatusInternalServerError)
		return
	}

	w.Write(jsonMembers)
}
