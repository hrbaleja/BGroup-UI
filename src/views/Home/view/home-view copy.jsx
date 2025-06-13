import React, { useState } from 'react';

const APPNAME = import.meta.env.VITE_APP_NAME;

const HomeView = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // You can replace this URL with your actual image URL or use a local path
    //const backgroundImageUrl = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2835&q=80";
    const backgroundImageUrl = "/assets/background/6345959.jpg";
    // Alternative travel images you can use:
    // "https://images.unsplash.com/photo-1506905925346-21bda4d32df4" // Mountain landscape
    // "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" // Beach scene
    // "https://images.unsplash.com/photo-1469474968028-56623f02e42e" // Nature path

    const styles = {
        mainContainer: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            overflow: 'hidden',
            backgroundImage: `
                linear-gradient(135deg, 
                    rgba(118, 120, 121, 0.8) 0%,
                    rgba(117, 122, 122, 0.75) 25%,
                    rgba(147, 172, 172, 0.7) 50%,
                    rgba(180, 176, 189, 0.75) 75%,
                    rgba(45, 50, 51, 0.8) 100%
                ),
                url('${backgroundImageUrl}')
            `,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundAttachment: 'fixed, fixed',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        animatedBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.15,
            background: `
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0px, transparent 50px),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0px, transparent 50px),
                radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.25) 0px, transparent 30px),
                radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.2) 0px, transparent 40px),
                radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.3) 0px, transparent 35px)
            `,
            animation: 'float 6s ease-in-out infinite',
        },
        floatingIcon1: {
            position: 'absolute',
            top: '10%',
            left: '10%',
            fontSize: '3rem',
            opacity: 0.2,
            animation: 'float 4s ease-in-out infinite',
        },
        floatingIcon2: {
            position: 'absolute',
            top: '20%',
            right: '15%',
            fontSize: '2.5rem',
            opacity: 0.3,
            animation: 'float 5s ease-in-out infinite',
            animationDelay: '1s',
        },
        floatingIcon3: {
            position: 'absolute',
            bottom: '15%',
            left: '20%',
            fontSize: '2rem',
            opacity: 0.25,
            animation: 'float 4.5s ease-in-out infinite',
            animationDelay: '2s',
        },
        floatingIcon4: {
            position: 'absolute',
            bottom: '25%',
            right: '10%',
            fontSize: '2.8rem',
            opacity: 0.2,
            animation: 'float 5.5s ease-in-out infinite',
            animationDelay: '0.5s',
        },
        contentContainer: {
            textAlign: 'center',
            color: 'white',
            zIndex: 2,
            position: 'relative',
            maxWidth: '900px',
            padding: '0 32px',
        },
        titleContainer: {
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(25px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '48px 64px',
            marginBottom: '32px',
            animation: 'fadeInUp 1s ease-out',
            boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.15),
                0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `,
        },
        mainTitle: {
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            background: 'linear-gradient(45deg, #ffffff 30%, #e0f2fe 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            marginBottom: '16px',
            lineHeight: 1.1,
        },
        subtitle: {
            fontWeight: 400,
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            opacity: 0.95,
            textShadow: '0 1px 5px rgba(0,0,0,0.2)',
            lineHeight: 1.4,
            margin: 0,
        },
        featuresContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            animation: 'fadeInUp 1s ease-out 0.3s both',
        },
        featureChip: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '12px 24px',
            fontSize: '1.1rem',
            fontWeight: 500,
            animation: 'fadeInUp 1s ease-out both',
            transition: 'all 0.3s ease',
            cursor: 'default',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        },
        ctaContainer: {
            animation: 'fadeInUp 1s ease-out 0.8s both',
        },
        ctaButton: {
            background: 'linear-gradient(45deg, #ffffff 30%, #f0f9ff 90%)',
            color: '#1e293b',
            fontWeight: 700,
            fontSize: '1.2rem',
            padding: '16px 48px',
            borderRadius: '50px',
            textTransform: 'none',
            boxShadow: `
                0 8px 25px rgba(0, 0, 0, 0.15),
                0 4px 10px rgba(0, 0, 0, 0.1)
            `,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            animation: 'pulse 2s ease-in-out infinite',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        },
        additionalInfo: {
            marginTop: '24px',
            opacity: 0.8,
            fontSize: '1rem',
            animation: 'fadeInUp 1s ease-out 1s both',
        },
        decorativeWave: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
            clipPath: 'polygon(0 50%, 100% 80%, 100% 100%, 0% 100%)',
        },
        keyframes: `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
        `
    };

    const handleGetStarted = () => {
        // Simulate navigation to login page
        alert('Redirecting to login page...');
    };

    return (
        <>
            <style>{styles.keyframes}</style>
            <div style={styles.mainContainer}>
                {/* Animated Background Elements */}
                <div style={styles.animatedBackground} />

                {/* Floating Travel Icons */}
                <div style={styles.floatingIcon1}>✈️</div>
                <div style={styles.floatingIcon2}>🧳</div>
                <div style={styles.floatingIcon3}>📱</div>
                <div style={styles.floatingIcon4}>🗺️</div>

                {/* Content Container */}
                <div style={styles.contentContainer}>
                    {/* Main Title with Glassmorphism Background */}
                    <div style={styles.titleContainer}>
                        <h1 style={styles.mainTitle}>
                            {APPNAME}
                        </h1>

                        <p style={styles.subtitle}>
                            Your ultimate solution for managing tasks efficiently
                        </p>
                    </div>

                    {/* Feature Highlights */}
                    <div style={styles.featuresContainer}>
                        {['📋 Organize', '⚡ Fast', '🎯 Efficient'].map((feature, index) => (
                            <div
                                key={feature}
                                style={{
                                    ...styles.featureChip,
                                    animationDelay: `${0.5 + index * 0.1}s`,
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                {feature}
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div style={styles.ctaContainer}>
                        <button
                            style={styles.ctaButton}
                            onClick={handleGetStarted}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            🚀 Get Started Now
                        </button>
                    </div>

                    {/* Additional Info */}
                    <p style={styles.additionalInfo}>
                        Join thousands of users who trust {APPNAME}
                    </p>
                </div>

                {/* Bottom Decorative Wave */}
                <div style={styles.decorativeWave} />
            </div>
        </>
    );
};

export default HomeView;