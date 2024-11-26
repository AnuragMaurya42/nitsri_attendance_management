import React from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        sessionStorage.removeItem('authToken');
        window.location.href = '/'; 
    };
    

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
            {/* Home Button */}
            <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 text-white"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                </svg>
                <span className="ml-2 text-white font-bold">Home</span>
            </div>

            {/* Center Circular Logo */}
            <div className="flex justify-center items-center">
                <img
                    src="/logo.jpg" // Correct usage of the imported logo
                    alt="Logo"
                    className="h-10 w-10 rounded-full object-cover"
                />
            </div>

            {/* Logout Button */}
            <div className="flex items-center cursor-pointer" onClick={handleLogout}>
                <span className="mr-2 text-white font-bold">Logout</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
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
        </nav>
    );
}

