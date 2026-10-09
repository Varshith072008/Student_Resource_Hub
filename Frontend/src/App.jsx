import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Favorites from './pages/Favorites';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('login');

    return (
        <div className="app">
            <Navbar user={user} setUser={setUser} setCurrentPage={setCurrentPage} />

            <div className="content">
                {!user ? (
                    currentPage === 'register' ? (
                        <Register setCurrentPage={setCurrentPage} />
                    ) : (
                        <Login setUser={setUser} setCurrentPage={setCurrentPage} />
                    )
                ) : (
                   
                    <>
                        {currentPage === 'home' && <Home user={user} setCurrentPage={setCurrentPage} />}
                        {currentPage === 'upload' && <Upload user={user} setCurrentPage={setCurrentPage} />}
                        {currentPage === 'favorites' && <Favorites user={user} setCurrentPage={setCurrentPage} />}
                    </>
                )}
            </div>
        </div>
    );
}

export default App;