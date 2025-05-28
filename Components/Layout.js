import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-4 pb-2 bg-gradient-to-br from-blue-100 to-orange-100">
        {children}
      </main>
      <Footer />
    </div>
  );
}
