package handlers

import "net/http"

func CorsEnabler(w http.ResponseWriter, r *http.Request) {
	// Define allowed origins
	allowedOrigins := []string{
		"http://localhost:8080",
		"http://localhost:8082",
		// Extra port for testing purpose
	}
	// Get the origin of the incoming request
	origin := r.Header.Get("Origin")
	// Check if the origin is in the list of allowed origins
	isAllowed := false
	for _, o := range allowedOrigins {
		if origin == o {
			isAllowed = true
			break
		}
	}
	// If the origin is allowed, set the CORS headers
	if isAllowed {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
	} else {
		// Optionally handle disallowed origins (e.g., returning an error)
		http.Error(w, "CORS not allowed", http.StatusForbidden)
	}
}
