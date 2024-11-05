package main

import (
	"fmt"
	"log"
	"net/http"

	"main.go/backend/handlers"
	"main.go/backend/utils"
)

func main() {
	http.HandleFunc("/ws", handlers.WsHandler)
	http.HandleFunc("/register", handlers.RegisterHandler)
	http.HandleFunc("/login", handlers.LoginHandler)
	http.HandleFunc("/logout", handlers.LogoutHandler)
	http.HandleFunc("/session", handlers.SessionHandler)
	http.HandleFunc("/createpost", handlers.CreatePostHandler)
	http.HandleFunc("/createcomment", handlers.CreateCommentHandler)
	http.HandleFunc("/getcomments", handlers.GetCommentHandler)
	http.HandleFunc("/getposts", handlers.GetPostsHandler)
	http.HandleFunc("/getusers", handlers.GetUsersHandler)
	http.HandleFunc("/getmessages", handlers.GetMessagesHandler)
	http.HandleFunc("/utils/avatar/", utils.ServeAvatar)
	http.HandleFunc("/getselecteduser", handlers.GetSelectedUserHandler)
	http.HandleFunc("/toggleuserprivacy", handlers.ToggleUserPrivacyHandler)
	http.HandleFunc("/follow", handlers.FollowHandler)
	http.HandleFunc("/unfollow", handlers.UnfollowHandler)
	http.HandleFunc("/getnotifications", handlers.GetNotificationHandler)
	http.HandleFunc("/acceptfollow", handlers.AcceptFollowHandler)
	http.HandleFunc("/rejectfollow", handlers.RejectFollowHandler)
	http.HandleFunc("/checkfollowstatus", handlers.CheckFollowStatusHandler)
	http.HandleFunc("/getfollowers", handlers.GetFollowersHandler)
	http.HandleFunc("/getfollows", handlers.GetFollowsHandler)
	http.HandleFunc("/getmyposts", handlers.GetMyPostsHandler)
	http.HandleFunc("/creategroup", handlers.CreateGroupHandler)
	http.HandleFunc("/getgroups", handlers.GetAllGroupsHandler)

	fmt.Println("Backend server is running")

	log.Fatal(http.ListenAndServe(":8081", nil))
}
