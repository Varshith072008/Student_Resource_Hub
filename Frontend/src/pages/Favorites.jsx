import React, { useState, useEffect } from 'react';
import './Home.css';

function Favorites({ user, setCurrentPage }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/favorites/${user.id}`);
                const data = await response.json();
                
                if (response.ok) {
                    setFavorites(data);
                } else {
                    setError(data.error || 'Failed to load favorites');
                }
            } catch (err) {
                setError('Network error loading favorites');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    const handleRemoveFavorite = async (resourceId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/favorites/${user.id}/${resourceId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setFavorites(favorites.filter(item => item.id !== resourceId));
            } else {
                alert('Failed to remove favorite');
            }
        } catch (err) {
            alert('Error removing favorite');
        }
    };

    if (loading) return <div className="home-container"><h2>Loading your favorites...</h2></div>;

    return (
        <div className="home-container">
            <button onClick={() => setCurrentPage('home')} className="upload-btn" style={{ marginBottom: '20px' }}>
                ← Back to Library
            </button>
            
            <h1>My Favorite Textbooks</h1>
            {error && <p className="error-msg">{error}</p>}

            {favorites.length === 0 ? (
                <p>You haven't added any favorites yet!</p>
            ) : (
                <div className="resources-grid">
                    {favorites.map((item) => (
                        <div key={item.id} className="resource-card user-upload-card">
                            <h3>{item.title}</h3>
                            <p><strong>Author:</strong> {item.author}</p>
                            <p><strong>Year:</strong> {item.year}</p>
                            
                            {item.file_url && (
                                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="link">
                                    Open Full Document
                                </a>
                            )}
                            
                            <button 
                                onClick={() => handleRemoveFavorite(item.id)} 
                                className="delete-btn"
                                style={{ marginTop: '12px' }}
                            >
                                Remove from Favorites
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;