import { useState } from 'react';
import './Explore.css';


function Explore() {

    const [text, setText] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value;
        if (!query) {
            setText([]);
            return;
        }

        fetch(`http://localhost:8000/search-request/?q=${query}`)
            .then(res => res.json())
            .then(data => setText(data))
            .catch(err => console.error(err));
    };


    return (
        <>
            <section className="main">
                <div className="title">Explorer</div>
                <input
                    className="search-btn"
                    placeholder="Que souhaitez-vous chercher ?"
                    onChange={handleSearch}
                />
                <div className='response-search'>
                    Résultats :
                    {text.map(user => (
                        <div key={user._id} className='profil-card'>
                            <img
                                src={user.profilePicture}

                                className='artist-image'
                            />
                            <div>{user.user_name}</div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Explore
