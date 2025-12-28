import { useState, useEffect } from 'react';
import DefaultPP from '../../img/defaultPP.webp';
import './Feed.css';


function Feed() {

    const [post, setPost] = useState({})
    const [userImg, setUserImg] = useState("");
    const [date, setDate] = useState(null);

    useEffect(() => {
        const getLastPost = async () => {
            try {
                const response = await fetch("http://localhost:8000/post/display-post");
                const data = await response.json();
                setPost(data);

                const user = await fetch(`http://localhost:8000/explore-routes/users/?q=${data.postUserName}`);
                const user_response = await user.json();
                setUserImg(user_response[0]?.profilePicture);

                setDate(new Date(data.createdAt));

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
                            <div className="post-info">
                                <div className="feed-post-user-info">
                                    <img className='post-user-img' src={userImg || DefaultPP} alt="post-user-img" />
                                    <div className='post-user-name'>{post.postUserName}</div>
                                </div>
                                <div className="post-timestamps">
                                    <div className="hour">{date?.toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}</div>
                                    <div className="day">{date?.toLocaleDateString("fr-FR")}</div>
                                </div>
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
