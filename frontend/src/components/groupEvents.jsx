import React, {useState, useEffect} from 'react'
import { sendMessage } from '../components/websocket.jsx';
const GroupEvents = ({ourUserData, group}) => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userStatuses, setUserStatuses] = useState({});
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const handleCreateEvent = () => {
    setLoading(true);
    setMessage('');
    
    const newEvent = {
      Username: ourUserData.Username, // replace with dynamic username if needed
      Title: title,
      Description: description,
      Time: time,
      Group_id:parseInt(group.id, 10) 
    };
  fetch('http://localhost:8081/createevent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newEvent),
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json(); // Parse the JSON response
  })
  .then(data => {
    const eventCreationMessage = {
      Type: "eventCreation",
      From: ourUserData.Username,
      Group_id: parseInt(group.id, 10),
      Event_id: parseInt(data.eventId, 10),
      GroupTitle: group.title,
    }
    sendMessage(eventCreationMessage)
    setMessage(`Event created successfully! Event ID: ${data.eventId}`);
    setTitle(''); // Clear form inputs
    setDescription('');
    setTime('');
    setIsCreatingEvent(false); 
  })
  .catch(error => {
    console.error("Error creating event:", error);
    setMessage('Error creating event.');
  })
  .finally(() => {
    setLoading(false);
  });
};
useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8081/getgroupevents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: parseInt(group.id, 10) }), // Edastame gruppide ID
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data || []); // Seame kätte saadud sündmused
      const initialStatuses = {};
      data.forEach((event) => {
        const savedStatus = localStorage.getItem(`eventStatus_${event.id}`);
        initialStatuses[event.id] =savedStatus || event.participationStatus || 'not going'; // Eeldame, et server tagastab staatuse
      });
      setUserStatuses(initialStatuses);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };
  fetchEvents();
  fetchUserStatuses();
}, [group.id]);
// see on participation shit
const handleToggleParticipation = (eventId) => {
  const newStatus = userStatuses[eventId] === 'going' ? 'not going' : 'going';
  const participationData = {
    event_id: eventId,
    username: ourUserData.Username,
    status: newStatus,
  };
  localStorage.setItem(`eventStatus_${eventId}`, newStatus);
  fetch('http://localhost:8081/updateeventstatushandler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participationData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update participation');
      }
      return response.json();
    })
    .then(data => {
      setUserStatuses(prevStatuses => ({
        ...prevStatuses,
        [eventId]: newStatus,
      }));
      setMessage(data.message || 'Successfully updated participation');
    })
    .catch(error => {
      console.error('Error updating participation:', error);
      setMessage('Error updating participation.');
    });
};
const fetchUserStatuses = async () => {
  try {
    const response = await fetch('http://localhost:8081/getuserstatuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        group_id: parseInt(group.id, 10),
        username: ourUserData.Username,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user statuses');
    }
    const data = await response.json();
    const statuses = {};
    data.forEach((status) => {
      statuses[status.event_id] = status.participationStatus || 'not going';
    });
    setUserStatuses(statuses);
  } catch (error) {
    console.error('Error fetching user statuses:', error);
  }
};
return (
  <div>
  <div className='creatingeventsbutton'>

  <button className='groupOwnButton' onClick={() => setIsCreatingEvent((prev) => !prev)}>
    {isCreatingEvent ? 'Cancel' : 'Create New Event'}
  </button>
  {isCreatingEvent && (
    <div>
      <h2>Create a New Event</h2>
      <div className='inputforgroup'>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
      <textarea
      className='grouptext'
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
      <input
      className='groupowninput'
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        />
      <button className='groupOwnButton' onClick={handleCreateEvent} disabled={loading}>
        {loading ? 'Creating...' : 'Create Event'}
      </button>
        </div>
    </div>
  )}

  </div>
  {message && <p>{message}</p>}

  <h3>Upcoming Events</h3>
  <ul>
    {events.map((event) => (
      <li className='newEvents' key={event.id}>
        <strong>{event.title}</strong> - {event.description} <br />
        <small>{event.time}</small>
        <button
          onClick={() => handleToggleParticipation(event.id)}
          style={{
            backgroundColor: userStatuses[event.id] === 'going' ? '#5b6eae' : '#23272A',
            color: 'white',
          }}
          >
          {userStatuses[event.id] === 'going' ? 'You are Going' : 'You are not Going'}
        </button>
      </li>
    ))}
  </ul>
</div>
);
};
export default GroupEvents
