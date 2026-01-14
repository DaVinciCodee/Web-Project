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
                        date: new Date(post.createdAt),
                        // AJOUT : Initialisation de l'état "liked" 
                        // (Si ton backend renvoie déjà si l'user a liké, mets cette valeur ici)
                        liked: false 
                    };
                }));

                setPosts(postsWithImages);

            } catch (err) {
                console.error(err);
            }
        };

        fetchPosts();
    }, []);

    // AJOUT : Fonction pour gérer le click sur le coeur
    const toggleLike = (postId) => {
        setPosts(prevPosts => prevPosts.map(post => {
            if (post._id === postId) {
                return { ...post, liked: !post.postLikes};
            }
            return post;
        }));
        
        // TODO: Ici, tu devras probablement faire un appel API (fetch/axios) 
        // pour sauvegarder le like dans ta base de données.
    };

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

                            {/* AJOUT : Section des interactions (Like) en dessous du contenu */}
                            <div className="post-actions" style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                                <button 
                                    onClick={() => toggleLike(post._id)}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '5px',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {/* Icône Coeur SVG */} 
                                    {post.postLikes ? (
                                        // Coeur Rempli (Rouge)
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                    ) : (
                                        // Coeur Vide (Contour Gris)
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                    )}
                                    
                                    {/* Texte optionnel ou compteur */}
                                    <span style={{ fontSize: '0.9rem', color: post.postLikes ? '#e74c3c' : '#555' }}>
                                        {post.postLikes ? 'Aimé' : 'J\'aime'}
                                    </span>
                                </button>
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