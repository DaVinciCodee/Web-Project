import { useState } from 'react';
import './Explore.css';
import defaultPP from '../img/defaultPP.webp'


function Explore() {

    const [text, setText] = useState(null);
    const [selected, setSelected] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [artists, setArtists] = useState(null);

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
                setArtists(null);
                return;
            }

            fetch(`http://localhost:8000/search-request/artists/?q=${query}`)
                .then(res => res.json())
                .then(data => setArtists(data))
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
                    <div className='result-text'>Résultats :</div>
                    {selected === "Profil" && text !== null ? (
                        text.map(user => (
                            <div key={user._id} className='profil-card'>
                                <img
                                    src={user.profilePicture || defaultPP}
                                    className='profil-image'
                                />
                                <div>{user.user_name}</div>
                            </div>
                        ))
                    ) : selected === "Artiste" && artists !== null ? (
                        artists.map(artist => (
                            <div className='artist-result' key={artist.id}>
                                <img className='artist-img' src={artist.images[0]?.url} alt="artist_img" />
                                {artist.name}
                            </div>
                        ))
                    ) : null}
                </div>
            </section>
        </>
    )
}

export default Explore
