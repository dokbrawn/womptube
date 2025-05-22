import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useLocation, Link } from "react-router-dom";
import Fuse from "fuse.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = useQuery().get("q") || "";
  const [allVideos, setAllVideos] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    axios
      .get("http://localhost:8000/api/videos/")
      .then((res) => {
        setAllVideos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    if (!query || allVideos.length === 0) return;

    const fuse = new Fuse(allVideos, {
      keys: ["title", "description", "author.username"],
      threshold: 0.4,
      distance: 100,
    });

    const fuzzyResults = fuse.search(query);
    setResults(fuzzyResults.map((res) => res.item));
  }, [query, allVideos]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Результаты по запросу: “{query}”
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Загрузка...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-400">Ничего не найдено.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="bg-[#1c1c1c] rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.03] hover:shadow-blue-500/30 transition duration-300 group"
            >
              <video
                src={video.video_file}
                className="w-full h-48 object-cover group-hover:brightness-110"
                muted
                preload="metadata"
              ></video>
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate group-hover:text-blue-400 transition">
                  {video.title}
                </h2>
                <p className="text-sm text-gray-400 truncate">
                  {video.description}
                </p>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
                  <span>👤 {video.author?.username}</span>
                  <span>👍 {video.likes_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;
