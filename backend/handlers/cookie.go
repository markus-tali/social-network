package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"
)

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
	sessionToken, err := generateSessionToken()
	if err != nil {
		http.Error(w, "Unable to generate session token", http.StatusInternalServerError)
		return
	}
	expirationTime := time.Now().Add(30 * time.Minute)
	cookie := http.Cookie{
		Name:     "accessToken",
		Value:    sessionToken,
		MaxAge:   1800,
		Expires:  expirationTime,
		Secure:   true,
		HttpOnly: false,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, &cookie)
	// Store session token in session manager
	Sessions[sessionToken] = username
	fmt.Printf("Session token is created! Token: %v for user %v\n", sessionToken, username)
}
func GetCookies(w http.ResponseWriter, r *http.Request) (bool, string, error) {
	cookie, err := r.Cookie("accessToken")
	if err != nil {
		if err == http.ErrNoCookie {
			return false, "", nil
		}
		return false, "", err
	}
	sessionToken := cookie.Value
	username, ok := Sessions[sessionToken]
	if !ok {
		return false, "", nil
	}
	return true, username, nil
}
func DeleteCookies(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("accessToken")
	if err != nil {
		return
	}
	sessionToken := cookie.Value
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
