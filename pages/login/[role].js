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
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email && !password) {
      toast.warn("All the fields are required!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }

    // API call based on role - shortened for clarity (same as original)
    // Please keep your API call logic here exactly as you have it

    // Example for admin:
    if (role === "admin") {
      try {
        const submittedData = { email, password };
        const res = await fetch("/api/adminapis/login", {
          method: "POST",
          body: JSON.stringify(submittedData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const receivedData = await res.json();

        if (receivedData.Success) {
          setLoading(false);
          localStorage.setItem("adminToken", receivedData.token);
          toast.success(receivedData.SuccessMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 2200);
        } else {
          setLoading(false);
          toast.error(receivedData.ErrorMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        setLoading(false);
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    }
    // Repeat similarly for student and faculty roles
    else if (role === "student") {
      try {
        const submittedData = { email, password };
        const res = await fetch("/api/studentapis/login", {
          method: "POST",
          body: JSON.stringify(submittedData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const receivedData = await res.json();

        if (receivedData.Success) {
          setLoading(false);
          localStorage.setItem("studentToken", receivedData.token);
          toast.success(receivedData.SuccessMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          setTimeout(() => {
            router.push("/student/dashboard");
          }, 2200);
        } else {
          setLoading(false);
          toast.error(receivedData.ErrorMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        setLoading(false);
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } else if (role === "faculty") {
      try {
        const submittedData = { email, password };
        const res = await fetch("/api/facultyapis/login", {
          method: "POST",
          body: JSON.stringify(submittedData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const receivedData = await res.json();

        if (receivedData.Success) {
          setLoading(false);
          localStorage.setItem("facultyToken", receivedData.token);
          toast.success(receivedData.SuccessMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          setTimeout(() => {
            router.push("/faculty/dashboard");
          }, 2200);
        } else {
          setLoading(false);
          toast.error(receivedData.ErrorMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        setLoading(false);
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (role === "admin" && localStorage.getItem("adminToken")) {
      setLoading(false);
      router.push("/admin/dashboard");
    } else if (role === "student" && localStorage.getItem("studentToken")) {
      setLoading(false);
      router.push("/student/dashboard");
    } else if (role === "faculty" && localStorage.getItem("facultyToken")) {
      setLoading(false);
      router.push("/faculty/dashboard");
    }
    setLoading(false);
  }, [role, router]);


  
 return (
  <div
    className="relative flex justify-center min-h-screen bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url(${image.src})`,
      paddingTop: "60px",
      alignItems: "flex-start"
    }}
  >
    {/* Dark overlay for contrast */}
    <div className="absolute inset-0 bg-black opacity-60"></div>

    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />

    {loading ? (
      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    ) : (
      <div className="relative z-10 w-full max-w-xs p-8 bg-gray-800 bg-opacity-90 rounded-3xl shadow-2xl min-w-[320px]">
        <div className="flex justify-center mb-6">
          <img
            src="/images.png"
            alt="Logo"
            className="w-20 h-20 rounded-full shadow-lg object-cover"
          />
        </div>

        <h2 className="mb-8 text-3xl font-extrabold text-center text-white tracking-wide">
          {role
            ? `${role.charAt(0).toUpperCase()}${role.slice(1)} Login`
            : "Login"}
        </h2>
          <form>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-md font-semibold text-green-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-green-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-md font-semibold text-green-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-green-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-6 text-right">
              <a
                href={`/login/forgotPassword?role=${role}`}
                className="text-sm font-semibold text-green-400 hover:text-green-600 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleClick}
              className="w-full py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Login
            </button>
          </form>

          {role !== "admin" && (
            <button
              onClick={handleSignupRedirect}
              className="w-full py-3 mt-5 font-semibold text-green-400 bg-transparent border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
            >
              Don&apos;t have an account?
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
