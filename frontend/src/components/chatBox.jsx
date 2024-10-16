import React, { useState } from 'react';
import { sendMessage } from './websocket';

const MessageInput = ({ onSendMessage }) => {
    const [messageContent, setMessageContent] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedMessage = messageContent.trim()
        if (trimmedMessage === '') {
            alert('Message cannot be empty!');
            return;
        }


        

        // Send the message locally without saving to any database
        onSendMessage(trimmedMessage);
        
        // Clear the input after sending the message
        setMessageContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={messageContent}
                placeholder="Type your message here..."
                onChange={(e) => setMessageContent(e.target.value)}
                required
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageInput;
