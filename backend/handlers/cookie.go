package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"time"

	"main.go/backend/database/create"
)

var DB *sql.DB

func init() {
	var err error
	DB, err = create.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}
}

// mapped sessions
var Sessions = map[string]string{}

func generateSessionToken() (string, error) {
	token := make([]byte, 16)
	_, err := rand.Read(token)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(token), nil
}

func SetCookies(w http.ResponseWriter, r *http.Request, username string) {
	var sessionToken string

	// Does cookie excist
	cookie, err := r.Cookie("accessToken")
	if err != nil {
		if err == http.ErrNoCookie {
			//if not make new
			sessionToken, err = generateSessionToken()
			if err != nil {
				http.Error(w, "Unable to generate session token", http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, "Error retrieving cookie", http.StatusInternalServerError)
			return
		}
	} else {
		// If cookie found use it
		sessionToken = cookie.Value
	}

	expirationTime := time.Now().Add(30 * time.Minute)
	newCookie := http.Cookie{
		Name:     "accessToken",
		Value:    sessionToken,
		Expires:  expirationTime,
		MaxAge:   1800,
		Secure:   false,
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, &newCookie)

	expiry := time.Now().Add(30 * time.Minute)
	_, err = DB.Exec("INSERT INTO sessions (username, cookie, expiresAt) VALUES (?, ?, ?)", username, sessionToken, expiry)
	if err != nil {
		http.Error(w, "Unable to store session", http.StatusInternalServerError)
		return
	}

	fmt.Println("Session token is created or updated:", sessionToken, "for user", username)
}

func GetCookies(w http.ResponseWriter, r *http.Request) (bool, string, error) {

	cookie, err := r.Cookie("accessToken")

	if err != nil {
		if err == http.ErrNoCookie {
			fmt.Println("no cookie found, lets create new one")
			return false, "", nil
		}

		fmt.Println("err getting cookie")
		return false, "", err
	}

	sessionToken := cookie.Value

	var username string

	err = DB.QueryRow("SELECT username FROM sessions WHHERE cookie = ?", sessionToken).Scan(&username)
	if err == sql.ErrNoRows {
		fmt.Println("this is sessions bs 1")
		return false, "", nil
	} else if err != nil {
		fmt.Println("this is sessions bs 2")
		return false, "", err
	}
	return true, username, nil
}

func DeleteCookies(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("accessToken")
	if err != nil {
		return
	}
	sessionToken := cookie.Value

	//deleting from db
	_, err = DB.Exec("DELETE FROM sessions WHERE cookie = ?", sessionToken)
	if err != nil {
		fmt.Println("Error deleting session:", err)
		return
	}

	delete(Sessions, sessionToken) // Remove the session token
	cookie = &http.Cookie{
		Name:     "accessToken",
		Value:    "",
		MaxAge:   -1,
		Secure:   true,
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, cookie)
}
