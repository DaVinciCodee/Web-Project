// client/src/components/LinkPreview.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import './LinkPreview.css';

const LinkPreview = ({ url }) => {
    const [metaData, setMetaData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url) return;

        const fetchMeta = async () => {
            try {
                const res = await axios.post("https://spotimate-7eqq.onrender.com/api/messages/get-url-metadata", { url });
                setMetaData(res.data);
            } catch (err) {
                console.error("Impossible de charger la preview", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeta();
    }, [url]);

    if (loading) return <span className="link-loading">Chargement...</span>;
    
    if (!metaData || !metaData.title) {
        return <a href={url} target="_blank" rel="noopener noreferrer" className="simple-link">{url}</a>;
    }

    return (
        <div className="link-preview-container">
            <div className="preview-content">
                <div className="site-name">{metaData.siteName || new URL(url).hostname}</div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="preview-title">
                    {metaData.title}
                </a>
                <p className="preview-desc">
                    {metaData.description ? metaData.description.substring(0, 100) + '...' : ''}
                </p>
            </div>
            {metaData.image && (
                <div className="preview-image">
                    <img src={metaData.image} alt="preview" />
                </div>
            )}
        </div>
    );
};

export default LinkPreview;