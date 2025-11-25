import './Navbar.css'
import LanguageIcon from './language.png'
import SpotifyIcon from './spotify.png'

function Navbar() {
    return (
        <>
            <section className='navbar-section'>
                <div className="logo">
                    <img 
                    src={SpotifyIcon}
                    alt="logo" 
                    width={48}/>
                </div>
                <div className="navbar-items">
                    <a href="/" className="navbar-item" >Accueil</a>
                    <a href="/profil" className="navbar-item" >Profil</a>
                    <a href='/feed' className="navbar-item" >Feed</a>
                    <a href='/messages' className="navbar-item" >Messages</a>
                    <a href='/connexion' className="navbar-item">Connexion</a>
                </div>
                <div className="language">
                    <img
                        src={LanguageIcon}
                        alt="language_icon"
                        width={32}
                        height={32}
                        className="language-logo" />
                    <div>FR/EN</div>
                </div>
            </section>

        </>
    )
}

export default Navbar
