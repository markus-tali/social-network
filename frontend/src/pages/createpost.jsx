import React, {useState} from 'react'

export function CreatePost(){
    const [postTitle, setPostTitle] = useState('')
    const [postContent, setPostContent] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileChange = () =>{
        setSelectedFile()
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', postTitle)
        formData.append('content', postContent)
        if (selectedFile){
            formData.append('file', selectedFile)
        }
        try {
            const response = await fetch('http://localhost:8081/createpost', {
                method: 'POST',
                body: formData,
            })
            if (response.ok) {
                const createdPost = await response.text()
                console.log('Post created: ', createdPost)
            } else {
                console.error('Failed to create post')
            }
        } catch (error) {
            console.error('Error: ', error)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Post Title:</label>
                <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required />
            </div>
            <div>
                <label>Post Content:</label>
                <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} required></textarea>
            </div>
            <div>
                <label>Upload and Image or GIF:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <button type="submit">Submit Post</button>
        </form>
    )
}