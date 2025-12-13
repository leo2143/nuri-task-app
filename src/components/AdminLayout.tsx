import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <AdminNavbar />

      <main className="flex-1 container mx-auto px-4 py-8 mt-28 pb-28">
        <Outlet />
      </main>

      <AdminFooter />
    </div>
  );
}
