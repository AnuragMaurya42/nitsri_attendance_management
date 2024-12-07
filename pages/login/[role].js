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
    } else if (role === "student") {
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
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${image.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
        <div className="relative h-custom flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div
          className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md"
          style={{ backgroundColor: "rgb(0 0 0 / 0%)" }}
        >
          <div className="mb-5 flex justify-center h-25">
            <img
              src="/images.png" // Correct usage of the imported logo
              alt="Logo"
              className="rounded-full"
            />
          </div>

          <h2 className="text-2xl font-bold  text-center text-white mb-6">
            {role
              ? `${role.charAt(0).toUpperCase()}${role.slice(1)} Login`
              : "Login"}
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-lg font-medium text-white mb-2"
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
                className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-lg font-medium text-white mb-2"
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
                className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4 text-right">
              <a
                href="/forgot-password"
                className="text-lg font-bold text-white  bg-transparent"
              >
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleClick}
              className="w-full px-4 py-2 text-lg font-medium text-white bg-green-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Login
            </button>
          </form>

          {role !== 'admin' && <button
            onClick={handleSignupRedirect}
            className="w-full px-4 py-2 text-lg font-medium text-white bg-green-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3"
          >
            Don&apos;t have an account?
          </button>}

        </div>
      )}
    </div>
  );
}

export default LoginPage;
