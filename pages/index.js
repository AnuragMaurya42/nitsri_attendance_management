import { useRouter } from "next/router";
import image from "./images.png";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="wrapper"
      style={{
        minHeight: "100vh",
        padding: "70px 1.5rem 40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // Align content to the top
        background: `linear-gradient(135deg, rgb(234, 228, 239), rgb(189, 217, 245))`,
        backgroundImage: `url(${image.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxSizing: "border-box",
      }}
    >
      <div className="glass-card">
        <div className="logo-wrapper">
          <img src="/images.png" alt="Logo" className="logo" />
        </div>

        <div className="buttons">
          <button onClick={() => router.push("/login/admin")}>Admin</button>
          <button onClick={() => router.push("/login/faculty")}>Faculty</button>
          <button onClick={() => router.push("/login/student")}>Student</button>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          /* Note: Inline styles override these,
             but keeping here for fallback */
          min-height: 100vh;
          padding: 70px 1.5rem 40px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: linear-gradient(135deg, rgb(234, 228, 239), rgb(189, 217, 245));
          background-size: cover;
          background-position: center;
          box-sizing: border-box;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          padding: 2rem;
        
          width: 100%;
          max-width: 350px;
          text-align: center;
        }

        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.8rem;
        }

        .logo {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .title {
          margin-top: 1rem;
          font-size: 1.8rem;
          font-weight: 700;
          color:rgb(247, 0, 0);
          font-family: "Segoe UI", sans-serif;
          letter-spacing: 1px;
        }

        .buttons {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        button {
          padding: 0.85rem 1.2rem;
          border-radius: 12px;
          background: linear-gradient(135deg,rgb(240, 23, 38),rgb(241, 17, 17));
          color: #fff;
          font-size: 1.1rem;
          font-weight: bold;
          border: none;
          cursor: pointer;
          box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover {
          transform: translateY(-4px);
          box-shadow: 6px 6px 20px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 480px) {
          .glass-card {
            padding: 1.5rem;
          }

          .title {
            font-size: 1.5rem;
          }

          button {
            font-size: 1rem;
            padding: 1.25rem 1rem;
          }

          .logo {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}
