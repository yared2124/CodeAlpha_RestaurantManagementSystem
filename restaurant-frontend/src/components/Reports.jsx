import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

export default function Reports() {
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reports/daily-sales?date=${date}`);
      setSales(res.data.data);
    } catch (err) {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [date]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📊 Sales Report</h1>
            <p className="text-emerald-100 mt-2">
              View daily revenue breakdown by order type.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <CalendarDaysIcon className="w-5 h-5" />
            <span className="font-medium">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={fetchSales}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <ArrowPathIcon
            className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
        {sales && (
          <span className="text-sm text-gray-500 ml-auto">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Stats Cards */}
      {loading ? (
        <ReportsSkeleton />
      ) : sales ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            label="Total Orders"
            value={sales.totalOrders}
            icon={ShoppingBagIcon}
            bg="from-cyan-500 to-cyan-600"
            textColor="text-cyan-600"
          />
          <StatCard
            label="Total Revenue"
            value={money(sales.totalRevenue)}
            icon={CurrencyDollarIcon}
            bg="from-amber-500 to-amber-600"
            textColor="text-amber-600"
          />
          <StatCard
            label="Dine-in"
            value={money(sales.dineInRevenue)}
            icon={HomeModernIcon}
            bg="from-blue-500 to-blue-600"
            textColor="text-blue-600"
          />
          <StatCard
            label="Takeaway"
            value={money(sales.takeawayRevenue)}
            icon={BuildingStorefrontIcon}
            bg="from-orange-500 to-orange-600"
            textColor="text-orange-600"
          />
          <StatCard
            label="Delivery"
            value={money(sales.deliveryRevenue)}
            icon={TruckIcon}
            bg="from-purple-500 to-purple-600"
            textColor="text-purple-600"
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <span className="text-6xl block mb-4">📭</span>
          <h3 className="text-xl font-semibold text-gray-800">
            No data for this date
          </h3>
          <p className="text-gray-500 mt-2">
            Try selecting a different date or place some orders.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------- Subcomponents ----------

function StatCard({ label, value, icon: Icon, bg, textColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-transparent">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${bg} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
        </div>
      </div>
    </div>
  );
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

// ---------- Skeleton Loading ----------
function ReportsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-24"
        />
      ))}
    </div>
  );
}
