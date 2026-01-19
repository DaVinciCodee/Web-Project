import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { FiUser } from 'react-icons/fi';
import './About.css';

const About = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/users/team'); 
                setTeamMembers(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur chargement équipe", err);
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    return (
        <div className="about-container">
            <h1 className="page-title">À propos de Spotimate</h1>
            <p className="page-subtitle">Connecter les passionnés de musique par la vibe.</p>

            <div className="section-header">
                <h2 className="section-title">Pourquoi Spotimate existe?</h2>        
            </div>
            <p className="about-description">
                Spotimate est né d'un constat simple mais fondamental : <b>la musique est un vecteur social, pourtant l'écouter est devenu un acte solitaire.</b><br/><br/>
                Aujourd'hui, les géants du streaming comme <b>Spotify</b> sont conçus comme des bibliothèques personnelles infinies, mais fermées sur elles-mêmes. 
                Nous accumulons des titres, créons des playlists, mais nous restons dans notre bulle. Il manquait un pont entre le monde du streaming musical et celui des réseaux sociaux.<br/>
                Nous avons créé ce site pour briser ce cloisonnement. Spotimate existe pour redonner à la musique sa dimension de partage et transformer une expérience d'écoute individuelle en une véritable aventure collective.
            </p>

            <div className="section-header">
                <h2 className="section-title">Nos Objectifs</h2>
            </div>
            <p className="about-description">
                Notre mission à travers Spotimate s'articule autour de trois axes majeurs :
            </p>
            <ul className="objectives-list">
                <li>
                    <strong className="objective-highlight">Socialiser l'expérience musicale :</strong> <br/>
                    Nous voulons permettre aux utilisateurs de sortir de leur isolement en intégrant les codes du réseau social (fil d'actualité, messagerie instantanée, posts) directement autour de leur consommation musicale.
                </li>
                <li>
                    <strong className="objective-highlight">Connecter par la "Vibe" :</strong> <br/>
                    Notre objectif n'est pas seulement de connecter des amis existants, mais de provoquer des rencontres. Grâce à notre algorithme de compatibilité, nous identifions et suggérons des profils qui partagent réellement vos goûts musicaux pour créer des liens authentiques.
                </li>
                <li>
                    <strong className="objective-highlight">Simplifier l'accès et la sécurité :</strong> <br/>
                    Nous visons une expérience utilisateur fluide et sans friction. En utilisant l'authentification Spotify (OAuth 2.0), nous garantissons une connexion sécurisée sans obliger l'utilisateur à gérer un nouveau compte complexe.
                </li>
            </ul>

            <div className="section-header">
                <h2 className="section-title">La Team</h2>
            </div>
            
            {loading ? (
                <p style={{color: '#b3b3b3'}}>Chargement de l'équipe...</p>
            ) : (
                <div className="team-grid">
                    {teamMembers.map((member) => (
                        <div key={member._id} className="team-card">
                            {member.profilePicture ? (
                                <img 
                                    src={member.profilePicture} 
                                    alt={member.user_name} 
                                    className="team-avatar" 
                                />
                            ) : (
                                <div className="team-avatar" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'#282828'}}>
                                    <FiUser size={40} color="#fff"/>
                                </div>
                            )}

                            <span className="role-badge">Admin Team</span>
                            <h3 className="team-name">{member.user_name}</h3>
                            <p className="team-role">
                                {member.bio ? 
                                    (member.bio.length > 50 ? member.bio.substring(0, 50) + '...' : member.bio) 
                                    : "Membre de l'équipe Spotimate"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            <div className="section-header">
                <h2 className="section-title">Contact :</h2><h2 className="section-mail">spotimate@proton.me</h2>
            </div>

            <div className="about-footer">
                <p>
                    Merci de faire partie de l'aventure Spotimate. Ensemble, faisons vivre la musique.<br />
                    <span className="footer-highlight">Spotimate Team</span>
                </p>
                <div className="footer-heart">💚</div>
            </div>
        </div>
    );
};

export default About;