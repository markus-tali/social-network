package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetGroupPostsHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var receiveData struct {
		Group_id int `json:"group_id"`
	}
	fmt.Println("this is received data struct:", receiveData)

	type ResponseData struct {
		Posts []structs.Post `json:"posts"`
	}

	err := json.NewDecoder(r.Body).Decode(&receiveData)
	if err != nil {
		fmt.Println("Decode error:", err) // lisatud log aitab jälgida, kas dekodeerimine õnnestub
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	fmt.Println("Is this correct? : ", receiveData.Group_id)

	posts, err := get.GetAllGroupPosts(receiveData.Group_id)
	if err != nil {
		http.Error(w, "Failed to get groupposts", http.StatusInternalServerError)
		return
	}

	responseData := ResponseData{
		Posts: posts,
	}
	helpers.CheckError(err)

	jsonPosts, err := json.Marshal(responseData)
	if err != nil {
		http.Error(w, "Error marshaling posts to JSON", http.StatusInternalServerError)
		return
	}

	w.Write(jsonPosts)

}
