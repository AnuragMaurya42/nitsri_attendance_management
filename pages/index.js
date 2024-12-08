import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import image from "./images.png";

export default function Home() {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if permission has already been granted
    const isPermissionGranted = localStorage.getItem("storagePermissionGranted");
    if (!isPermissionGranted) {
      setShowPermissionDialog(true); // Show the dialog only if permission is not granted
    }
  }, []);

  const handleAllowStorage = () => {
    setShowPermissionDialog(false);
    console.log("Storage permission granted.");
    localStorage.setItem("storagePermissionGranted", "true"); // Store permission status
  };

  const handleDenyStorage = () => {
    setShowPermissionDialog(false);
    console.log("Storage permission denied.");
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${image.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "1rem",
        }}
      >
        {/* Neon Glow Logo */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            boxShadow: "0 0 20px rgba(0, 244, 56, 0.8), 0 0 30px rgba(0, 244, 56, 0.6)",
            animation: "neon-glow 1.5s infinite alternate",
            marginBottom: "20px",
            transform: "translateY(-20px)",
          }}
        >
          <img
            src="/images.png"
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          />
          <style>
            {`
              @keyframes neon-glow {
                0% {
                  box-shadow: 0 0 20px rgba(0, 244, 56, 0.8), 0 0 30px rgba(0, 244, 56, 0.6);
                }
                50% {
                  box-shadow: 0 0 30px rgba(0, 244, 56, 1), 0 0 40px rgba(0, 244, 56, 0.8);
                }
                100% {
                  box-shadow: 0 0 20px rgba(0, 244, 56, 0.8), 0 0 30px rgba(0, 244, 56, 0.6);
                }
              }
            `}
          </style>
        </div>

        {/* Buttons */}
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <button
            type="button"
            style={{
              width: "100%",
              height: "60px",
              color: "white",
              backgroundColor: "rgb(0 244 56)",
              border: "none",
              borderRadius: "1rem",
              fontWeight: "500",
              fontSize: "1.5rem",
              padding: "0.625rem 1.25rem",
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => router.push("/login/admin")}
          >
            Admin
          </button>
          <button
            type="button"
            style={{
              width: "100%",
              height: "60px",
              color: "white",
              backgroundColor: "rgb(0 244 56)",
              border: "none",
              borderRadius: "1rem",
              fontWeight: "500",
              fontSize: "1.5rem",
              padding: "0.625rem 1.25rem",
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => router.push("/login/faculty")}
          >
            Faculty
          </button>
          <button
            type="button"
            style={{
              width: "100%",
              height: "60px",
              color: "white",
              backgroundColor: "rgb(0 244 56)",
              border: "none",
              borderRadius: "1rem",
              fontWeight: "500",
              fontSize: "1.5rem",
              padding: "0.625rem 1.25rem",
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => router.push("/login/student")}
          >
            Student
          </button>
        </div>

        {/* Storage Permission Modal */}
        {showPermissionDialog && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "1rem",
                width: "300px",
                textAlign: "center",
              }}
            >
              <h2>We need permission to access storage to save files for future downloads.</h2>
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1rem" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={handleAllowStorage}
                >
                  Allow
                </button>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={handleDenyStorage}
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
