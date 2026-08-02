import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tablesRes, reservationsRes] = await Promise.all([
        api.get("/tables"),
        api.get("/tables/reservations"),
      ]);
      setTables(tablesRes.data.data);
      setReservations(reservationsRes.data.data);
    } catch (err) {
      toast.error("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center py-10">Loading tables...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tables & Reservations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tables */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-4">Tables</h3>
          <ul className="space-y-2">
            {tables.map((table) => (
              <li key={table.id} className="flex justify-between border-b pb-2">
                <span>
                  Table {table.tableNumber} (cap. {table.capacity})
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    table.status === "available"
                      ? "bg-green-100 text-green-800"
                      : table.status === "occupied"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {table.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reservations */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold text-lg mb-4">Reservations</h3>
          <ul className="space-y-2">
            {reservations.map((res) => (
              <li key={res.id} className="border-b pb-2">
                <div className="flex justify-between">
                  <span>{res.customerName}</span>
                  <span className="text-sm">{res.partySize} guests</span>
                </div>
                <div className="text-sm text-gray-500">
                  Table{" "}
                  {tables.find((t) => t.id === res.tableId)?.tableNumber || "?"}{" "}
                  • {new Date(res.reservationTime).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
