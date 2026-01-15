import './EditProfile.css';
import { useState } from 'react';

const EditProfile = ({user, onClose, onSave}) => {
    const [formData, setFormData] = useState({
        user_name: user.user_name || '',
        bio: user.bio || ''
    });
    const handlechnage = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Modifier le profil</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom d'utilisateur :</label>
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handlechnage}
                            maxLength="30"
                        />
                    </div>
                    <div className="form-group">
                        <label>Bio :</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handlechnage}
                            maxLength="150"
                            rows="4"
                            placeholder="Parle-nous un peu de toi..."
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
                        <button type="submit" className="save-btn">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;