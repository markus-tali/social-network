import { useState } from "react"

const MyPage = ({userData}) => {
  const [isPrivate, setIsPrivate] = useState(false);

  console.log("before: ", userData)
  if (!userData || !userData.Username) {
    console.log("inside userData:", userData)
    return <p>Loading user data...</p>;
  }

  const handleToggleChange = () => {
    setIsPrivate(prevState => !prevState)
  }
  
  return (
    <div className='mypage'>

<div className="toggle-container">

      <p>My name: {userData.Username}</p>
      <p>FirstName: {userData.Firstname}</p>
      <p>LastName: {userData.Lastname}</p>
      <p>NickName: {userData.Nickname}</p>
      <p>About Me: {userData.AboutMe}</p>
      <p>DateOfBirth: {userData.DateOfBirth}</p>
      <p>Email: {userData.Email}</p>
      <img src={`http://localhost:8081/utils/avatar/${userData.Avatar}`} alt="comment picture"/>
      <br />
      <br />
      <br />
      <br />
        <label className="switch">
          <input type="checkbox" onChange={handleToggleChange} checked={isPrivate} />
          <span className="slider round"></span>
        </label>
        <span className="toggle-label">
          {isPrivate ? "Private Mode" : "Public Mode"}
        </span>
      </div>

    </div>

  )
}

export default MyPage
