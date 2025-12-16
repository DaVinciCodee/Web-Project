import './Feed.css';


function Feed() {
  return (
    <>
      <section className="feed-main">
        <div className="feed-title">Fil d'actualité</div>
        <div className="feed-posts">
            <div className="feed-post">
                <div className="feed-post-user-info">
                    <img className='post-user-img' src="" alt="post-user-img" />
                    <div className='post-user-name'>Matlef</div>
                </div>
                <div className="post-content">Content</div>
            </div>
            <div className="feed-post">
                <div className="feed-post-user-info">
                    <img className='post-user-img' src="" alt="post-user-img" />
                    <div className='post-user-name'>Matlef</div>
                </div>
                <div className="post-content">Content</div>
            </div>
            <div className="feed-post">
                <div className="feed-post-user-info">
                    <img className='post-user-img' src="" alt="post-user-img" />
                    <div className='post-user-name'>Matlef</div>
                </div>
                <div className="post-content">Content</div>
            </div>
            <div className="feed-post">
                <div className="feed-post-user-info">
                    <img className='post-user-img' src="" alt="post-user-img" />
                    <div className='post-user-name'>Matlef</div>
                </div>
                <div className="post-content">Content</div>
            </div>
        </div>
      </section>
    </>
  )
}

export default Feed
