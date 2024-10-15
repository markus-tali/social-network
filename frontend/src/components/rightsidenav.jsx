import React, { useState, useEffect } from 'react';
import MessageInput from "./chatBox";

function RightSidenav({fromUsername}) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]); 


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

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setMessages([])
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
            Date: new Date().toLocaleString(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]); // Append the new message

    };

    return (
        <div className='users'>
            <h2>Userlist:</h2>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.Id}>
                            <button onClick={() => handleUserClick(user)}>
                                {user.username}
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No users found</li>
                )}
            </ul>
         
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
