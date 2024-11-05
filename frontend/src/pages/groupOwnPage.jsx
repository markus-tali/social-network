import React, {useEffect, useState}from 'react';

const GroupOwnPage = ({ourUserData, group, onClose, websocket}) => {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for invitation
    const [inviteError, setInviteError] = useState(null);


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
            useEffect(() => {
            fetchUsers();
        }, []); 

        
    // Function to handle sending the invitation
    const handleSendInvitation = () => {
        if (!selectedUser) {
            setInviteError('Please select a user to invite.');
            return;
        }

        console.log("b4 websocket in groupOwnPage")

        const invitationMessage = {
            From: ourUserData.Username, 
            Type: "groupInvitation",
            To: selectedUser,
            GroupId: group.id,
            GroupName: group.title,
            Date: new Date().toLocaleString(),
        };
        console.log("this is invitationmessage:", invitationMessage)
        // Send invitation message over WebSocket
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            console.log("Invitation sent successfully to WebSocket.");

            websocket.send(JSON.stringify(invitationMessage));
            alert(`Invitation sent to ${selectedUser}!`);
            setSelectedUser(null); // Reset the selected user after sending
            setInviteError(null); // Clear any previous error
        } else {
            console.log("WebSocket is not connected. ReadyState:", websocket?.readyState);
            setInviteError('WebSocket is not connected. Please try again later.');
        }
    };

   
    return (
        <div>
            <button onClick={onClose}>Back to Groups</button>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
            <h3>Group Members</h3>
            <ul>
                {group.members?.map((member, index) => (
                    <li key={index}>{member.username}</li>
                ))}
            </ul>

        
            <h3>Invite a User to Join</h3>
            <select
                value={selectedUser || ''}
                onChange={(e) => setSelectedUser(e.target.value)}
            >
                <option value="" disabled>Select a user</option>
                {users.map((user) => (
                    <option key={user.username} value={user.username}>
                        {user.username}
                    </option>
                ))}
            </select>
            <button onClick={handleSendInvitation}>Send Invitation</button>
 {inviteError && <p style={{ color: 'red' }}>{inviteError}</p>}
        </div>
    );
};

export default GroupOwnPage;
