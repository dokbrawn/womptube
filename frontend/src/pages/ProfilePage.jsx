import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

function ProfilePage() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/videos/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        const user = localStorage.getItem("username");
        const userVideos = res.data.filter(
          (video) => video.author.username === user
        );
        setVideos(userVideos);
        setFilteredVideos(userVideos);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки видео:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    }, 300); // Debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, videos]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить это видео?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`/videos/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const updatedVideos = videos.filter((video) => video.id !== id);
      setVideos(updatedVideos);
      setFilteredVideos(updatedVideos);
    } catch (err) {
      alert("Ошибка при удалении видео");
      console.error(err);
    }
  };

  const formatViews = (count) => {
    if (count === 1) return "1 просмотр";
    if (count >= 2 && count <= 4) return `${count} просмотра`;
    return `${count} просмотров`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-0 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
          🎥 Мои Видео
        </h1>

        <div className="mb-6 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Поиск по названию или описанию..."
            className="w-full px-4 py-3 rounded bg-[#1e1e1e] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-[#1c1c1c] rounded-xl overflow-hidden shadow-md"
              >
                <Skeleton height={192} />
                <div className="p-4">
                  <Skeleton height={20} width="80%" />
                  <Skeleton height={16} width="60%" style={{ marginTop: 6 }} />
                  <Skeleton height={16} width="50%" style={{ marginTop: 10 }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>Нет результатов.</p>
            <Link
              to="/upload"
              className="mt-4 inline-block text-blue-500 hover:underline"
            >
              ➕ Загрузить видео
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-[#1c1c1c] rounded-xl overflow-hidden shadow-md hover:shadow-blue-500/30 transition"
              >
                <Link to={`/video/${video.id}`}>
                  <div className="relative w-full h-48 overflow-hidden">
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail}
                        alt="Thumbnail"
                        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />
                    )}
                    <video
                      src={video.video_file}
                      muted
                      preload="metadata"
                      playsInline
                      className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 hover:opacity-100"
                      onMouseOver={(e) => e.target.play()}
                      onMouseOut={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold truncate text-white hover:text-blue-400 transition">
                      {video.title}
                    </h2>
                    <p className="text-sm text-gray-400 truncate">
                      {video.description}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
                      <span>👁 {formatViews(video.views)}</span>
                      <span>👍 {video.likes_count}</span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="mt-2 bg-red-600 hover:bg-red-700 transition px-4 py-2 text-sm rounded text-white flex items-center justify-center w-full"
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Удалить
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
