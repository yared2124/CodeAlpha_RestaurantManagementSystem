import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Today's Orders" value={data?.totalOrdersToday || 0} />
        <Card
          title="Revenue Today"
          value={`$${data?.revenueToday?.toFixed(2) || "0.00"}`}
        />
        <Card title="Low Stock Items" value={data?.lowStockCount || 0} />
        <Card title="Available Tables" value={data?.availableTables || 0} />
      </div>

      {data?.lowStockItems?.length > 0 && (
        <div className="mt-8 bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-red-600">Low Stock Alerts</h3>
          <ul className="list-disc pl-6 mt-2">
            {data.lowStockItems.map((item) => (
              <li key={item.name}>
                {item.name}: {item.stock} (threshold {item.threshold})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
