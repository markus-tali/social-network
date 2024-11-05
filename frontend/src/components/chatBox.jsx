import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
    const [messageContent, setMessageContent] = useState('');

    const replaceEmoticonsWithEmojis = (message) => {
        const emoticonToEmojiMap = {
            ':)': '😊',
            ':(': '☹️',
            ':D': '😃',
            ';)': '😉',
            ':P': '😛',
            '<3': '❤️',
            ':thumbsup': '👍',
            ':thumbsdown:': '👎'
        };

        Object.keys(emoticonToEmojiMap).forEach((emoticon) => {
            const emoji = emoticonToEmojiMap[emoticon];
            message = message.split(emoticon).join(emoji);
        });

        return message;
    };

    const handleChange = (e) => {
        const inputMessage = e.target.value;
        const updatedMessage = replaceEmoticonsWithEmojis(inputMessage);  // Muuda emotikonid emojideks
        setMessageContent(updatedMessage);  // Uuenda sõnumi sisendit
    };

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
                onChange={handleChange}
                required
            />
            <button className='messageButton' type="submit">Send</button>
        </form>
    );
};

export default MessageInput;
