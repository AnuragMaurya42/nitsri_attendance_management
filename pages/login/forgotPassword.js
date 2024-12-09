import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import image from "./images.png";

function ForgotPassword() {
    const [formData, setFormData] = useState({
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
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { role } = router.query;

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
            if (response.ok && data.Success) {
                setReceivedOtp(data.otp);
                toast.success("OTP sent to your email!", { theme: "colored", transition: Bounce });
                setOtpSent(true);
            } else {
                toast.error(data.ErrorMessage || "Error sending OTP.", { theme: "colored", transition: Bounce });
            }
        } catch (error) {
            toast.error("An error occurred while sending OTP.", { theme: "colored", transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = () => {
        setLoading(true);
        if (formData.otp.trim() !== String(receivedOtp).trim()) {
            setErrors((prev) => ({ ...prev, otp: "Invalid OTP. Please try again." }));
            setLoading(false);
            return;
        }
        setIsVerified(true);
        toast.success("OTP verified successfully!", { theme: "colored", transition: Bounce });
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isVerified) {
            toast.warn("Please verify your email first.", { theme: "colored", transition: Bounce });
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors((prev) => ({ ...prev, password: "Passwords do not match." }));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/Utils/setPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, email: formData.email, password: formData.password }),
            });

            const data = await response.json();
            if (response.ok && data.Success) {
                toast.success(data.SuccessMessage || "Password changed successfully!", { theme: "colored", transition: Bounce });
                setTimeout(() => {
                    router.push(`/login/${role}/`);
                }, 2000);
            } else {
                toast.error(data.ErrorMessage || "Error changing password.", { theme: "colored", transition: Bounce });
            }
        } catch (error) {
            toast.error("An error occurred during password change.", { theme: "colored", transition: Bounce });
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        router.push(`/login/${role}/`);
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gray-100"
            style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <ToastContainer theme="colored" transition={Bounce} />
            <div className="w-full max-w-xs p-6 rounded-lg shadow-md bg-gray-900 bg-opacity-80">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[500px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password?</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-lg text-white mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            {otpSent && (
                                <div className="mb-4">
                                    <label htmlFor="otp" className="block text-lg text-white mb-2">OTP</label>
                                    <input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors.otp ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp}</p>}
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        className={`w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${isVerified ? "opacity-50 cursor-not-allowed" : ""}`}
                                        disabled={isVerified}  // Disable button after OTP verification
                                    >
                                        Verify OTP
                                    </button>

                                </div>
                            )}

                            {!otpSent && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Send OTP
                                </button>
                            )}

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-lg text-white mb-2">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-lg text-white mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none border-gray-300"
                                />
                            </div>

                            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Submit
                            </button>
                        </form>

                        <button
                            onClick={handleLoginRedirect}
                            className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
