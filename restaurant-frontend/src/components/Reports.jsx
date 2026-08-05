import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

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
    <section className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Sales Ledger</div>
          <h2 className="page-title">Daily Sales Report</h2>
          <p className="page-subtitle">Compare orders and revenue by service type.</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="field max-w-56"
        />
        <button onClick={fetchSales} className="btn btn-primary">
          <ArrowPathIcon className="h-5 w-5" />
          Refresh
        </button>
      </div>

      {loading ? (
        <ReportsSkeleton />
      ) : sales ? (
        <div className="panel p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Stat label="Total Orders" value={sales.totalOrders} accent="#0f766e" />
            <Stat label="Total Revenue" value={money(sales.totalRevenue)} accent="#b7791f" />
            <Stat label="Dine-in" value={money(sales.dineInRevenue)} accent="#2563eb" />
            <Stat label="Takeaway" value={money(sales.takeawayRevenue)} accent="#c2410c" />
            <Stat label="Delivery" value={money(sales.deliveryRevenue)} accent="#7c3aed" />
          </div>
        </div>
      ) : (
        <div className="panel empty-state">No data for this date.</div>
      )}
    </section>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="metric-card" style={{ "--accent": accent }}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function ReportsSkeleton() {
  return (
    <div className="panel p-5">
      <div className="skeleton-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    </div>
  );
}
