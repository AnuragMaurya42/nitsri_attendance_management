// components/Navbar.js
import React from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const isRoot = router.pathname === '/';

  const handleLogout = () => {
    const role = localStorage.getItem('role');
    if (role === 'faculty') localStorage.removeItem('facultyToken');
    else if (role === 'admin') localStorage.removeItem('adminToken');
    else if (role === 'student') localStorage.removeItem('studentToken');
    router.push('/');
  };

  return (
    <nav
      style={{
        backgroundColor: '#2d3748',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Home button */}
      {!isRoot && (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{ height: '1.25rem', width: '1.25rem', color: 'white' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9" />
          </svg>
          <span style={{ marginLeft: '0.5rem', color: 'white', fontSize: '0.9rem' }}>Home</span>
        </div>
      )}

      {/* Logo */}
      <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '2rem', objectFit: 'contain' }} />
      </div>

      {/* Logout button */}
      {!isRoot && (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleLogout}
        >
          <span style={{ marginRight: '0.4rem', color: 'white', fontSize: '0.9rem' }}>Logout</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: '1.25rem', width: '1.25rem', color: 'white' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg>
        </div>
      )}
    </nav>
  );
}
