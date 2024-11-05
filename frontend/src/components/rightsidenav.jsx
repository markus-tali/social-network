import React, { useState, useEffect } from 'react';
import MessageInput from "./chatBox";
import { sendMessage } from './websocket';
import setupWebSocket from './websocket';

function RightSidenav({fromUsername}) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]); 
    const [isUserListVisible, setIsUserListVisible] = useState(false)

    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    console.log("notifcation: ", notifications)
    const [isNotificationDropdownVisible, setIsNotificationDropdownVisible] = useState(false);

    const [hasNewMessage, setHasNewMessage] = useState(false)
    const [newMessageUsers, setNewMessageUsers] = useState([])
    const [newMessageCount, setNewMessageCount] = useState({})

    const [isFollowingPrivateUser, setIsFollowingPrivateUser] = useState(false);

    

    useEffect(() => {
        const socket = setupWebSocket((message) => {
            console.log("Received WebSocket message:", message); // Logime kõik sõnumid
            console.log("Message type:", message.Type); // Logime sõnumi tüübi

            if (message.Type === "message" && message.To === fromUsername) {
                // Kui sõnum on mõeldud praegusele kasutajale, lisa see sõnumite loendisse
                setMessages((prevMessages) => [...prevMessages, message]);

                if (!selectedUser || message.From !== selectedUser.username) {
                    setNewMessageCount((prevCount) => ({
                        ...prevCount,
                        [message.From]: (prevCount[message.From] || 0) + 1, // Increase the count for this user
                    }));
                    setNewMessageUsers((prev) => [...new Set([...prev, message.From])])
                    setHasNewMessage(true); // New message from a user you're not chatting with
                }
            }
            if (message.Type ==="followRequest"){
                console.log("HURRAY, got in here!")
                setNotifications((prev) => [...prev, message])
                setHasNewNotification(true)
            }
            if (message.Type === "groupInvitation"){
                console.log("Hello, matey!")
                setNotifications((prev) => [...prev, message])
                setHasNewNotification(true)
            }
            if (message.Type === "acceptFollowRequest" && message.To === fromUsername) {
                console.log("Got in here to refresh page")
                // Handle immediate access to the private profile
                setIsFollowingPrivateUser(true);
                // Fetch the profile data or trigger a UI refresh as needed
            }
        });

        return () => {
            if (socket && socket.close) {
                socket.close(); // Close the socket if it exists
            }
        };
    ; // Puhastame WebSocketi ühenduse komponenti sulgedes
    }, [fromUsername, selectedUser]); // Jooksuta WebSocketi ühendus kasutaja nime põhjal

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                console.log("fetching notificatons")
                const response = await fetch(`http://localhost:8081/getnotifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: fromUsername }) // saadame kasutajanime kehas
                });
            const oldNotifications = await response.json() || []

                console.log("Fetched notifications: ", oldNotifications);
                setNotifications(oldNotifications || []);
                setHasNewNotification(oldNotifications.length > 0);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, [fromUsername]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8081/getusers', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log("Fetched users: ", data);
                if (data.users) {
                    setUsers(data.users);
                } else {
                    console.log('No users found');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, []); // Removed socket setup

    const handleUserClick = async (user) => {
        // Toggle the chat window off if the same user is clicked again
        if (selectedUser && selectedUser.username === user.username) {
            setSelectedUser(null);
            setMessages([]); // Reset messages when chat is closed
            return;
        }

        setSelectedUser(user);
        setMessages([])
        setHasNewMessage(false)
        setNewMessageUsers((prev) => prev.filter((username) => username !== user.username));
        setNewMessageCount((prevCount) => ({
            ...prevCount,
            [user.username]: 0, // Reset the count for this user
        }));

        //fetching old messages
        try{
            const response = await fetch('http://localhost:8081/getmessages', {
                method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({ toUser: user.username })

            })
            const oldMessages = await response.json()
            console.log("Old messages: ", oldMessages)

            if (Array.isArray(oldMessages)) {
                // Lisame vanad sõnumid sõnumite loendisse
                setMessages((prevMessages) => [...oldMessages, ...prevMessages]);
            } else {
                console.log('No old messages found');
            }
        }
        catch(error) {
            console.error('Error fetching messages:', error)
        }
    };

    const handleCloseChat = () => {
        setSelectedUser(null);
        setMessages([])
    };

    const handleSendMessage = (messageContent) => {
        if (!selectedUser) return;

        const newMessage = {
            Type: "message",
            From: fromUsername,
            Message: messageContent,
            To: selectedUser.username,
            Date: new Date().toLocaleString(),
        };

        console.log("new message thingy we do rna", newMessage)
        
        sendMessage(newMessage)

        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };


    const handleAcceptNotification = async (FromUsername, ToUsername) => {
        const acceptFollowMessage = {
            type: "acceptFollowRequest",
            from: FromUsername,
            to: ToUsername,
        };
        sendMessage(acceptFollowMessage);
    
        // Optionally update the UI
        setNotifications((prev) => {
            const updatedNotifications = prev.filter((n) => n.From !== FromUsername);
            setHasNewNotification(updatedNotifications.length > 0); // Update icon if no more notifications
            return updatedNotifications;
        });
        
    };

    const handleRejectNotification = async (FromUsername, ToUsername) => {
        const rejectFollowMessage = {
            type: "rejectFollowRequest",
            from: FromUsername,
            to: ToUsername,
        };
        sendMessage(rejectFollowMessage);

        setNotifications((prev) => {
            const updatedNotifications = prev.filter((n) => n.From !== FromUsername);
            setHasNewNotification(updatedNotifications.length > 0); // Update icon if no more notifications
            return updatedNotifications;
        });;
    };

    const toggleUserList = () => {
        setIsUserListVisible(!isUserListVisible)
    }

    const toggleNotificationDropdown = () => {
        setIsNotificationDropdownVisible(!isNotificationDropdownVisible);

    };
    

    return (
        <div className='users'>
            <button className='notificationButton' onClick={toggleNotificationDropdown}>
              <img className='notificationImg' src={hasNewNotification ? "src/assets/notificationbell2.png" : "src/assets/notificationbell1.png"} alt="messages" />
          </button>

          {isNotificationDropdownVisible && (
    <div className="notificationDropdown">
        <h4>Notifications</h4>
        {notifications.length === 0 ? (
            <p>No notifications</p>
        ) : (
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        {notification.Type === "followRequest" && (
                            <>
                                {notification.From} wants to follow you.
                                <button onClick={() => handleAcceptNotification(notification.From, notification.To)}>Accept</button>
                                <button onClick={() => handleRejectNotification(notification.From, notification.To)}>Reject</button>
                            </>
                        )}
                        {notification.Type === "groupInvitation" && (
                            <>
                                {notification.From} invited you to join group {notification.GroupName || "a group"}.
                                <button onClick={() => handleAcceptGroupInvite(notification.GroupId)}>Accept</button>
                                <button onClick={() => handleRejectGroupInvite(notification.GroupId)}>Reject</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        )}
    </div>
)}

            <button className='userListButton' onClick={toggleUserList}>
                <img className='userListImg' src={hasNewMessage ? "src/assets/notifiation2.png" : "src/assets/notification1.png"} alt="messages" />
         </button>

        {isUserListVisible &&(
        <div>
            <h2>Userlist:</h2>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.Id}>
                            <button  onClick={() => handleUserClick(user)}>
                            <span style={{ fontWeight: newMessageUsers.includes(user.username) ? 'bold' : 'normal' }}>
                                            {user.username}
                                            {newMessageCount[user.username] > 0 && (
                                                <span> ({newMessageCount[user.username]})</span>
                                            )}
                                        </span>
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No users found</li>
                )}
            </ul>
</ div>
                )}
         
            {selectedUser && (
                <div className='chatWindow'>
                    <h3>Chat with {selectedUser.username}</h3>
                    <div className='messageDisplay'>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.From}</strong>: {msg.Message} ({msg.Date})
                            </div>
                        ))}
                    </div>
                    <MessageInput onSendMessage={handleSendMessage} />
                </div>
            )}
        </div>
    );
}


export default RightSidenav;
