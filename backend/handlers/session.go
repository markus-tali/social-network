package handlers

import "net/http"

func SessionHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	isValid, username, err := GetCookies(w, r)
	if err != nil || !isValid {
		http.Error(w, "No valid session", http.StatusUnauthorized)
		return
	}

	w.Write([]byte("User is logged in: " + username))
}
