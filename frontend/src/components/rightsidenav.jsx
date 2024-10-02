import React, { useState, useEffect } from 'react'

function RightSidenav() {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const response = await fetch('http://localhost:8081/getusers', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                setUsers(data)
            }catch(error){
                console.log(error)
            }
        }
        fetchUsers();
    }, [])

    const handleUserClick = (user) => {
        setSelectedUser(user)
    }

    const handleCloseChat = () => {
        setSelectedUser(null)
    }


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
                ):(
                    <li>No users found</li>
                )}
            </ul>
            {selectedUser && (
                <div className='chatWindow'>
                    <h3>{selectedUser.username}</h3>
                    <div className='chatContent'>
                        <p>Chat content</p>
                    </div>
                <button onClick={handleCloseChat}>Close chat</button>
                </div>
            )}
    

        </div>
      
  )
}
export default RightSidenav
