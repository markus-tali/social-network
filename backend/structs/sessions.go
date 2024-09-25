package structs

import "time"

type Session struct {
	Id      string    `json:"id"`
	Cookie  string    `json:"cookie"`
	Expires time.Time `json:"expires"`
}
