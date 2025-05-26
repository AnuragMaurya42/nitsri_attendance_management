// components/Navbar.js
import React from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    var role = localStorage.getItem("role");
    if (role === "faculty") {
      localStorage.removeItem("facultyToken");
    } else if (role === "admin") {
      localStorage.removeItem("adminToken");
    } else if (role === "student") {
      localStorage.removeItem("studentToken");
    }
    router.push("/");
  };

  const isRoot = router.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-between flex-wrap z-50">
      {!isRoot && (
        <div
          onClick={() => router.push("/")}
          className="flex items-center cursor-pointer"
        >
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
          <span className="ml-2 font-bold text-white">Home</span>
        </div>
      )}

      <div className="flex-grow flex justify-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 object-contain max-w-full"
        />
      </div>

      {!isRoot && (
        <div
          onClick={handleLogout}
          className="flex items-center cursor-pointer"
        >
          <span className="mr-2 font-bold text-white">Logout</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
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
