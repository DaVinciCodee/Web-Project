import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

function CreatePost() {
    const navigate = useNavigate();
    const [content, setContent] = useState("");

    const handlePost = () => {

        const data = {
            content: content,
            spotifyId: localStorage.getItem("spotifyId"),
        };

        fetch("http://localhost:8000/post/create-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .catch(err => console.error(err));

        console.log("Post en cours de création 1");
        setTimeout(() => {
            console.log("Post créé !");
        }, 5000);
        navigate('/feed');
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
