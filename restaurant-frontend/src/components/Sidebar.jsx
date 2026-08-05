import { NavLink } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  TableCellsIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Orders", href: "/orders", icon: ShoppingBagIcon },
  { name: "Menu", href: "/menu", icon: ClipboardDocumentListIcon },
  { name: "Inventory", href: "/inventory", icon: CubeIcon },
  { name: "Tables", href: "/tables", icon: TableCellsIcon },
  { name: "Reports", href: "/reports", icon: ChartBarIcon },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="flex items-center gap-3">
          <div className="brand-mark">R</div>
          <div>
            <div className="text-lg font-extrabold leading-tight">Restaurant</div>
            <div className="text-xs font-semibold text-slate-400">Operations</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon className="sidebar-icon" />
            <span className="font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <button onClick={logout} className="sidebar-logout">
          <ArrowRightOnRectangleIcon className="sidebar-icon" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
