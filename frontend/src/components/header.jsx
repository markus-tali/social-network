import handleLogout from './handeLogout.jsx'

const Header =  ({onLogout}) => {

    const handleLogoutClick = () => {
        handleLogout(onLogout);
    };

    const handleCreatePostClick = () => {
        setIsCreatingPost(true)
    }
    
    return(


    <header className='headerformain'>
    <nav>
    <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#users">Users</a></li>
    <li>
    <button onClick={handleCreatePostClick}> Create Post</button>
    </li>
    <li>
    <button onClick={handleLogoutClick}>Log out</button>
    </li>

    </ul>
    </nav>
    </header>

)}
export default Header