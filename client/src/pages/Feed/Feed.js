import { useState, useEffect } from 'react';
import DefaultPP from '../../img/defaultPP.webp';
import './Feed.css';

function Feed() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:8000/post/display-post");
                const data = await response.json();

                // On récupère aussi les images des utilisateurs
                const postsWithImages = await Promise.all(data.map(async (post) => {
                    const userRes = await fetch(`http://localhost:8000/explore-routes/users/?q=${post.postUserName}`);
                    const userData = await userRes.json();
                    return {
                        ...post,
                        userImg: userData[0]?.profilePicture || DefaultPP,
                        date: new Date(post.createdAt)
                    };
                }));

                setPosts(postsWithImages);

            } catch (err) {
                console.error(err);
            }
        };

        fetchPosts();
    }, []);


    function linkify(text) {
        // Regex pour détecter les URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Split le texte et insère <a> pour chaque URL
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1DB954", textDecoration: "underline" }} // optionnel : style Spotify
                    >
                        {part}
                    </a>
                );
            } else {
                return part;
            }
        });
    }


    return (
        <section className="feed-main">
            <div className="feed-title">Fil d'actualité</div>
            <div className="feed-posts">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div className="feed-post" key={post._id}>
                            <div className="post-info">
                                <div className="feed-post-user-info">
                                    <img className='post-user-img' src={post.userImg} alt="post-user-img" />
                                    <div className='post-user-name'>{post.postUserName}</div>
                                </div>
                                <div className="post-timestamps">
                                    <div className="hour">{post.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                                    <div className="day">{post.date.toLocaleDateString("fr-FR")}</div>
                                </div>
                            </div>
                            {/* <div className="post-content">{post.postContent}</div> */}
                            <div className="post-content">{linkify(post.postContent)}</div>
                        </div>
                    ))
                ) : (
                    <p>Chargement des posts...</p>
                )}
            </div>
        </section>
    )
}

export default Feed;

