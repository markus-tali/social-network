import React, {useState} from 'react'

function CreatePost({ groupId, onPostCreated }){
    const [postTitle, setPostTitle] = useState('')
    const [postContent, setPostContent] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [postPrivacy, setPostPrivacy] = useState('public')

    const handleFileChange = (e) =>{
        setSelectedFile(e.target.files[0])
    }
    const handlePrivacyChange = (e) => {
        setPostPrivacy(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', postTitle)
        formData.append('content', postContent)
        formData.append('privacy', postPrivacy)
        formData.append('group_id', groupId)
        console.log("this is groupId:", groupId, typeof(groupId))
        if (selectedFile){
        formData.append('avatar', selectedFile)
        }
        try {
            const response = await fetch('http://localhost:8081/createpost', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })
            if (response.ok) {
                const createdPost = await response.text()
                onPostCreated()

            } else {
                console.error('Failed to create post')
            }
        } catch (error) {
            console.error('Error: ', error)
        }
    }
    return (
        <form className='createPostForm' onSubmit={handleSubmit}>
            <div className='postFormField'>

            <div className='postTitleForm'>
                <label className='postLabel'>Post Title:</label>
                <input className='postInput' type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required />
            </div>
            <div className='postContentForm'>
                <label className='postLabel'>Post Content:</label>
                <textarea className='postTextArea' value={postContent} onChange={(e) => setPostContent(e.target.value)} required></textarea>
            </div>
            <div className='postAvatarForm'>
                <label className='postLabel'>Upload and Image or GIF:</label>
                <input className='postFileInput' type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className='postPrivacyForm'>
                <label className='postLabel'>Post Privacy:</label>
            <div className='postRadioGroup'>

            <div className='postRadioLabelForm'>
                <label className='postLabel'>
                    <input className='postInput' type="radio" value="public" checked={postPrivacy === 'public'} onChange={handlePrivacyChange}/>
                    Public
                </label>
            </div>
                <div className='postRadioForm'>
                    <label className='postLabel' >
                        <input className='postInput' type="radio" value="private" checked={postPrivacy === 'private'} onChange={handlePrivacyChange} />
                        Private
                    </label>
                </div>
            </div>
            </div>
            <div className='postButtonForm'>
            <button className='postButton' type="submit">Submit Post</button>
            </div>
            </div>
        </form>
    )
}
export default CreatePost