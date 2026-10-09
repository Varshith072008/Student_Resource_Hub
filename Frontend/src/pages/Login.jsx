import React, { useState } from 'react';
import './Home.css';

function Login({ setUser, setCurrentPage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to login');
                return;
            }

            setUser(data.user);
            setCurrentPage('home'); 
        } catch (err) {
            setError('Network error during login');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '30px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                <h2 style={{ marginBottom: '20px', color: '#1e293b', textAlign: 'center' }}>Login</h2>
                {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                    />
                    <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Login
                    </button>
                </form>

                {/* Switch to Register link */}
                <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                    Don't have an account?{' '}
                    <span 
                        onClick={() => setCurrentPage('register')} 
                        style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;