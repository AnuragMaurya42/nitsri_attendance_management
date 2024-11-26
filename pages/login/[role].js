import React, { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          localStorage.setItem("admintoken", receivedData.token);
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
    if (role=='admin' && localStorage.getItem('admintoken')) {
      setLoading(false);
      router.push("/admin/dashboard");
    }
    else if (role=='student' && localStorage.getItem('studentToken')) {
      setLoading(false);
      router.push("/student/dashboard");
    }
    else if (role=='faculty' && localStorage.getItem('facultyToken')) {
      setLoading(false);
      router.push("/faculty/dashboard");
    }
    setLoading(false);
  }, [])


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
        <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Login
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-2"
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
                className="block text-sm font-medium text-gray-600 mb-2"
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
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              onClick={handleClick}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleSignupRedirect}
              className="inline-block w-full px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
            >
              Don't have an account?
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
