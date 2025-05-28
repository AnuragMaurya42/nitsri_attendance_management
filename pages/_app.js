import "@/styles/globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* 
        main content me bottom padding itni do jitni footer ki height hai
        taaki footer ke niche content na jaye 
      */}
      <main className="flex-grow pt-4 pb-2 bg-gradient-to-br from-blue-100 to-orange-100 overflow-auto">
        <Component {...pageProps} />
      </main>
      
      {/* Footer ko fixed bottom pe rakhna */}
      <Footer />
    </div>
  );
}
