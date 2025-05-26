import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import image from "./images.png";

function StudentSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    batch: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    batch: "",
    email: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electrical Engineering",
    "Electronics and Communication Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Chemical Engineering",
    "Metallurgy",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSendOtp = async () => {
    setLoading(true);
    if (!formData.email.endsWith("@nitsri.ac.in")) {
      setErrors((prev) => ({
        ...prev,
        email: "Email must belong to the domain '@nitsri.ac.in'.",
      }));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/Utils/getCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        if (data.Success) {
          setReceivedOtp(data.otp);
        }
        toast.success("OTP sent to your email!", {
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
        setOtpSent(true);
      } else {
        toast.error(data.ErrorMessage || "Error sending OTP.", {
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
      }
    } catch (error) {
      toast.error("An error occurred while sending OTP.", {
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
    }
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    const enteredOtp = formData.otp.trim();
    const backendOtp = String(receivedOtp).trim();
    if (enteredOtp !== backendOtp) {
      setErrors((prev) => ({
        ...prev,
        otp: "Invalid OTP. Please try again.",
      }));
      setLoading(false);
      return;
    }
    setLoading(false);
    setIsVerified(true);
    toast.success("OTP verified successfully!", {
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
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Check if OTP is verified
    if (!isVerified) {
      toast.warn("Please verify your email first.", {
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

    // Batch Validation
    if (formData.batch < 1000 || formData.batch > 9999) {
      setErrors((prev) => ({
        ...prev,
        batch: "Batch must be a valid 4-digit year (e.g., 2021).",
      }));
      setLoading(false);
      return;
    }

    // Email Validation
    if (!formData.email.endsWith("@nitsri.ac.in")) {
      setErrors((prev) => ({
        ...prev,
        email: "Email must belong to the domain '@nitsri.ac.in'.",
      }));
      setLoading(false);
      return;
    }

    // Password Validation
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "Passwords do not match.",
      }));
      setLoading(false);
      return;
    }

    try {
      // Submit the form to the backend for user registration
      const response = await fetch("/api/studentapis/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          department: formData.department,
          batch: formData.batch,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // Check if the response is successful (status code 2xx)
      if (!data.Success) {
        // Handle non-2xx responses
        const errorData = await response.json();
        toast.error(errorData.ErrorMessage || "Error during signup.", {
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

      // Proceed only if data contains Success property and it's true
      if (data.Success) {
        toast.success(data.SuccessMessage || "Successfully signed up!", {
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
        setTimeout(() => {
          router.push("/login/student");
        }, 2000);
      } else {
        toast.error(data.ErrorMessage || "Error during signup.", {
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
      }
    } catch (error) {
      // Catch network or other errors
      toast.error(error, {
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
    } finally {
      setLoading(false); // Ensure loading is set to false after everything completes
    }
  };

  const handleLogninRedirect = () => {
    router.push("/login/student");
  };

  return (
  <div
    className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
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
      <div className="relative h-custom flex justify-center items-center opacity-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    ) : (
      <div
        className="w-full max-w-xs max-h-[90vh] p-4 rounded-lg shadow-md bg-black bg-opacity-60 overflow-y-auto"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <h2 className="text-xl font-semibold text-center text-white mb-1">
          Student Signup
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-3">
            <label htmlFor="name" className="block text-sm text-white font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Department Dropdown */}
          <div className="mb-3">
            <label htmlFor="department" className="block text-sm text-white font-medium mb-1">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>
                Select your department
              </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Input */}
          <div className="mb-3">
            <label htmlFor="batch" className="block text-sm text-white font-medium mb-1">
              Batch
            </label>
            <input
              type="number"
              id="batch"
              name="batch"
              placeholder="Enter batch year (e.g., 2021)"
              value={formData.batch}
              onChange={handleChange}
              className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                errors.batch
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
              required
            />
            {errors.batch && (
              <p className="text-xs text-red-500 mt-1">{errors.batch}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="block text-sm text-white font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
              required
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* OTP Section */}
          {otpSent && (
            <div className="mb-3">
              <label htmlFor="otp" className="block text-sm text-white font-medium mb-1">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                  errors.otp
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                required
              />
              {errors.otp && (
                <p className="text-xs text-red-500 mt-1">{errors.otp}</p>
              )}

              {isVerified ? (
                <div className="w-full mt-2 px-3 py-1.5 text-sm font-medium text-white bg-gray-500 rounded-md text-center">
                  ✔️ Verified
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full mt-2 px-3 py-1.5 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Verify OTP
                </button>
              )}
            </div>
          )}

          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full mb-4 px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send OTP
            </button>
          )}

          {/* Password and Confirm Password */}
          <div className="mb-3">
            <label htmlFor="password" className="block text-sm text-white font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-white font-medium mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={handleLogninRedirect}
            className="w-full px-3 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Click here to sign in!
          </button>
        </div>
      </div>
    )}
  </div>
);

}

export default StudentSignupPage;
