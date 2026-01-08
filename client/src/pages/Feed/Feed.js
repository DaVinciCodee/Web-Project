import { useState, useEffect } from 'react';
import DefaultPP from '../../img/defaultPP.webp';
import './Feed.css';

function Feed() {

    const [posts, setPosts] = useState([]);
    const POSTS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);


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
        // Groupes NON capturants (?: ...)
        const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/g;

        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                const href = part.startsWith("http")
                    ? part
                    : `https://${part}`;

                return (
                    <a
                        key={index}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1DB954", textDecoration: "underline" }}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    }




    return (
        <section className="feed-main">
            <div className="feed-title">Fil d'actualité</div>
            <div className="feed-posts">
                {currentPosts.length > 0 ? (
                    currentPosts.map((post) => (
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
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    ◀
                </button>

                <span>{currentPage} / {totalPages}</span>

                <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    ▶
                </button>
            </div>

        </section>
    )
}

export default Feed;

