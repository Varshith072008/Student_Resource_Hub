import React, { useState } from 'react';
import './Home.css';

function Upload({ user, setCurrentPage }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [error, setError] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, 
                    author, 
                    year, 
                    file_name: fileName, 
                    file_url: fileUrl, 
                    user_id: user.id 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to upload resource');
                return;
            }

            alert('Resource uploaded successfully!');
            setCurrentPage('home');
        } catch (err) {
            setError('Network error during upload');
        }
    };

    return (
        <div className="home-container" style={{ maxWidth: '500px', margin: '40px auto' }}>
            <button onClick={() => setCurrentPage('home')} className="upload-btn" style={{ marginBottom: '20px' }}>
                ← Back to Library
            </button>
            <h1>Upload Resource</h1>
            {error && <p className="error-msg" style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '10px' }} />
                <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required style={{ padding: '10px' }} />
                <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required style={{ padding: '10px' }} />
                <input type="text" placeholder="File Name (e.g. physics.pdf)" value={fileName} onChange={(e) => setFileName(e.target.value)} style={{ padding: '10px' }} />
                <input type="url" placeholder="File/Document URL Link" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} required style={{ padding: '10px' }} />
                <button type="submit" className="upload-btn" style={{ padding: '12px' }}>Submit Upload</button>
            </form>
        </div>
    );
}

export default Upload;