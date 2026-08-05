import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

const cards = [
  {
    key: "totalOrdersToday",
    title: "Today's Orders",
    accent: "#0f766e",
    icon: ClipboardDocumentListIcon,
    note: "Tickets opened",
  },
  {
    key: "revenueToday",
    title: "Revenue Today",
    accent: "#b7791f",
    money: true,
    icon: BanknotesIcon,
    note: "Gross sales",
  },
  {
    key: "lowStockCount",
    title: "Low Stock Items",
    accent: "#c2410c",
    icon: CubeIcon,
    note: "Need attention",
  },
  {
    key: "availableTables",
    title: "Available Tables",
    accent: "#2563eb",
    icon: TableCellsIcon,
    note: "Ready to seat",
  },
];

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

  const summary = useMemo(() => {
    const orders = Number(data?.totalOrdersToday || 0);
    const availableTables = Number(data?.availableTables || 0);
    const lowStock = Number(data?.lowStockCount || 0);

    return {
      kitchenLoad: Math.min(100, Math.max(12, orders * 8)),
      tableReadiness: Math.min(100, Math.max(8, availableTables * 12)),
      stockHealth: Math.max(8, 100 - lowStock * 18),
    };
  }, [data]);

  if (loading) return <DashboardSkeleton />;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Operations Overview</div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Monitor today&apos;s service, sales, stock, and table readiness.</p>
        </div>
        <span className="status-chip status-info">Live</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard
            key={card.key}
            title={card.title}
            accent={card.accent}
            icon={card.icon}
            note={card.note}
            value={
              card.money
                ? `$${Number(data?.[card.key] || 0).toFixed(2)}`
                : data?.[card.key] || 0
            }
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5">
          <div className="panel-header">
            <div>
              <h3 className="m-0 text-lg font-extrabold text-stone-900">Service Status</h3>
              <p className="mt-1 text-sm text-stone-500">Quick operational health for the current shift.</p>
            </div>
          </div>

          <div className="space-y-5">
            <ProgressRow label="Kitchen load" value={summary.kitchenLoad} detail={`${data?.totalOrdersToday || 0} orders today`} />
            <ProgressRow label="Table readiness" value={summary.tableReadiness} detail={`${data?.availableTables || 0} tables open`} />
            <ProgressRow label="Stock health" value={summary.stockHealth} detail={`${data?.lowStockCount || 0} low stock alerts`} />
          </div>
        </div>

        <div className="panel p-5">
          <div className="panel-header">
            <div>
              <h3 className="m-0 text-lg font-extrabold text-stone-900">Shift Snapshot</h3>
              <p className="mt-1 text-sm text-stone-500">Numbers managers need at a glance.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <MiniStat label="Order flow" value={`${data?.totalOrdersToday || 0} tickets`} />
            <MiniStat label="Revenue pace" value={`$${Number(data?.revenueToday || 0).toFixed(2)}`} />
            <MiniStat label="Table room" value={`${data?.availableTables || 0} open`} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-5">
          <div className="panel-header">
            <div>
              <h3 className="m-0 text-lg font-extrabold text-stone-900">Low Stock Alerts</h3>
              <p className="mt-1 text-sm text-stone-500">Items that may slow prep if not restocked.</p>
            </div>
            <span className="status-chip status-warn">{data?.lowStockItems?.length || 0}</span>
          </div>
          {data?.lowStockItems?.length > 0 ? (
            <ul className="m-0 space-y-3 p-0">
              {data.lowStockItems.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50 px-3 py-2"
                >
                  <span className="font-bold text-stone-800">{item.name}</span>
                  <span className="text-sm font-semibold text-orange-800">
                    {item.stock} / {item.threshold}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state min-h-24">Inventory looks healthy.</div>
          )}
        </div>

        <div className="panel p-5">
          <div className="panel-header">
            <div>
              <h3 className="m-0 text-lg font-extrabold text-stone-900">Manager Checklist</h3>
              <p className="mt-1 text-sm text-stone-500">Daily checks for smooth service.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ChecklistItem title="Confirm table turnover" status="Ready" />
            <ChecklistItem title="Review low-stock items" status={data?.lowStockCount > 0 ? "Action" : "Ready"} />
            <ChecklistItem title="Check open orders" status={data?.totalOrdersToday > 0 ? "Active" : "Quiet"} />
            <ChecklistItem title="Close daily report" status="Pending" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ title, value, accent, icon: Icon, note }) {
  return (
    <div className="metric-card" style={{ "--accent": accent }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="metric-label">{title}</div>
          <div className="metric-value">{value}</div>
          <div className="mt-1 text-xs font-bold text-stone-500">{note}</div>
        </div>
        <div className="dashboard-icon" style={{ color: accent }}>
          <Icon />
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, detail }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <div className="font-extrabold text-stone-900">{label}</div>
          <div className="text-sm text-stone-500">{detail}</div>
        </div>
        <span className="text-sm font-black text-stone-800">{value}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg bg-stone-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</div>
      <div className="mt-2 text-lg font-extrabold text-stone-900">{value}</div>
    </div>
  );
}

function ChecklistItem({ title, status }) {
  const className =
    status === "Ready"
      ? "status-good"
      : status === "Action"
        ? "status-bad"
        : status === "Active"
          ? "status-info"
          : "status-warn";

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="font-extrabold text-stone-900">{title}</div>
      <span className={`status-chip mt-3 ${className}`}>{status}</span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <section className="page">
      <div className="mb-5 max-w-md space-y-3">
        <div className="skeleton-line w-24" />
        <div className="skeleton-line w-64" />
      </div>
      <div className="skeleton-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="skeleton-card min-h-72" />
        <div className="skeleton-card min-h-72" />
      </div>
    </section>
  );
}
