import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectCurrentToken, logOut } from '../store/authSlice';
import api from '../api/axios';
import { useState } from 'react';

const Dashboard = () => {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    const handleLogout = async () => {
        try {
            // Optional: Tell the backend to invalidate the Refresh Token cookie
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Logout failed on server, but we will clear local state anyway.");
        } finally {
            // Clear the Access Token from Redux memory
            dispatch(logOut());
            navigate('/login');
        }
    };

    const fetchSecureData = async () => {
        try {
            // Look ma, no hands! We don't manually attach the token here.
            // Our Axios Interceptor (api/axios.js) does it automatically!
            const response = await api.get('/secure-data-endpoint');
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Welcome to the Dashboard!</h1>
            <p>You are successfully logged in and looking at a protected route.</p>
            
            <div style={{ margin: '2rem 0', padding: '1rem', backgroundColor: '#e5e7eb', borderRadius: '8px' }}>
                <h3>Your Current State:</h3>
                <p><strong>User:</strong> {user ? JSON.stringify(user) : 'Unknown'}</p>
                <p><strong>Access Token in Memory:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                    onClick={fetchSecureData}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Test Secure API Call
                </button>
                <button 
                    onClick={() => navigate('/play/martian_mike')}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Play Martian Mike
                </button>
                <button 
                    onClick={handleLogout}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>

            {data && (
                <pre style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#374151', color: 'white', borderRadius: '4px' }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default Dashboard;
