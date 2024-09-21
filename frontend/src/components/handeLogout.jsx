const handleLogout = async (onLogout) => {
    try {
        const response = await fetch("http://localhost:8081/logout", {
            method: 'POST', // or 'GET', depending on your backend
            credentials: 'include', // Include cookies if needed
        });

        if (response.ok) {
            // Call the onLogout function passed as a prop
            onLogout();
        } else {
            console.error('Logout failed:', await response.text());
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
};
export default handleLogout
