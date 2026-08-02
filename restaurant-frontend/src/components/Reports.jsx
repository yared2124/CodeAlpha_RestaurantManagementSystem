import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Reports() {
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchSales = async () => {
    try {
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
    <div>
      <h2 className="text-2xl font-bold mb-6">Daily Sales Report</h2>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={fetchSales}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : sales ? (
        <div className="bg-white rounded shadow p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Total Orders" value={sales.totalOrders} />
            <Stat label="Total Revenue" value={`$${sales.totalRevenue}`} />
            <Stat label="Dine‑in" value={`$${sales.dineInRevenue}`} />
            <Stat label="Takeaway" value={`$${sales.takeawayRevenue}`} />
            <Stat label="Delivery" value={`$${sales.deliveryRevenue}`} />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded">No data for this date</div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
