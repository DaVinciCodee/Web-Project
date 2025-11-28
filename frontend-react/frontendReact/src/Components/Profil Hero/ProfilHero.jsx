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
                <div className='nameUser'>Nom d'utilisateur</div>
            </section>

            <section className="userInfo">
                {/* <section className="bio">
                    <div className='titre'>Bio</div>
                    <div className='bioText'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br />
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </div>
                </section> */}
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
                    <div className="topArtistes">
                        <ul>
                            <li>Isha</li>
                            <li>Limsa</li>
                            <li>Nas</li>
                            <li>Dr Dre</li>
                            <li>Eminem</li>
                            <li>Kendrick Lamar</li>
                            <li>Sch</li>
                        </ul>
                    </div>
                </section>
            </section>
        </>
    )
}

export default ProfilHero
