import React, { useState } from "react";

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

  const handleSendOtp = () => {
    if (!formData.email.endsWith("@nitsri.ac.in")) {
      setErrors((prev) => ({
        ...prev,
        email: "Email must belong to the domain '@nitsri.ac.in'.",
      }));
      return;
    }
    // Mock sending OTP
    alert("OTP sent to your email!");
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (formData.otp !== "123456") { // Mock OTP verification
      setErrors((prev) => ({
        ...prev,
        otp: "Invalid OTP. Please try again.",
      }));
      return;
    }
    alert("OTP verified successfully!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Batch Validation
    if (formData.batch < 1000 || formData.batch > 9999) {
      setErrors((prev) => ({
        ...prev,
        batch: "Batch must be a valid 4-digit year (e.g., 2021).",
      }));
      return;
    }

    // Email Validation
    if (!formData.email.endsWith("@nitsri.ac.in")) {
      setErrors((prev) => ({
        ...prev,
        email: "Email must belong to the domain '@nitsri.ac.in'.",
      }));
      return;
    }

    // Password Validation
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: "Passwords do not match.",
      }));
      return;
    }

    // Submit Form
    alert("Form submitted successfully!");
    console.log(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Student Signup
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

          {/* Batch Input */}
          <div className="mb-4">
            <label
              htmlFor="batch"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Batch
            </label>
            <input
              type="number"
              id="batch"
              name="batch"
              placeholder="Enter batch year (e.g., 2021)"
              value={formData.batch}
              onChange={handleChange}
              className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                errors.batch ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              required
            />
            {errors.batch && (
              <p className="text-xs text-red-500 mt-1">{errors.batch}</p>
            )}
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
              className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
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
                className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                  errors.otp ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
                required
              />
              {errors.otp && (
                <p className="text-xs text-red-500 mt-1">{errors.otp}</p>
              )}
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Verify OTP
              </button>
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

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Signup
          </button>
        </form>

        {/* Go to Login Page Button */}
        <div className="mt-4 text-center">
          <a
            href="/login/student"
            className="inline-block w-full px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
}

export default StudentSignupPage;
