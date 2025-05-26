import React from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        var role = localStorage.getItem('role');
        if (role === 'faculty') {
            localStorage.removeItem('facultyToken');
        } else if (role === 'admin') {
            localStorage.removeItem('adminToken');
        } else if (role === 'student') {
            localStorage.removeItem('studentToken');
        }
        router.push("/");
    };

    const isRoot = router.pathname === '/';

    return (
        <nav
            style={{
                backgroundColor: '#2d3748', // Tailwind bg-gray-800
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            }}
        >
            {/* Home Button */}
            {!isRoot && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                        marginBottom: '0', // Tailwind sm:mb-0
                    }}
                    onClick={() => router.push('/')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        style={{ height: '1.5rem', width: '1.5rem', color: 'white' }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                    </svg>
                    <span style={{ marginLeft: '0.5rem', color: 'white', fontWeight: 'bold' }}>
                        Home
                    </span>
                </div>
            )}

            {/* Center Logo */}
            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1rem', // Tailwind mb-4
                    marginBottom: '0', // Tailwind sm:mb-0
                }}
            >
                <img
                    src="/logo.png"
                    alt="Logo"
                    style={{
                        height: '2.5rem',
                        width: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                    }}
                />
            </div>

            {/* Logout Button */}
            {!isRoot && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={handleLogout}
                >
                    <span
                        style={{
                            marginRight: '0.5rem',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        Logout
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ height: '1.5rem', width: '1.5rem', color: 'white' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2h-4a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                        />
                    </svg>
                </div>
            )}
        </nav>
    );
}
