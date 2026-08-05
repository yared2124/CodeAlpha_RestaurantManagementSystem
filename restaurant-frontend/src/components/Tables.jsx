import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const tableStatusClass = (status) => {
  if (status === "available") return "status-good";
  if (status === "occupied") return "status-bad";
  return "status-warn";
};

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

  if (loading) return <TablesSkeleton />;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Dining Room</div>
          <h2 className="page-title">Tables & Reservations</h2>
          <p className="page-subtitle">Capacity, occupancy, and upcoming booking details.</p>
        </div>
      </div>

      <div className="tables-summary mb-5">
        <SummaryTile label="Total tables" value={tables.length} />
        <SummaryTile
          label="Available"
          value={tables.filter((table) => table.status === "available").length}
        />
        <SummaryTile
          label="Occupied"
          value={tables.filter((table) => table.status === "occupied").length}
        />
        <SummaryTile label="Reservations" value={reservations.length} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel table-zone p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="m-0 text-lg font-extrabold text-stone-900">Tables</h3>
              <p className="mt-1 text-sm text-stone-500">Floor availability and party capacity.</p>
            </div>
            <span className="status-chip status-info">{tables.length} total</span>
          </div>
          <div className="table-card-grid">
            {tables.length === 0 ? (
              <div className="empty-state sm:col-span-2">No tables found.</div>
            ) : (
              tables.map((table) => (
                <div key={table.id} className={`dining-table-card ${table.status}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="table-number">Table {table.tableNumber}</div>
                      <div className="mt-3 flex items-center gap-2 text-sm font-bold text-stone-600">
                        <UserGroupIcon className="tables-mini-icon" />
                        {table.capacity} seats
                      </div>
                    </div>
                    <span className={`status-chip ${tableStatusClass(table.status)}`}>
                      {table.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel reservations-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="m-0 text-lg font-extrabold text-stone-900">Reservations</h3>
              <p className="mt-1 text-sm text-stone-500">Upcoming guests and assigned tables.</p>
            </div>
            <span className="status-chip status-warn">{reservations.length}</span>
          </div>
          <div className="space-y-3">
            {reservations.map((res) => (
              <div key={res.id} className="reservation-card">
                <div className="reservation-avatar">{res.customerName?.slice(0, 1) || "G"}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="truncate font-extrabold text-stone-900">{res.customerName}</div>
                    <span className="status-chip status-info">{res.partySize} guests</span>
                  </div>
                  <div className="reservation-meta">
                    <span>
                      <CalendarDaysIcon className="tables-mini-icon" />
                      Table {tables.find((t) => t.id === res.tableId)?.tableNumber || "?"}
                    </span>
                    <span>
                      <ClockIcon className="tables-mini-icon" />
                      {new Date(res.reservationTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {reservations.length === 0 && <div className="empty-state">No reservations found.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div className="summary-tile">
      <div className="text-sm font-bold text-stone-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-stone-900">{value}</div>
    </div>
  );
}

function TablesSkeleton() {
  return (
    <section className="page">
      <div className="mb-5 max-w-md space-y-3">
        <div className="skeleton-line w-24" />
        <div className="skeleton-line w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton-card min-h-28" />
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton-card min-h-20" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
