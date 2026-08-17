import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, logOut } from '../store/authSlice';
import api from '../api/axios';

const Dashboard = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const usernameDisplay = typeof user === 'string' ? user : (user?.username || user?.displayName || 'Gamer');

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Logout failed on server, clearing local state.");
        } finally {
            dispatch(logOut());
            navigate('/login');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            fontFamily: 'sans-serif'
        }}>
            {/* Top Navigation Bar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#1e293b',
                borderBottom: '1px solid #334155'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🎮</span>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#38bdf8', fontWeight: 'bold' }}>
                        HgZone Portal
                    </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                        Logged in as <strong style={{ color: '#f8fafc' }}>{usernameDisplay}</strong>
                    </span>
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.25rem', margin: '0 0 0.5rem 0', fontWeight: '800' }}>
                        Welcome back, <span style={{ color: '#38bdf8' }}>{usernameDisplay}</span>!
                    </h1>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
                        Select a game to start playing on the web portal.
                    </p>
                </header>

                {/* Games Section */}
                <section>
                    <h3 style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Available Games
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {/* Martian Mike Game Card */}
                        <div style={{
                            backgroundColor: '#1e293b',
                            borderRadius: '12px',
                            border: '1px solid #334155',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}>
                            <div style={{
                                height: '160px',
                                backgroundColor: '#334155',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '4rem',
                                background: 'linear-gradient(135deg, #4c1d95 0%, #831843 100%)'
                            }}>
                                👨‍🚀
                            </div>
                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#f8fafc' }}>
                                    Martian Mike
                                </h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1.5rem 0', flex: 1, lineHeight: 1.4 }}>
                                    Navigate through challenging obstacle courses in space! Built in Godot Engine for Web.
                                </p>
                                <button 
                                    onClick={() => navigate('/play/martian_mike')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        backgroundColor: '#8b5cf6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <span>▶</span> Play Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
