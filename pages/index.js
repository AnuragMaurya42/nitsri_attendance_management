import { useRouter } from "next/router";
import image from "./images.png";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="logo-container">
        <img src="/images.png" alt="Logo" className="logo" />
      </div>

      <div className="btn-container">
        <button className="btn" onClick={() => router.push("/login/admin")}>
          Admin
        </button>
        <button className="btn" onClick={() => router.push("/login/faculty")}>
          Faculty
        </button>
        <button className="btn" onClick={() => router.push("/login/student")}>
          Student
        </button>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: #ece9e6;
          background-image: url(${image.src});
          background-size: cover;
          background-position: center;
          perspective: 1000px;
        }

        .logo-container {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo {
          width: 180px; /* Increased size */
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
          transform: translateZ(30px);
        }

        .btn-container {
          width: 100%;
          max-width: 350px;
          align-items: center;
          justify-content: center;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .btn {
          width: 80%;
          height: 60px;
          background: linear-gradient(145deg, rgb(246, 36, 17), rgb(246, 13, 13));
          color: white;
          border: none;
          align-items: center;
          border-radius: 15px;
          font-size: 1.25rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2),
            -5px -5px 10px rgba(255, 255, 255, 0.7);
          transform: translateZ(10px);
          transition: transform 0.3s, box-shadow 0.3s;
          outline: none;
        }

        .btn:hover {
          transform: translateY(-5px) translateZ(10px);
          box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.3),
            -10px -10px 20px rgba(255, 255, 255, 0.8);
          animation-play-state: paused;
        }

        .animated {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1) translateZ(10px);
          }
          50% {
            transform: scale(1.03) translateZ(10px);
          }
          100% {
            transform: scale(1) translateZ(10px);
          }
        }
      `}</style>
    </div>
  );
}
