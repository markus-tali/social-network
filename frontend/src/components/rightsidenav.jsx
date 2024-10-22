import React, { useState, useEffect } from 'react';
import MessageInput from "./chatBox";
import { sendMessage } from './websocket';
import setupWebSocket from './websocket';

function RightSidenav({fromUsername}) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]); 
    const [isUserListVisible, setIsUserListVisible] = useState(false)
    const [hasNewMessage, setHasNewMessage] = useState(false)
    const [newMessageUsers, setNewMessageUsers] = useState([])
    const [newMessageCount, setNewMessageCount] = useState({})

    useEffect(() => {
        const socket = setupWebSocket((message) => {

            console.log("Sõnum saabus websocketist: ", message)
            console.log("sonumi tyopr:", message.Type)
            console.log("sonumi saab:", message.To, "mina olen:", fromUsername)
            if (message.Type === "message" && message.To === fromUsername) {
                // Kui sõnum on mõeldud praegusele kasutajale, lisa see sõnumite loendisse
                console.log("sõnum saabus?")
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
        });

        return () => socket.close(); // Puhastame WebSocketi ühenduse komponenti sulgedes
    }, [fromUsername, selectedUser]); // Jooksuta WebSocketi ühendus kasutaja nime põhjal


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
            From: fromUsername,
            Message: messageContent,
            To: selectedUser.username,
            Date: new Date().toLocaleString(),
        };

        console.log("new message thingy we do rna", newMessage)
        
        sendMessage(newMessage)

        setMessages((prevMessages) => [...prevMessages, newMessage]); // Append the new message for local user
    };

    const toggleUserList = () => {
        setIsUserListVisible(!isUserListVisible)
    }

    return (
        <div className='users'>
        <button onClick={toggleUserList}>
        <img src={hasNewMessage ? "src/assets/notifiation2.png" : "src/assets/notification1.png"} alt="messages" />
        </button>
        {isUserListVisible &&(
<>
            <h2>Userlist:</h2>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.Id}>
                            <button onClick={() => handleUserClick(user)}>
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
</>
                )}
         
            {selectedUser && (
                <div className='chatWindow'>
                    <h3>Chat with {selectedUser.username}</h3>
                    <div
                        className='messageDisplay'
                        style={{ border: '1px solid black', height: '200px', overflowY: 'scroll' }}
                    >
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.From}</strong>: {msg.Message} ({msg.Date})
                            </div>
                        ))}
                    </div>
                    <MessageInput onSendMessage={handleSendMessage} />
                    <button onClick={handleCloseChat}>Close chat</button>
                </div>
            )}
        </div>
    );
}


export default RightSidenav;
