import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const GamePlayer = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const iframeRef = useRef(null);
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const gameUrl = `/games/${gameId}/index.html`;

    const focusGame = () => {
        setTimeout(() => {
            if (iframeRef.current) {
                iframeRef.current.focus();
                try {
                    iframeRef.current.contentWindow?.focus();
                } catch (e) {
                    // ignore cross-origin edge cases
                }
            }
        }, 100);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const inFullscreen = !!document.fullscreenElement;
            setIsFullscreen(inFullscreen);
            focusGame();
        };

        const handleMessage = (event) => {
            if (!event.data) return;
            const dataStr = typeof event.data === 'string' ? event.data.toLowerCase() : JSON.stringify(event.data || '').toLowerCase();
            // Only redirect if message explicitly requests a game quit
            if (
                dataStr.includes('hgzone_quit') || 
                dataStr.includes('godot_quit') || 
                dataStr === 'quit'
            ) {
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                }
                navigate('/dashboard');
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('message', handleMessage);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const toggleFullscreen = (e) => {
        if (e) e.stopPropagation();
        if (!document.fullscreenElement) {
            const target = containerRef.current || iframeRef.current;
            if (target?.requestFullscreen) {
                target.requestFullscreen()
                    .then(() => focusGame())
                    .catch(err => {
                        console.error("Error attempting to enable fullscreen:", err);
                        focusGame();
                    });
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => focusGame());
            }
        }
    };

    return (
        <div 
            ref={containerRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100vw',
                backgroundColor: '#000000',
                color: 'white',
                fontFamily: 'sans-serif',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Header - shown when not in native fullscreen or auto-hides */}
            {!isFullscreen && (
                <div style={{
                    padding: '0.75rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#1f2937',
                    borderBottom: '1px solid #374151',
                    zIndex: 10
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', textTransform: 'capitalize', fontWeight: '600' }}>
                        {gameId.replace(/[-_]/g, ' ')}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button 
                            onClick={toggleFullscreen}
                            title="Toggle Fullscreen"
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                            </svg>
                            Fullscreen
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Game Canvas Container */}
            <div 
                onClick={focusGame}
                style={{ 
                    flex: 1, 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%', 
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000000'
                }}
            >
                <iframe
                    ref={iframeRef}
                    src={gameUrl}
                    title={`${gameId} game`}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        display: 'block'
                    }}
                    allow="autoplay; fullscreen; cross-origin-isolated"
                />

                {/* Floating Exit Fullscreen Button when in Native Fullscreen mode */}
                {isFullscreen && (
                    <button
                        onClick={toggleFullscreen}
                        title="Exit Fullscreen"
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            zIndex: 100,
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                        </svg>
                        Exit Fullscreen
                    </button>
                )}
            </div>
        </div>
    );
};

export default GamePlayer;

