import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  TableCellsIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShoppingBagIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setData(res.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const stats = [
    {
      label: "Today's Orders",
      value: data?.totalOrdersToday || 0,
      icon: ClipboardDocumentListIcon,
      bg: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Revenue Today",
      value: `$${Number(data?.revenueToday || 0).toFixed(2)}`,
      icon: BanknotesIcon,
      bg: "from-green-500 to-green-600",
      textColor: "text-green-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Low Stock Items",
      value: data?.lowStockCount || 0,
      icon: CubeIcon,
      bg: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      trend: "-3",
      trendUp: false,
    },
    {
      label: "Available Tables",
      value: data?.availableTables || 0,
      icon: TableCellsIcon,
      bg: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      trend: "+2",
      trendUp: true,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with gradient welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Admin! 👋</h1>
            <p className="text-blue-100 mt-2">
              Here's what's happening with your restaurant today.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <ClockIcon className="w-5 h-5" />
            <span className="font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-transparent group"
          >
            <div className="flex items-start justify-between">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} bg-opacity-10`}
              >
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
                  stat.trendUp
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.trendUp ? (
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4" />
                )}
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts - Takes 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                ⚠️ Low Stock Alerts
              </h2>
              <p className="text-sm text-gray-500">
                Items that need immediate attention
              </p>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
              {data?.lowStockItems?.length || 0} items
            </span>
          </div>
          {data?.lowStockItems?.length > 0 ? (
            <div className="space-y-3">
              {data.lowStockItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                      <CubeIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Threshold: {item.threshold}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        style={{
                          width: `${Math.min((item.stock / item.threshold) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-orange-700 min-w-[60px] text-right">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-green-50 rounded-xl border border-green-200">
              <span className="text-5xl block mb-3">🎉</span>
              <p className="text-green-700 font-medium">
                All stock levels are healthy!
              </p>
              <p className="text-sm text-green-600 mt-1">
                No items need attention
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <QuickAction
              label="View All Orders"
              icon="📋"
              color="bg-blue-50 text-blue-600 hover:bg-blue-100"
              onClick={() => navigate("/orders")}
            />
            <QuickAction
              label="Update Menu"
              icon="🍽️"
              color="bg-green-50 text-green-600 hover:bg-green-100"
              onClick={() => navigate("/menu")}
            />
            <QuickAction
              label="Manage Inventory"
              icon="📦"
              color="bg-orange-50 text-orange-600 hover:bg-orange-100"
              onClick={() => navigate("/inventory")}
            />
            <QuickAction
              label="View Reports"
              icon="📊"
              color="bg-purple-50 text-purple-600 hover:bg-purple-100"
              onClick={() => navigate("/reports")}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📊 Today's Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <SummaryCard
              label="Total Orders"
              value={data?.totalOrdersToday || 0}
              icon={ShoppingBagIcon}
              color="bg-blue-500"
            />
            <SummaryCard
              label="Revenue"
              value={`$${Number(data?.revenueToday || 0).toFixed(2)}`}
              icon={BanknotesIcon}
              color="bg-green-500"
            />
            <SummaryCard
              label="Available Tables"
              value={data?.availableTables || 0}
              icon={TableCellsIcon}
              color="bg-purple-500"
            />
            <SummaryCard
              label="Low Stock"
              value={data?.lowStockCount || 0}
              icon={CubeIcon}
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Quick Stats with Gradient */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-lg font-bold mb-4">⚡ Quick Stats</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm opacity-90 mb-2">
                <span>Table Occupancy</span>
                <span className="font-bold">
                  {data?.availableTables
                    ? Math.round((1 - data.availableTables / 10) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full"
                  style={{
                    width: `${data?.availableTables ? Math.round((1 - data.availableTables / 10) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm opacity-90 mb-2">
                <span>Order Completion</span>
                <span className="font-bold">78%</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                  style={{ width: "78%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm opacity-90 mb-2">
                <span>Staff on Duty</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex gap-2">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Subcomponents ----------

function QuickAction({ label, icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl ${color} transition-all duration-200 transform hover:scale-[1.02]`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-4 h-4 ${color.replace("bg-", "text-")}`} />
        </div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-lg font-bold text-gray-800">{value}</div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-pulse">
      <div className="bg-gray-200 rounded-2xl h-32 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}
