import React, {useState, useEffect} from 'react'

const GroupList = () => {
    const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:8081/getgroups');
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMessages = async (groupId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/group/messages?groupId=${groupId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch group messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupMessages(selectedGroup.id);
    }
  }, [selectedGroup]);

  if (loading) {
    return <p>Loading groups...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div>
      <h2>Group List</h2>
      <ul>
        {groups.length > 0 ? (
          groups.map((group) => (
            <li key={group.id}>
              <button onClick={() => setSelectedGroup(group)}>
                {group.title}
              </button>
            </li>
          ))
        ) : (
          <p>No groups available</p>
        )}
      </ul>

      {/* Kui grupp on valitud, kuvame selle grupi vestluse */}
      {selectedGroup && (
        <div>
          <h3>Chat with {selectedGroup.title}</h3>
          <div>
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id}>
                  <strong>{message.sender}</strong>: {message.message}
                  <small> - {message.timestamp}</small>
                </div>
              ))
            ) : (
              <p>No messages</p>
            )}
          </div>
          <MessageInput groupId={selectedGroup.id} onSendMessage={fetchGroupMessages} />
        </div>
      )}
    </div>
  );
};

export default GroupList
