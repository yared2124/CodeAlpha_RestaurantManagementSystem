import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  TableCellsIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Orders", href: "/orders", icon: ShoppingBagIcon },
  { name: "Menu", href: "/menu", icon: ClipboardDocumentListIcon },
  { name: "Inventory", href: "/inventory", icon: CubeIcon },
  { name: "Tables", href: "/tables", icon: TableCellsIcon },
  { name: "Reports", href: "/reports", icon: ChartBarIcon },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Restaurant
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
