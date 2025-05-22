import { Link, useLocation } from "react-router-dom";
import { HomeIcon, ArrowUpTrayIcon, UserIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Главная", icon: <HomeIcon className="w-6 h-6" /> },
    { path: "/upload", label: "Загрузка", icon: <ArrowUpTrayIcon className="w-6 h-6" /> },
    { path: "/profile", label: "Профиль", icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-16 sm:w-20 bg-black/30 backdrop-blur-lg shadow-inner text-white flex flex-col items-center py-4 fixed left-0 top-0 z-50"
    >
      <div className="flex flex-col gap-6">
        {navItems.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            title={label}
            className={`p-2 rounded-md flex justify-center transition-all ${
              location.pathname === path
                ? "bg-blue-700"
                : "hover:bg-blue-600/60"
            }`}
          >
            {icon}
          </Link>
        ))}
      </div>
    </motion.aside>
  );
}

export default Sidebar;
