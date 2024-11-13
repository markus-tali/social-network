import React, {useState, useEffect} from 'react'
import MessageInput from "./chatBox";
import { sendMessage } from './websocket';
import setupWebSocket from './websocket';


const GroupList = ({ourUsername, selectedGroup, onGroupSelect, messages, setMessages, newMessageCount, newMessageGroups}) => {
    const [groups, setGroups] = useState([]);
  
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Here should be the groupMessages: ", messages)

// useEffect(() => {
//   const socket = setupWebSocket((message) => {
//     console.log("recieved message::::::", message)
//     if (message.Type === "groupMessage"){
//     console.log("recieved message::::::43214", message)

//       setMessages((prevMessages) => [...prevMessages, message]);
//     }
//   })
//   return () => {
//     if (socket && socket.close) {
//         socket.close(); // Close the socket if it exists
//     }
// };
// ; // Puhastame WebSocketi ühenduse komponenti sulgedes
// }, [selectedGroup])


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

  const handleSendMessage = (messageContent) => {
    if (!selectedGroup) return;

    const newMessage = {
        Type: "groupMessage",
        From: ourUsername,
        Message: messageContent,
        Group_id: parseInt(selectedGroup.id,10),
        Date: new Date().toLocaleString(),
    };

    
    sendMessage(newMessage)

    setMessages((prevMessages) => [...prevMessages, newMessage]);
};


  // const fetchGroupMessages = async (groupId) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`http://localhost:8081/api/group/messages?groupId=${groupId}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch group messages');
  //     }
  //     const data = await response.json();
  //     setMessages(data);
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchGroups();
  }, []);

  // useEffect(() => {
  //   if (selectedGroup) {
  //     fetchGroupMessages(selectedGroup.id);
  //   }
  // }, [selectedGroup]);

  if (loading) {
    return <p>Loading groups...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div>
      <h2>Group List</h2>
      <ul className='grouplistul'>
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <li key={group.id}>
              <button className='grouplistbutton' onClick={() => onGroupSelect(group)}  style={{ fontWeight: newMessageGroups.includes(group.id) ? 'bold' : 'normal' }}>
                {group.title}
                {newMessageCount[group.id] > 0 && (
                                    <span> ({newMessageCount[group.id]})</span>  // Display unread message count
                                )}
              </button>
            </li>
          ))
        ) : (
          <p>No groups available</p>
        )}
      </ul>

      
    </div>
  );
};

export default GroupList
