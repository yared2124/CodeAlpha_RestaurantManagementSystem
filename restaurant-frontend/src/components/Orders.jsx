import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const statusOptions = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "served",
  "completed",
  "cancelled",
];

const statusClass = (status) => {
  if (status === "completed" || status === "served") return "status-good";
  if (status === "cancelled") return "status-bad";
  if (status === "ready" || status === "confirmed") return "status-info";
  return "status-warn";
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <TableSkeleton title="Loading orders..." />;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Kitchen Flow</div>
          <h2 className="page-title">Orders</h2>
          <p className="page-subtitle">Track tickets and move each order through service.</p>
        </div>
        <span className="status-chip status-info">{orders.length} orders</span>
      </div>

      <div className="panel">
        {orders.length === 0 ? (
          <div className="table-empty">No orders are waiting right now.</div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-bold">#{order.id.slice(0, 8)}</td>
                    <td>${Number(order.totalAmount || 0).toFixed(2)}</td>
                    <td className="capitalize">{order.orderType}</td>
                    <td>
                      <span className={`status-chip ${statusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="field max-w-44"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function TableSkeleton({ title }) {
  return (
    <section className="page">
      <div className="mb-5 max-w-md space-y-3">
        <div className="skeleton-line w-24" />
        <div className="skeleton-line w-64" />
      </div>
      <div className="panel p-5">
        <div className="mb-4 text-sm font-bold text-stone-500">{title}</div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-3">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
