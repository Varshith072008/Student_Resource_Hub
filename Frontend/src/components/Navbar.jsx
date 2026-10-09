import React from 'react';
import './Navbar.css';

function Navbar({ user, setUser, setCurrentPage }) {
    return (
        <nav className="navbar">
            <div className="logo">
                Student Hub
            </div>
            
            <div className="nav-links">

                {user ? (
                    <>
                        <button className="nav-btn" onClick={() => setCurrentPage('home')}>
                            Library
                        </button>
                        <button className="nav-btn" onClick={() => setCurrentPage('favorites')}>
                            My Favorites
                        </button>
                        <button className="nav-btn" onClick={() => setCurrentPage('upload')}>
                            Upload
                        </button>
                        <div className="user-box">
                            <span>Welcome, {user.name}</span>
                            <button className="logout-btn" onClick={() => { setUser(null); setCurrentPage('login'); }}>
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    
                    <>
                        <button className="nav-btn" onClick={() => setCurrentPage('login')}>
                            Login
                        </button>
                        <button className="register-btn" onClick={() => setCurrentPage('register')}>
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;