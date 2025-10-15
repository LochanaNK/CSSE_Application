import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center ">
      {/* 🌿 Logo */}
      <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
        ♻️ WasteTrack Pro
      </h1>

      {/* 🔗 Navigation Links */}
      <div className="flex gap-6">
        <Link
          to="/dashboard"
          className={`font-medium pb-1 ${
            location.pathname === "/dashboard" 
              ? "text-green-700 border-b-2 border-green-600" 
              : "text-gray-700 hover:text-green-600"
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/waste-history"
          className={`font-medium pb-1 ${
            location.pathname === "/waste-history" 
              ? "text-green-700 border-b-2 border-green-600" 
              : "text-gray-700 hover:text-green-600"
          }`}
        >
          Waste History
        </Link>
        <Link
          to="/collections"
          className={`font-medium pb-1 ${
            location.pathname === "/collections" 
              ? "text-green-700 border-b-2 border-green-600" 
              : "text-gray-700 hover:text-green-600"
          }`}
        >
          Collections
        </Link>
        <Link
          to="/payments"
          className={`font-medium pb-1 ${
            location.pathname === "/payments" 
              ? "text-green-700 border-b-2 border-green-600" 
              : "text-gray-700 hover:text-green-600"
          }`}
        >
          Payments
        </Link>
        <Link
          to="/settings"
          className={`font-medium pb-1 ${
            location.pathname === "/settings" 
              ? "text-green-700 border-b-2 border-green-600" 
              : "text-gray-700 hover:text-green-600"
          }`}
        >
          Settings
        </Link>
      </div>

      {/* 👤 User Info */}
      <div className="flex items-center gap-3">
        <span className="text-gray-500 text-sm">Hi, Sathush</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="rounded-full w-10 h-10 border border-gray-300"
        />
      </div>
    </nav>
  );
}
