import React, { useState, useEffect } from 'react';
import './Home.css';

function Home({ user, setCurrentPage }) {
    const [resources, setResources] = useState([]);
    const [apiBooks, setApiBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const [localRes, apiRes] = await Promise.all([
                    fetch('http://localhost:5000/api/resources'),
                    fetch('https://openlibrary.org/search.json?q=subject:computer+science+mathematics+physics+engineering&limit=30')
                ]);

                const localData = await localRes.json();
                const apiData = await apiRes.json();

                if (localRes.ok) setResources(localData);

                if (apiData && apiData.docs) {
                    const localTitles = new Set(localData.map(item => item.title.trim().toLowerCase()));
                    const uniqueApiBooks = apiData.docs.filter(book => {
                        const bookTitle = book.title ? book.title.trim().toLowerCase() : '';
                        return !localTitles.has(bookTitle);
                    });
                    setApiBooks(uniqueApiBooks);
                }
            } catch (err) {
                setMessage('Failed to load textbooks');
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    const handleFavorite = async (bookData) => {
        if (!user) return alert('Please login to save favorites!');
        try {
            const response = await fetch('http://localhost:5000/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_id: user.id, 
                    title: bookData.title,
                    author: bookData.author,
                    year: bookData.year,
                    file_name: bookData.file_name,
                    file_url: bookData.file_url
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Added to favorites successfully!');
            } else {
                alert(data.error || 'Could not add favorite');
            }
        } catch (err) {
            alert('Error saving favorite');
        }
    };

    const filteredResources = resources.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApiBooks = apiBooks.filter(book => {
        const titleMatch = book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase());
        const authorMatch = book.author_name && book.author_name.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
        return titleMatch || authorMatch;
    });

    if (loading) return <div className="home-container"><h2>Loading textbooks...</h2></div>;

    return (
        <div className="home-container">
            <h1>Student Textbook Library</h1>
            <p>Explore full, open-access textbooks and study materials.</p>

            <div className="search-bar-container" style={{ margin: '20px 0' }}>
                <input 
                    type="text" 
                    placeholder="Search textbooks by title or author..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {message && <p className="error-msg">{message}</p>}

            <div className="resources-grid">
                {/* 1. LOCAL RESOURCES (No delete buttons here) */}
                {filteredResources.map((item) => (
                    <div key={`local-${item.id}`} className="resource-card user-upload-card">
                        <h3>{item.title}</h3>
                        <p><strong>Author:</strong> {item.author}</p>
                        <p><strong>Year:</strong> {item.year}</p>
                        <p><strong>File:</strong> {item.file_name || 'Link'}</p>
                        
                        {item.file_url && (
                            <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="link">
                                Open Full Document 
                            </a>
                        )}

                        {user && (
                            <button 
                                onClick={() => handleFavorite({
                                    title: item.title,
                                    author: item.author,
                                    year: item.year,
                                    file_name: item.file_name,
                                    file_url: item.file_url
                                })} 
                                className="favorite-btn"
                            >
                                Add to Favorites
                            </button>
                        )}
                    </div>
                ))}

                {/* 2. EXTERNAL API BOOKS */}
                {filteredApiBooks.map((book, index) => {
                    const directReadUrl = book.ha_keys && book.ha_keys.length > 0 
                        ? `https://archive.org/details/${book.ha_keys[0]}` 
                        : `https://openlibrary.org${book.key}`;

                    const bookAuthor = book.author_name ? book.author_name.join(', ') : 'Unknown';
                    const pubYear = book.first_publish_year || 2000;

                    return (
                        <div key={`api-${index}`} className="resource-card external-card">
                            <h3>{book.title}</h3>
                            <p><strong>Author:</strong> {bookAuthor}</p>
                            <p><strong>First Published:</strong> {pubYear}</p>
                            
                            <a href={directReadUrl} target="_blank" rel="noopener noreferrer" className="link">
                                Read Textbook 
                            </a>

                            {user && (
                                <button 
                                    onClick={() => handleFavorite({
                                        title: book.title,
                                        author: bookAuthor,
                                        year: pubYear,
                                        file_name: 'External Textbook',
                                        file_url: directReadUrl
                                    })} 
                                    className="favorite-btn"
                                >
                                    Add to Favorites
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;