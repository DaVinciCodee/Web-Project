import { useState } from 'react';
import './CreatePost.css';

function CreatePost() {

    const [content, setContent] = useState("");

    const handlePost = () => {

        const data = {
            content: content,
            userId: localStorage.getItem("spotifyId"),
        };

        fetch("http://localhost:8000/create-post/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .catch(err => console.error(err));
    }

    return (
        <>
            <section className="create-post-main">
                <div className="create-post-title">Créer un nouveau Post</div>
                <textarea
                    placeholder="Ecrivez ici votre post ..."
                    maxLength="500"
                    className="create-post-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button onClick={handlePost} className='send-post-btn'>Poster</button>
            </section>

        </>
    )
}

export default CreatePost
