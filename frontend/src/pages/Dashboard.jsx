import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUp,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  const data = [
    { month: "Jun", waste: 12 },
    { month: "Jul", waste: 18 },
    { month: "Aug", waste: 16 },
    { month: "Sep", waste: 22 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      

      {/* Main content area */}
      <div className="flex flex-1 p-8 gap-6">
        {/* Left Sidebar with key metrics */}
        <aside className="w-64 bg-white shadow-inner p-6 space-y-4 rounded-xl h-fit">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <ArrowUp />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Waste</p>
              <h3 className="text-xl font-bold">15.2 kg</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <Clock />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Collection</p>
              <h3 className="text-xl font-bold">2 days</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <DollarSign />
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <h3 className="text-xl font-bold">$45.30</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <Calendar />
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Collection</p>
              <h3 className="text-xl font-bold">Tomorrow</h3>
            </div>
          </div>
        </aside>

        {/* Left/Main section */}
        <main className="flex-1 space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-gray-500">Today is Monday, September 3, 2025</p>
          </div>


          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold">Waste Collection Overview</h3>
                <p className="text-gray-500 text-sm">
                  Monthly waste collection data
                </p>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  3 months
                </button>
                <button className="px-3 py-1 text-gray-600 text-sm">
                  6 months
                </button>
                <button className="px-3 py-1 text-gray-600 text-sm">
                  1 year
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="waste" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>

        {/* Right Sidebar (kept for activity, actions, notifications) */}
        <aside className="w-72 bg-white shadow-inner p-6 space-y-6 rounded-xl">
          <div>
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} /> Waste collected{" "}
                <span className="text-gray-400 ml-auto">2h ago</span>
              </li>
              <li className="flex items-center gap-2 text-blue-600">
                <DollarSign size={16} /> Payment received{" "}
                <span className="text-gray-400 ml-auto">1d ago</span>
              </li>
              <li className="flex items-center gap-2 text-orange-600">
                <Calendar size={16} /> Collection scheduled{" "}
                <span className="text-gray-400 ml-auto">2d ago</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button className="bg-green-600 text-white py-2 rounded-lg">
                + Schedule Collection
              </button>
              <button className="bg-green-500 text-white py-2 rounded-lg">
                Make Payment
              </button>
              <button className="bg-green-400 text-white py-2 rounded-lg">
                View Reports
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-4 text-sm border-t bg-white">
        © 2025 EcoTrack
      </footer>
    </div>
  );
}
