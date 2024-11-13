package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/helpers"
	"main.go/backend/structs"

	"main.go/backend/database/set"
)

func CreateEventHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}
	fmt.Println("this iscretehandler")

	var Event structs.Event

	if err := json.NewDecoder(r.Body).Decode(&Event); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	fmt.Println("this is event:", Event)
	eventId, err := set.InsertEvent(Event.Username, Event.Title, Event.Description, Event.Time, Event.Group_id)
	helpers.CheckError(err)

	fmt.Println(eventId)

	response := map[string]interface{}{
		"eventId": eventId,
	}

	// Encode and send response as JSON
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		helpers.CheckError(err)
	}
}
