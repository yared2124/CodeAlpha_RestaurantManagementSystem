import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const pageTitles = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/menu": "Menu Items",
  "/inventory": "Inventory",
  "/tables": "Tables & Reservations",
  "/reports": "Reports",
};

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const title = useMemo(() => pageTitles[location.pathname] || "Restaurant Ops", [location.pathname]);

  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">Live Service</div>
        <h1 className="m-0 text-xl font-extrabold text-stone-900">{title}</h1>
      </div>
      <label className="topbar-search">
        <MagnifyingGlassIcon className="topbar-search-icon" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders, tables, menu"
          className="topbar-search-input"
        />
      </label>
      <div className="flex items-center gap-3">
        <button className="btn btn-soft !h-10 !w-10 !p-0" title="Notifications">
          <BellIcon className="h-5 w-5" />
        </button>
        <div className="hidden text-right sm:block">
          <div className="text-sm font-bold text-stone-800">{user?.email || "Admin"}</div>
          <div className="text-xs text-stone-500">Manager access</div>
        </div>
      </div>
    </header>
  );
}
