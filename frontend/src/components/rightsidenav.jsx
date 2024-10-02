import React, { useState, useEffect } from 'react'

function RightSidenav() {

    const [users, setUsers] = useState([]);

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


  return (
        <div className='users'>
            <h2>Userlist:</h2>

            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.Id}>{user.username}</li>
                    ))
                ):(
                    <li>No users found</li>
                )}
            </ul>
    

        </div>
      
  )
}
export default RightSidenav
