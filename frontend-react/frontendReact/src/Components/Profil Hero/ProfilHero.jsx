import './ProfilHero.css'
import ImgUser from './imgUser.jpg'

function ProfilHero() {
    return (
        <>
            <section className="username">
                <img
                    src={ImgUser}
                    alt="imgUser"
                    className="imgUser" />
                <div>Nom d'utilisateur</div>
            </section>

            <section className="userInfo">
                <section className="bio">
                    <div className='titre'>Bio</div>
                    <div className='bioText'>
                        Blablablablablablablablablablablablallablablalablablalablablalablablalablablalablablalablablalablablalablablalablablalablablalablablaablablalablablalablabla
                    </div>
                </section>
                <section className="topSongs">
                    <div className='titre'>Top Titres</div>
                    <div className="topTitres">
                        <ul>
                            <li>Inna Di Club</li>
                            <li>Le plan A</li>
                            <li>Le plan B</li>
                            <li>Jimmy Fallon</li>
                            <li>Le chant des cigales</li>
                            <li>But en or</li>
                            <li>Je viens de là</li>
                        </ul>
                    </div>
                </section>
                <section className="topArtists">
                    <div className='titre'>Top Artistes</div>
                    <div className="topArtistes"></div>
                </section>
            </section>
        </>
    )
}

export default ProfilHero
