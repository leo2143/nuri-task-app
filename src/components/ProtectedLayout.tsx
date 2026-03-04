import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OfflineBanner from "./OfflineBanner";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <OfflineBanner />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 mt-28 pb-28">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
