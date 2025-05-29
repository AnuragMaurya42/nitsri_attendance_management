import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />

      {/* Scrollable main content with padding to avoid overlap */}
      <div
        className="pt-14 pb-6 bg-gradient-to-br from-blue-100 to-orange-100 overflow-y-auto"
        style={{ minHeight: "100vh" }}
      >
        <Component {...pageProps} />
      </div>

      <Footer />
    </>
  );
}
