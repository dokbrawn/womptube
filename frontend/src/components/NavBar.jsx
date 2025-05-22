import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import Fuse from "fuse.js";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

function NavBar({ username, setUsername }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allVideos, setAllVideos] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/videos/").then((res) => {
      setAllVideos(res.data);
    });
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const fuse = new Fuse(allVideos, {
      keys: ["title", "description", "author.username"],
      threshold: 0.4,
    });

    const results = fuse.search(searchTerm.trim()).slice(0, 5);
    setSuggestions(results.map((res) => res.item));
  }, [searchTerm, allVideos]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="bg-[#0f0f0f] text-white px-6 h-16 flex items-center justify-between fixed top-0 left-16 sm:left-20 right-0 z-50">
      <Link
        to="/"
        className="text-xl sm:text-2xl font-bold text-blue-500 flex items-center gap-2 hover:text-blue-400 transition"
      >
        🎬 <span className="hidden sm:inline">WOMP</span>
      </Link>

      <div className="w-1/2 max-w-xl hidden sm:block relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Поиск видео..."
            className="w-full px-4 py-2 pl-10 rounded-full bg-[#1c1c1c] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
          />
          <MagnifyingGlassIcon
            className="w-5 h-5 text-gray-400 absolute top-2.5 left-3 cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Подсказки */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full bg-[#1c1c1c] border border-[#333] rounded-xl shadow-lg max-h-64 overflow-auto">
            {suggestions.map((video) => (
              <li
                key={video.id}
                className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer"
                onClick={() => {
                  navigate(`/video/${video.id}`);
                  setShowSuggestions(false);
                  setSearchTerm("");
                }}
              >
                🎥 {video.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        {username ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-1 hover:text-blue-400 transition font-medium"
            >
              <UserCircleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{username}</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-blue-400 transition font-medium flex items-center gap-1"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Вход</span>
            </Link>
            <Link
              to="/register"
              className="hover:text-blue-400 transition font-medium hidden sm:block"
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
