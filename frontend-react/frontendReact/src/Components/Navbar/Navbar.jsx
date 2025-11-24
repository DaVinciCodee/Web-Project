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
                    <div className="navbar-item" >Accueil</div>
                    <div className="navbar-item" >Profil</div>
                    <div className="navbar-item" >Feed</div>
                    <div className="navbar-item" >Messages</div>
                    <div className="navbar-item">Connexion</div>
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
