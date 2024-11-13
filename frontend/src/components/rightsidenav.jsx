import React, { useState, useEffect } from 'react';
import MessageInput from "./chatBox";
import { sendMessage } from './websocket';
import setupWebSocket from './websocket';
import GroupList from "./groupList.jsx";

function RightSidenav({fromUsername}) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [selectedGroup, setSelectedGroup] = useState(null)

    const [messages, setMessages] = useState([]); 
    const [isUserListVisible, setIsUserListVisible] = useState(false)

    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationDropdownVisible, setIsNotificationDropdownVisible] = useState(false);

    const [hasNewMessage, setHasNewMessage] = useState(false)
    const [newMessageUsers, setNewMessageUsers] = useState([])
    const [newMessageGroups, setNewMessageGroups] = useState([])
    const [newMessageCount, setNewMessageCount] = useState({})

    const [isFollowingPrivateUser, setIsFollowingPrivateUser] = useState(false);

    console.log("here are the notifications: ", notifications)


    useEffect(() => {
        const socket = setupWebSocket((message) => {

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

            if(message.Type === "groupMessage"){
                setMessages((prevMessages) => [...prevMessages, message]);

                if (!selectedGroup || message.Group_id !== selectedGroup.id) {
                    setNewMessageCount((prevCount) => ({
                        ...prevCount,
                        [message.Group_id]: (prevCount[message.Group_id] || 0) + 1, // Increment count for this group
                    }));
                }
                setNewMessageGroups((prev) => [...new Set([...prev, message.Group_id])])
                setHasNewMessage(true)
        }

            if (message.Type ==="followRequest"){
                setNotifications((prev) => [...prev, message])
                setHasNewNotification(true)
            }
            if (message.Type === "groupInvitation"){
                setNotifications((prev) => [...prev, message])
                setHasNewNotification(true)
            }
            if (message.Type === "acceptFollowRequest" && message.To === fromUsername) {
                // Handle immediate access to the private profile
                setIsFollowingPrivateUser(true);
                // Fetch the profile data or trigger a UI refresh as needed
            }
            if (message.Type === "joinGroupRequest"){
                setNotifications((prev) => [...prev, message])
                setHasNewNotification(true)
            }
            if (message.Type === "eventNotification"){
                setNotifications((prev) => [...prev, message])
                setHasNewNotification(true)
            }
        });

        return () => {
            if (socket && socket.close) {
                socket.close(); // Close the socket if it exists
            }
        };
    ; // Puhastame WebSocketi ühenduse komponenti sulgedes
    }, [fromUsername, selectedUser, selectedGroup]); // Jooksuta WebSocketi ühendus kasutaja nime põhjal

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`http://localhost:8081/getnotifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: fromUsername }) // saadame kasutajanime kehas
                });
            const oldNotifications = await response.json() || []

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
        setSelectedGroup(null)
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

    const handleGroupClick = async (group) => {
        if (selectedGroup && selectedGroup.id === group.id) {
            setSelectedGroup(null);
            setMessages([]); // Clear messages when closing the chat
            return;
        }

        setSelectedGroup(group);
        setSelectedUser(null); // Clear selectedUser to indicate a group chat
        setMessages([]);
        setNewMessageCount((prevCount) => ({ ...prevCount, [group.id]: 0 }))
        setHasNewMessage(false)


        // Fetch group messages here
        try{
            const response = await fetch('http://localhost:8081/getgroupmessages', {
                method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({ Group_id: parseInt(group.id, 10) })

            })
            const oldMessages = await response.json()

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

        const newMessage = {
            Type: selectedGroup ? "groupMessage" : "message",
            From: fromUsername,
            Message: messageContent,
            Date: new Date().toLocaleString(),
            ...(selectedGroup ? {Group_id: parseInt(selectedGroup.id, 10)} : {To: selectedUser.username })
        };

        console.log("Hello world ", newMessage)
        sendMessage(newMessage)

        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };


    const handleAcceptNotification = async (FromUsername, ToUsername) => {
        const acceptFollowMessage = {
            Type: "acceptFollowRequest",
            From: FromUsername,
            To: ToUsername,
        };
        sendMessage(acceptFollowMessage);
    
        // Remove notification from list
        setNotifications((prev) => {
            const updatedNotifications = prev.filter(
                (n) => !(n.Type === "followRequest" && n.From === FromUsername && n.To === ToUsername)
            );
            setHasNewNotification(updatedNotifications.length > 0);
            return updatedNotifications;
        });
        
    };

    const handleRejectNotification = async (FromUsername, ToUsername) => {
        const rejectFollowMessage = {
            Type: "rejectFollowRequest",
            From: FromUsername,
            To: ToUsername,
        };
        sendMessage(rejectFollowMessage);

        // Remove notification from list
        setNotifications((prev) => {
            const updatedNotifications = prev.filter(
                (n) => !(n.Type === "followRequest" && n.From === FromUsername && n.To === ToUsername)
            );
            setHasNewNotification(updatedNotifications.length > 0);
            return updatedNotifications;
        });;
    };

    const handleAcceptGroupInvite = async (GroupId, ToUsername, FromUsername) => {
        const acceptInviteMessage = {
            Type: "acceptInviteMessage",
            Group_id: GroupId,
            To: ToUsername,
            From: FromUsername
        }
        sendMessage(acceptInviteMessage);
    
        // Remove notification from list
        setNotifications((prev) => {
            const updatedNotifications = prev.filter(
                (n) => !(n.Type === "groupInvitation" && n.Group_id === GroupId && n.From === FromUsername && n.To === ToUsername)
            );
            setHasNewNotification(updatedNotifications.length > 0);
            return updatedNotifications;
        });
    }
    const handleRejectGroupInvite = async (GroupId, ToUsername,  FromUsername) => {
        const rejectInviteMessage = {
            Type: "rejectInviteMessage",
            Group_id: GroupId,
            To: ToUsername,
            From: FromUsername

            
            
        }
        sendMessage(rejectInviteMessage)

        // Remove notification from list
         setNotifications((prev) => {
            const updatedNotifications = prev.filter(
                (n) => !(n.Type === "groupInvitation" && n.Group_id === GroupId && n.From === FromUsername && n.To === ToUsername)
            );
            setHasNewNotification(updatedNotifications.length > 0);
            return updatedNotifications;
         })
    }

    const handleAcceptGroupJoin = async (GroupId, ToUsername, FromUsername) => {
        const acceptGroupJoinMessage = {
            Type: "acceptGroupJoin",
            Group_id: GroupId,
            To: ToUsername,
            From: FromUsername
        }
        sendMessage(acceptGroupJoinMessage);
    
        // Remove notification from list
        setNotifications((prev) => {
            const updatedNotifications = prev.filter(
                (n) => !(n.Type === "joinGroupRequest" && n.Group_id === GroupId && n.To === FromUsername && n.From === ToUsername)
            );
            setHasNewNotification(updatedNotifications.length > 0);
            return updatedNotifications;
        });
    }

    const handleRejectGroupJoin = async (GroupId, ToUsername, FromUsername) => {
        const rejectGroupJoinMessage = {
            Type: "rejectGroupJoin",
            Group_id: GroupId,
            To: ToUsername,
            From: FromUsername
        }
        sendMessage(rejectGroupJoinMessage);
    
        // Remove notification from list
        setNotifications((prev) => {
            const updatedNotifications = prev.filter(
                (n) => !(n.Type === "joinGroupRequest" && n.Group_id === GroupId && n.To === FromUsername && n.From === ToUsername)
            );
            setHasNewNotification(updatedNotifications.length > 0);
            return updatedNotifications;
        });
    }
    const handleOKEvent = async (GroupId, ToUsername, FromUsername) => {
        const OKEventMessage = {
            Type: "OKEvent",
            Group_id: GroupId,
            To: ToUsername,
            From: FromUsername
        }
        sendMessage(OKEventMessage)
    
        // Remove notification from list
        setNotifications((prev) => {
            const updatedNotifications = prev.filter(
                (n) => !(n.Type === "eventNotification" && n.Group_id === GroupId && n.From === FromUsername && n.To === ToUsername)
            );
            setHasNewNotification(updatedNotifications.length > 0);
            return updatedNotifications;
        });
    }
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
                    <li className='notification' key={index}>
                        {notification.Type === "followRequest" && (
                            <>
                                {notification.From} wants to follow you.
                                <button className='notButton' onClick={() => handleAcceptNotification(notification.From, notification.To)}>Accept</button>
                                <button className='notButton' onClick={() => handleRejectNotification(notification.From, notification.To)}>Reject</button>
                            </>
                        )}
                        {notification.Type === "groupInvitation" && (
                            <>
                                {notification.From} invited you to join group {notification.GroupTitle}
                                <button className='notButton' onClick={() => handleAcceptGroupInvite(notification.Group_id, notification.To, notification.From)}>Accept</button>
                                <button className='notButton' onClick={() => handleRejectGroupInvite(notification.Group_id, notification.To, notification.From)}>Reject</button>
                            </>
                        )}
                        {notification.Type === "joinGroupRequest" && (
                            <>
                                {notification.From} wants to join group {notification.Title}
                                <button className='notButton' onClick={() => handleAcceptGroupJoin(notification.Group_id, notification.From, notification.To)}>Accept</button>
                                <button className='notButton' onClick={() => handleRejectGroupJoin(notification.Group_id, notification.From, notification.To)}>Reject</button>
                            </>
                        )}
                         {notification.Type === "eventNotification" && (
                            <>
                                {notification.From} has created an event in {notification.GroupTitle}
                                <button className='notButton' onClick={() => handleOKEvent(notification.Group_id, notification.To, notification.From)}>OK</button>

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
        <div className='isUserListsVisible'>
            <h2>Userlist:</h2>
            <ul className='userListsUl'>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li  key={user.Id}>
                            <button className='userListsButton'  onClick={() => handleUserClick(user)}>
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
            < GroupList ourUsername={fromUsername} selectedGroup={selectedGroup} onGroupSelect={handleGroupClick} messages={messages} setMessages={setMessages} newMessageCount={newMessageCount} newMessageGroups={newMessageGroups}/>
            
</ div>

                )}
         
            {(selectedUser || selectedGroup) && (
                <div className='chatWindow'>
                    <h3>Chat with {selectedGroup ? selectedGroup.title : selectedUser.username}</h3>
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
