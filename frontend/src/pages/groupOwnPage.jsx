import React, {useEffect, useState}from 'react';
import CreatePost from '../pages/createpost.jsx';
import GroupPostList from '../components/groupPostList.jsx';
import { sendMessage } from '../components/websocket.jsx';
import GroupEvents from '../components/groupEvents.jsx';

const GroupOwnPage = ({ourUserData, group, onClose, websocket}) => {
    
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [inviteError, setInviteError] = useState(null);
    const [shouldRefreshPosts, setShouldRefreshPosts] = useState(false)
    const [isCreatingPost, setIsCreatingPost] = useState(false)
    const [groupMembers, setGroupMembers] = useState([]);
    const [isMember, setIsMember] = useState(false)
    const [joinRequestSent, setJoinRequestSent] = useState(false);
    
    // const [events, setEvents] = useState([]); 
    // const [userStatuses, setUserStatuses] = useState({});

    console.log("groupmembers are: ", groupMembers)

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

        const fetchGroupMembers = async () => {
            try {
                console.log("going into fetch")
                const response = await fetch('http://localhost:8081/getgroupmembers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Group_id: group.id,
                    }),
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.group_members) {
                    setGroupMembers(data.group_members);
                    // Check if the current user is a member of the group
                    const memberFound = data.group_members.some(
                        (member) => member.username === ourUserData.Username
                    );
                    setIsMember(memberFound);
                } else {
                    console.log('No members found for this group');
                }
            } catch (error) {
                console.log('Error fetching group members:', error);
            }
        }
            useEffect(() => {
                fetchUsers();
                fetchGroupMembers();
        }, []);


    // Function to handle sending the invitation
    const handleSendInvitation = () => {
        if (!selectedUser) {
            setInviteError('Please select a user to invite.');
            return;
        }

        
        
        const invitationMessage = {
            From: ourUserData.Username, 
            Type: "groupInvitation",
            To: selectedUser,
            Group_id: parseInt(group.id, 10),
            GroupTitle: group.title,
            Date: new Date().toLocaleString(),
        };
        
        
        sendMessage(invitationMessage)
        setSelectedUser(null); // Reset the selected user after sending
        setInviteError(null); // Clear any previous error
        
    };
    const handlePostCreated = () => {
        setIsCreatingPost(false)
        setShouldRefreshPosts((prev) => !prev);
    }

    const handleSendJoinRequest = () => {
        const joinRequestMessage = {
            From: ourUserData.Username,
            Type: "joinGroupRequest",
            To: group.creator, // Assuming `group.creator` holds the creator's username
            Group_id: parseInt(group.id, 10),
            GroupTitle: group.title,
            Date: new Date().toLocaleString(),
        };
        console.log("this is our joinRequestMessage: ", joinRequestMessage)
        sendMessage(joinRequestMessage);
        setJoinRequestSent(true); // Indicate that the request has been sent
    };
   
    return (
        <div className="groupOwnPageBody">
            {!isMember ? (
                <>
                    <button className="groupownBackButton" onClick={onClose}>Back to Groups</button>
                    <h2 className="groupOwnPageH2">{group.title}</h2>
                    <p className="groupDescription">{group.description}</p>

                    <p>You must be a group member to view posts and invite others.</p>
                    {!joinRequestSent ? (
                        <button onClick={handleSendJoinRequest}>Request to Join Group</button>
                    ) : (
                        <p>Join request sent to the group creator.</p>
                    )}
                </>
            ) : (
                <>

                <div className='groupOwnPageheader'>

                <button className="groupownBackButton" onClick={onClose}>Back to Groups</button>
                    <button className="buttonOwnGroupCreatePost" onClick={() => setIsCreatingPost((prev) => !prev)}>
                        {isCreatingPost ? 'Cancel' : 'Create New Post'}
                    </button>

                    <div className='invitationGroup'>

                        <select className='selectButton' value={selectedUser || ''} onChange={(e) => setSelectedUser(e.target.value)} >
                            <option value="" disabled>Select a user</option>
                            {users
                                .filter((user) => user.username !== ourUserData.Username) // Filter out the current user
                                .filter((user) => !groupMembers.some((member) => member.username === user.username))
                                .map((user) => (
                                    <option key={user.username} value={user.username}>
                                        {user.username}
                                    </option>
                                ))}
                        {inviteError && <p style={{ color: 'red' }}>{inviteError}</p>}
                        </select>
                                <button className='sendinvButton' onClick={handleSendInvitation}>Send Invitation</button>
                    </div>
                </div>

                <div className='groupInfo1'>
                    <h2 className="groupOwnPageH2">{group.title}</h2>
                <div className='groupInfo'>           
                    <p className="groupDescription">Description: {group.description}</p>
                    <h3 className="groupOwnPageH3">Group Members</h3>
                    <ul>
                        {groupMembers.map((member, index) => (
                            <li key={index}>{member.username}</li>
                        ))}
                    </ul>
                </div>
                </div>



                    <div className='groupPosts'>
                        {isCreatingPost ? (
                            <CreatePost  groupId={group.id} onPostCreated={handlePostCreated} />
                        ) : (
                            <GroupPostList refreshTrigger={shouldRefreshPosts} group={group} />
                        )}
                        <GroupEvents ourUserData={ourUserData} group={group} />
                    </div>

                </>
            )}
        </div>
    );
};

export default GroupOwnPage;
