package handlers

import (
	"fmt"
	"net/http"

	"main.go/backend/database/set"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	// Parse the multipart form data
	err := r.ParseMultipartForm(10 << 20) // Limit your file size (e.g., 10MB)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	dateofBirth := r.FormValue("dateofBirth")
	username := r.FormValue("username")
	password := r.FormValue("password")
	firstname := r.FormValue("firstName")
	lastname := r.FormValue("lastName")
	email := r.FormValue("email")
	aboutMe := r.FormValue("aboutMe")
	nickname := r.FormValue("nickname")

	fmt.Println("Received inputdata", dateofBirth, username, password, firstname, lastname, email, aboutMe, nickname)
	// Send a response back to the client

	set.InsertUser(username, firstname, lastname, email, password)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
