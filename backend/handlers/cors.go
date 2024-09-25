package handlers

import "net/http"

func CorsEnabler(w http.ResponseWriter, r *http.Request) {
	// Define allowed origins
	allowedOrigins := []string{
		"http://localhost:5173",
		"http://localhost:5174",
		// Add any other allowed origins
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

	// Always respond to preflight requests (OPTIONS)
	if r.Method == "OPTIONS" {
		// Allow all origins in preflight requests to avoid blocking
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.WriteHeader(http.StatusOK)
		return
	}

	// If the origin is allowed, set the CORS headers
	if isAllowed {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
	}
}
