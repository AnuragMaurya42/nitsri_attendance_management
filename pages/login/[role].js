import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "./images.png";

function LoginPage() {
  const router = useRouter();
  const { role } = router.query;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupRedirect = () => {
    router.push(role ? `/signup/${role}` : "/signup");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.warn("All the fields are required!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }

    const endpoints = {
      admin: "/api/adminapis/login",
      student: "/api/studentapis/login",
      faculty: "/api/facultyapis/login",
    };

    const tokens = {
      admin: "adminToken",
      student: "studentToken",
      faculty: "facultyToken",
    };

    const dashboards = {
      admin: "/admin/dashboard",
      student: "/student/dashboard",
      faculty: "/faculty/dashboard",
    };

    try {
      const submittedData = { email, password };
      const res = await fetch(endpoints[role], {
        method: "POST",
        body: JSON.stringify(submittedData),
        headers: { "Content-Type": "application/json" },
      });
      const receivedData = await res.json();

      if (receivedData.Success) {
        localStorage.setItem(tokens[role], receivedData.token);
        toast.success(receivedData.SuccessMessage, {
          position: "top-center",
          autoClose: 1000,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => {
          router.push(dashboards[role]);
        }, 2200);
      } else {
        toast.error(receivedData.ErrorMessage, {
          position: "top-center",
          autoClose: 1000,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const tokenKey = `${role}Token`;
    if (role && localStorage.getItem(tokenKey)) {
      router.push(`/${role}/dashboard`);
    }
    setLoading(false);
  }, [role, router]);

  return (
    <div
      className="flex items-center justify-center h-screen w-full bg-gray-900"
      style={{
        backgroundImage: `url(${image.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer theme="colored" transition={Bounce} />

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      ) : (
        <div className="w-[90%] max-w-sm p-6 rounded-2xl shadow-xl bg-black/50 backdrop-blur-md text-white flex flex-col items-center">
          <img src="/images.png" alt="Logo" className="h-20 w-20 rounded-full mb-3" />
          <h2 className="text-2xl font-bold text-center mb-6">
            {role ? `${role.charAt(0).toUpperCase()}${role.slice(1)} Login` : "Login"}
          </h2>

          <form className="w-full">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-base border border-white rounded-xl bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 text-base border border-white rounded-xl bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="mb-4 text-right">
              <a
                href={`/login/forgotPassword?role=${role}`}
                className="text-sm text-white underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleClick}
              className="w-full py-3 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all duration-300"
            >
              Login
            </button>
          </form>

          {role !== "admin" && (
            <button
              onClick={handleSignupRedirect}
              className="w-full mt-3 py-3 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300"
            >
              Don't have an account?
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
