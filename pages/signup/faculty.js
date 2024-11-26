import React, { useState } from "react";
import { useRouter } from 'next/router';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading,setLoading]=useState(false);

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electrical Engineering",
    "Electronics and communication engineering ",
    "Civil engineering",
    "Mechanical engineering",
    "Chemical engineering",
    "Metallurgy"
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
    const enteredOtp = formData.otp.trim();
    const backendOtp = String(receivedOtp).trim();
    setLoading(true);
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
      const response = await fetch("/api/facultyapis/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          department: formData.department,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
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
        // Redirect to login page after successful signup
        router.push('/login/faculty');
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
      toast.error("An error occurred while signing up.", {
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
          Faculty Signup
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Department Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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

          {/* Email Input */}
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
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
              required
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* OTP Section */}
          {otpSent && (
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${errors.otp ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                  }`}
                required
              />
              {errors.otp && (
                <p className="text-xs text-red-500 mt-1">{errors.otp}</p>
              )}

              {isVerified ? (
                <div className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md text-center">
                  ✔️ Verified
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
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
              className="w-full mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send OTP
            </button>
          )}

          {/* Password Input */}
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Signup
          </button>
        </form>
      </div>
                        )}
    </div>
  );
}

export default SignupPage;
