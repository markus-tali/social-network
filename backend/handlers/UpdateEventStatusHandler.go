package handlers

import (
	"encoding/json"
	"net/http"

	"main.go/backend/database/set"
)

func UpdateEventStatusHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var statusRequest struct {
		EventID  int    `json:"event_id"`
		Username string `json:"username"`
		Status   string `json:"status"`
	}

	err := json.NewDecoder(r.Body).Decode(&statusRequest)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if statusRequest.Status != "going" && statusRequest.Status != "not going" {
		http.Error(w, "Invalid status", http.StatusBadRequest)
		return
	}

	err = set.InsertEventStatus(statusRequest.EventID, statusRequest.Username, statusRequest.Status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := map[string]string{"message": "Participation updated successfully"}
	json.NewEncoder(w).Encode(response)

}
