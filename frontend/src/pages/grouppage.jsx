import React, {useState, useEffect} from 'react'
import  GroupOwnPage  from "./groupOwnPage.jsx";

const GroupPage = ({userData, websocket}) => {
    const [newGroupTitle, setNewGroupTitle] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [error, setError] = useState(null);

    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isGroupsVisible, setIsGroupsVisible] = useState(false);

    const handleCreateGroup = async () => {
        try {
            const response = await fetch('http://localhost:8081/creategroup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Title: newGroupTitle,
                    Description: newGroupDescription,
                    Invites: selectedFriends,
                }),
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to create group');
            const data = await response.json();
            alert(`Group "${data.title}" created successfully!`);
            setNewGroupTitle('');
            setNewGroupDescription('');
            setSelectedFriends([]);
        } catch (error) {
            console.error('Error creating group:', error);
            setError('Could not create group. Try again.');
        }
    };

    useEffect(() => {
        if (!userData || !userData.Username) return;
        const fetchGroups = async () => {
            try {
                const response = await fetch("http://localhost:8081/getgroups", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: userData.Username }),
                });
                if (!response.ok) throw new Error("Failed to fetch groups");

                const groupsData = await response.json();
                setGroups(groupsData || []);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        fetchGroups();
    }, [userData.Username]);

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
    };
    const handleBackToGroups = () => {
        setSelectedGroup(null);
    };
    const toggleGroupsVisibility = () => {
        setIsGroupsVisible((prev) => !prev); // Vaheta gruppide nähtavust
    };

  return (
    <div className='groupPage'>
    {selectedGroup ? (
        <GroupOwnPage ourUserData={userData} group={selectedGroup} onClose={handleBackToGroups} websocket={websocket} />
    ) : (
        <>
            <h1 className='groupPageH1'>Create a New Group</h1>
            <input className='groupPageInput'
                type="text"
                placeholder="Group Title"
                value={newGroupTitle}
                onChange={(e) => setNewGroupTitle(e.target.value)}
            />
            <textarea className='groupPageTextArea'
                placeholder="Group Description"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
            />


            <button className='groupPageButton' onClick={handleCreateGroup}>Create Group</button>
            {error && <p className="error">{error}</p>}

            <div>
                <h3 className='groupPageH3' onClick={toggleGroupsVisibility}>Groups</h3>
                {groups.length > 0 ? (
                    <ul>
                        {groups.map((group) => (
                            <button className='groupButtons' key={group.id} onClick={() => handleGroupClick(group)}>
                                <h4>{group.title}</h4>
                            </button>
                        ))}
                    </ul>
                ) : (
                    <p>No groups created yet.</p>
                )}
            </div>
        </>
    )}
</div>
);
};

export default GroupPage
