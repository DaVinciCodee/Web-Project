import { useState } from 'react';
import './Explore.css';
import defaultPP from '../img/defaultPP.webp'


function Explore() {

    const [text, setText] = useState(null);
    const [selected, setSelected] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [artist, setArtist] = useState(null);

    const handleSearch = (e) => {

        const query = e.target.value;

        if (selected === "Profil") {
            if (!query) {
                setText(null);
                return;
            }

            fetch(`http://localhost:8000/search-request/users/?q=${query}`)
                .then(res => res.json())
                .then(data => setText(data))
                .catch(err => console.error(err));
        }

        // if (selected === "Album"){

        // }

        if (selected === "Artiste") {
            if (!query) {
                setArtist(null);
                return;
            }

            fetch(`http://localhost:8000/search-request/albums/?q=${query}`)
                .then(res => res.json())
                .then(data => setAlbums(data))
                .catch(err => console.error(err));
        }
    };

    // Click Choice
    const handleClick = (e) => {
        if (selected !== e.target.textContent || selected === null) {
            setSelected(e.target.textContent);
        }
        else {
            setSelected(null);
        }
    }


    return (
        <>
            <section className="main">
                {/* Title */}
                <div className="title">Explorer</div>

                {/* Search Zone */}
                <div className='search-zone'>
                    <input
                        className="search-btn"
                        placeholder={
                            selected === "Profil" ? "Qui souhaitez-vous chercher ?" :
                                selected === "Album" ? "Quel album cherchez-vous ?" :
                                    selected === "Artiste" ? "Quel artiste cherchez-vous ?" :
                                        selected === "Morceau" ? "Quel morceau cherchez-vous ?" :
                                            "Que souhaitez-vous chercher ?"
                        }
                        onChange={handleSearch}
                    />
                    <section className='choices'>
                        <div
                            onClick={handleClick}
                            className={`choice ${selected === "Profil" ? "active" : ""}`}
                        >
                            Profil
                        </div>
                        <div
                            onClick={handleClick}
                            className={`choice ${selected === "Album" ? "active" : ""}`}
                        >
                            Album
                        </div>
                        <div
                            onClick={handleClick}
                            className={`choice ${selected === "Artiste" ? "active" : ""}`}
                        >
                            Artiste
                        </div>
                        <div
                            onClick={handleClick}
                            className={`choice ${selected === "Morceau" ? "active" : ""}`}
                        >
                            Morceau
                        </div>
                    </section>

                </div>

                {/* Result zone */}
                <div className='response-search'>
                    Résultats :
                    {text !== null && selected === "Profil" && (
                        text.map(user => (
                            <div key={user._id} className='profil-card'>
                                <img
                                    src={user.profilePicture ? user.profilePicture : defaultPP}
                                    className='profil-image'
                                />
                                <div>{user.user_name}</div>
                            </div>
                        ))
                    )}
                    {artist !== null && selected === "Artiste" && (
                        artist.map((art, index) => (
                            <div key={index}>{JSON.stringify(art)}</div>
                        ))
                    )}
                </div>
            </section>
        </>
    )
}

export default Explore
