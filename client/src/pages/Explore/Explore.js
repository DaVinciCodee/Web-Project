import { useState } from 'react';
import './Explore.css';
import defaultPP from '../../img/defaultPP.webp';

function Explore() {

    const [text, setText] = useState(null);
    const [selected, setSelected] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [artists, setArtists] = useState(null);
    const [songs, setSongs] = useState(null);

    const handleSearch = (e) => {

        const query = e.target.value;

        /* Profil Search */
        if (selected === "Profil") {
            if (!query) {
                setText(null);
                return;
            }

            fetch(`http://localhost:8000/explore-routes/users?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => setText(data))
                .catch(err => console.error(err));
        }

        /* Albums Search */
        if (selected === "Album") {
            if (!query) {
                setAlbums(null);
                return;
            }

            fetch(`http://localhost:8000/explore-routes/albums?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => setAlbums(data))
                .catch(err => console.error(err));
        }

        /* Artists Search */
        if (selected === "Artiste") {
            if (!query) {
                setArtists(null);
                return;
            }

            fetch(`http://localhost:8000/explore-routes/artists?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => setArtists(data))
                .catch(err => console.error(err));
        }

        /* Songs Search */
        if (selected === "Morceau") {
            if (!query) {
                setSongs(null);
                return;
            }

            fetch(`http://localhost:8000/explore-routes/songs?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => setSongs(data))
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
            <section className="explore-main">
                {/* Title */}
                <div className="explore-title">Explorer</div>

                {/* Search Zone */}
                <div className='explore-search-zone'>
                    <input
                        className="explore-search-input"
                        placeholder={
                            selected === "Profil" ? "Qui souhaitez-vous chercher ?" :
                                selected === "Album" ? "Quel album cherchez-vous ?" :
                                    selected === "Artiste" ? "Quel artiste cherchez-vous ?" :
                                        selected === "Morceau" ? "Quel morceau cherchez-vous ?" :
                                            "Que souhaitez-vous chercher ?"
                        }
                        onChange={handleSearch}
                    />
                    <section className='explore-choices'>
                        <div
                            onClick={handleClick}
                            className={`explore-choice ${selected === "Profil" ? "active" : ""}`}
                        >
                            Profil
                        </div>
                        <div
                            onClick={handleClick}
                            className={`explore-choice ${selected === "Album" ? "active" : ""}`}
                        >
                            Album
                        </div>
                        <div
                            onClick={handleClick}
                            className={`explore-choice ${selected === "Artiste" ? "active" : ""}`}
                        >
                            Artiste
                        </div>
                        <div
                            onClick={handleClick}
                            className={`explore-choice ${selected === "Morceau" ? "active" : ""}`}
                        >
                            Morceau
                        </div>
                    </section>

                </div>

                {/* Result zone */}
                <div className='explore-response-zone'>
                    <div className='explore-result-text'>Résultats :</div>
                    <div className="explore-result-items">
                        {selected === "Profil" && text !== null ? (
                            text.map(user => (
                                <div key={user._id} className='explore-result-item profil-card'>
                                    <img
                                        src={user.profilePicture || defaultPP}
                                        className='profil-image'
                                    />
                                    <div>{user.user_name}</div>
                                </div>
                            ))
                        ) : selected === "Artiste" && artists !== null ? (
                            artists.map(artist => (
                                <div className='explore-result-item artist-card' key={artist.id}>
                                    <img className='artist-img' src={artist.images[0]?.url} alt="artist_img" />
                                    {artist.name}
                                    <a
                                        className='explore-link'
                                        href={artist.external_urls.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Link
                                    </a>
                                </div>
                            ))
                        ) : selected === "Album" && albums !== null ? (
                            albums.map(album => (
                                <div className='explore-result-item album-card' key={album.id}>
                                    <img className='album-cover' src={album.images[0]?.url} alt="album_cover" />
                                    {album.name}
                                    <div className='album-name'>{album.artists[0].name}</div>
                                    <a
                                        className='explore-link'
                                        href={album.external_urls.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Link
                                    </a>
                                </div>
                            ))
                        ) : selected === "Morceau" && songs !== null ? (
                            songs.map(song => (
                                <div className='explore-result-item song-result' key={song.id}>
                                    <img className='song-cover' src={song.album.images[0]?.url} alt="song-cover" />
                                    {song.name}
                                    <div>{song.artists[0].name}</div>
                                    <a
                                        className='explore-link'
                                        href={song.external_urls.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Link
                                    </a>
                                </div>
                            ))
                        ) : null}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Explore
