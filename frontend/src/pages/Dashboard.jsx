import React from "react";
import { dashboardChartData, dashboardStats, recentActivity } from "../data/dashboardData";
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
  const data = dashboardChartData;

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
                <h3 className="text-xl font-bold">{dashboardStats.totalWaste}</h3>
              </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <Clock />
            </div>
              <div>
                <p className="text-sm text-gray-500">Last Collection</p>
                <h3 className="text-xl font-bold">{dashboardStats.lastCollection}</h3>
              </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <DollarSign />
            </div>
              <div>
                <p className="text-sm text-gray-500">Balance</p>
                <h3 className="text-xl font-bold">{dashboardStats.balance}</h3>
              </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <Calendar />
            </div>
              <div>
                <p className="text-sm text-gray-500">Next Collection</p>
                <h3 className="text-xl font-bold">{dashboardStats.nextCollection}</h3>
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
              {recentActivity.map((a, i) => (
                <li key={i} className={`flex items-center gap-2 ${a.type === "success" ? "text-green-600" : a.type === "payment" ? "text-blue-600" : "text-orange-600"}`}>
                  {a.type === "success" ? <CheckCircle size={16} /> : a.type === "payment" ? <DollarSign size={16} /> : <Calendar size={16} />}
                  {a.label}
                  <span className="text-gray-400 ml-auto">{a.time}</span>
                </li>
              ))}
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
