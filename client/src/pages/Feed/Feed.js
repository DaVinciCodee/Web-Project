import { useState, useEffect } from 'react';
import DefaultPP from '../../img/defaultPP.webp';
import './Feed.css';
import LinkPreview from '../../components/LinkPreview/LinkPreview'; 

function Feed() {

    const [posts, setPosts] = useState([]);
    const POSTS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    // Fetch posts from the backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:8000/post/display-post");
                const data = await response.json();

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

    // Function to extract URL from post content
    const extractUrl = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = text.match(urlRegex);
        return match ? match[0] : null;
    };

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
                            
                            <div className="post-content">
                                {(() => {
                                    const content = post.postContent;
                                    const urlFound = extractUrl(content);

                                    return (
                                        <>
                                            <p>
                                                {content.split(' ').map((word, i) => {
                                                    if (word.match(/(https?:\/\/[^\s]+)/g)) {
                                                        return null;
                                                    }
                                                    return <span key={i}>{word} </span>;
                                                })}
                                            </p>

                                            {urlFound && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <LinkPreview url={urlFound} />
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

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