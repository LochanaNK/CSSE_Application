import { Link } from "react-router-dom";

export default function Navbar() {
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
          className="text-green-700 font-medium border-b-2 border-green-600 pb-1"
        >
          Dashboard
        </Link>
        <Link
          to="/waste-history"
          className="text-gray-700 hover:text-green-600 font-medium"
        >
          Waste History
        </Link>
        <Link
          to="/collections"
          className="text-gray-700 hover:text-green-600 font-medium"
        >
          Collections
        </Link>
        <Link
          to="/payments"
          className="text-gray-700 hover:text-green-600 font-medium"
        >
          Payments
        </Link>
        <Link
          to="/settings"
          className="text-gray-700 hover:text-green-600 font-medium"
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
