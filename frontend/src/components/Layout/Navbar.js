import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import "../styles/main.css";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Map,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // Hide Navbar if not logged in

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/inventory", label: "Inventory", icon: <Boxes size={18} /> },
    { to: "/sales", label: "Sales", icon: <ShoppingCart size={18} /> },
    { to: "/tracking", label: "Tracking", icon: <Map size={18} /> },
  ];

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md relative">
      {/* Logo */}
      <h2 className="text-xl font-bold tracking-wide">EmTech Logistic</h2>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 hover:text-blue-400 transition ${
              location.pathname === link.to ? "text-blue-400 font-semibold" : ""
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600 transition"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <User size={18} />
            <span>{user?.name || "Profile"}</span>
            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg p-2 z-50">
              <div className="px-3 py-2 border-b">
                <p className="font-semibold">{user?.name || "User"}</p>
                <p className="text-sm text-gray-500">{user?.email || ""}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition mt-1"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 flex flex-col items-start p-4 space-y-4 md:hidden z-50">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 w-full hover:text-blue-400 transition ${
                location.pathname === link.to ? "text-blue-400 font-semibold" : ""
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {/* Mobile Profile Section */}
          <div className="w-full border-t border-gray-700 pt-3">
            <p className="text-gray-400 text-sm mb-2">
              {user?.name} <br />
              <span className="text-xs">{user?.email}</span>
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition text-sm font-medium w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
