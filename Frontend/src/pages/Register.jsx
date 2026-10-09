import React, { useState } from 'react';
import './Home.css';

function Register({ setCurrentPage }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to register');
                return;
            }

            alert('Registration successful! Please login.');
            setCurrentPage('login'); // Send them to login page after registration
        } catch (err) {
            setError('Network error during registration');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '30px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                <h2 style={{ marginBottom: '20px', color: '#1e293b', textAlign: 'center' }}>Register</h2>
                {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
                
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                    />
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
                        Register
                    </button>
                </form>

                {/* Switch to Login link */}
                <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                    Already have an account?{' '}
                    <span 
                        onClick={() => setCurrentPage('login')} 
                        style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;