import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UserNav from "../components/navs/UserNavbar";
import GuestNav from "../components/navs/GuestNavbar";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import ScrollToTop from "../components/shared/ScrollToTop";

function Layout() {
  const { user } = useAuth();

  useEffect(() => {
    const showToast = sessionStorage.getItem("showLoginToast");
    const showLogoutToast = sessionStorage.getItem("showLogoutToast");
    if (showToast) {
      toast.success("Login Successful!");
      sessionStorage.removeItem("showLoginToast");
    }
    if (showLogoutToast) {
      toast.success("Logout Successful!");
      sessionStorage.removeItem("showLogoutToast");
    }
  }, [user]);

  return (
    <>
      <ScrollToTop />
      {user?.role === "user" ? <UserNav /> : <GuestNav />}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;