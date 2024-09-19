package handlers

import "net/http"

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	DeleteCookies(w, r)

	// send a response back to the client
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logged out successfully"))
}
