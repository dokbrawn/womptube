import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";
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

function formatViews(count) {
  if (count === 1) return "1 просмотр";
  if (count >= 2 && count <= 4) return `${count} просмотра`;
  return `${count} просмотров`;
}

function HomePage({ searchTerm = "" }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/videos/")
      .then((res) => {
        setVideos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки видео:", err);
        setLoading(false);
      });
  }, []);

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white pt-6 pb-10">
      <div className="max-w-screen-2xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
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
          <p className="text-center text-gray-500">Ничего не найдено 😢</p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-[#1c1c1c] rounded-xl overflow-hidden shadow-md hover:shadow-blue-500/30 transition"
              >
                <Link to={`/video/${video.id}`}>
                  <div className="relative w-full h-48 overflow-hidden group">
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
                      className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
