import { useState, useEffect } from 'react';
import DefaultPP from '../img/defaultPP.webp';
import './Feed.css';


function Feed() {

    const [post, setPost] = useState({})
    const [userImg, setUserImg] = useState("");

    useEffect(() => {
        const getLastPost = async () => {
            try {
                const response = await fetch("http://localhost:8000/send-post/");
                const data = await response.json();
                setPost(data);

                const user = await fetch(`http://localhost:8000/search-request/users/?q=${data.postUserName}`);
                const user_response = await user.json();
                console.log(user_response);
                setUserImg(user_response[0]?.profilePicture);

            } catch (err) {
                console.error(err);
            }
        };

        getLastPost();
    }, []);



    return (
        <>
            <section className="feed-main">
                <div className="feed-title">Fil d'actualité</div>
                <div className="feed-posts">
                    {post.postContent ? (
                        <div className="feed-post">
                            <div className="feed-post-user-info">
                                <img className='post-user-img' src={userImg || DefaultPP} alt="post-user-img" />
                                <div className='post-user-name'>{post.postUserName}</div>
                            </div>
                            <div className="post-content">{post.postContent}</div>
                        </div>
                    ) : (
                        <p>Chargement du dernier post...</p>
                    )}
                </div>
            </section>
        </>
    )
}

export default Feed
