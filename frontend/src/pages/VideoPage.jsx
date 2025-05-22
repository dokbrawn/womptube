import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../utils/axiosInstance";
import {
  ThumbsUp,
  MessageCircle,
  Eye,
  Loader,
  Share2,
  ThumbsDown,
} from "lucide-react";
import { motion } from "framer-motion";

function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [comment, setComment] = useState("");
  const [refresh, setRefresh] = useState(false);
  const videoRef = useRef(null);
  const [viewed, setViewed] = useState(false);

  const markVideoAsViewed = () => {
    const token = localStorage.getItem("access");
    if (token) {
      axios
        .post(
          `/videos/${id}/views/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) => {
          console.error("Ошибка при отправке просмотра:", err);
        });
    }
  };

  const handleProgress = () => {
    const videoEl = videoRef.current;
    if (
      videoEl &&
      videoEl.duration > 0 &&
      videoEl.currentTime / videoEl.duration >= 0.9 &&
      !viewed
    ) {
      setViewed(true);
      markVideoAsViewed();
    }
  };

  useEffect(() => {
    axios
      .get(`/videos/${id}/`)
      .then((res) => setVideo(res.data))
      .catch((err) => console.error("Ошибка загрузки видео:", err));

    axios
      .get(`/videos/`)
      .then((res) => setRelated(res.data.filter((v) => v.id !== parseInt(id))))
      .catch((err) => console.error("Ошибка загрузки похожих видео:", err));

    setViewed(false);
  }, [id, refresh]);

  const submitComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Вы не авторизованы.");
      return;
    }

    try {
      await axios.post(
        `/videos/${id}/comment/`,
        { content: comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComment("");
      setRefresh(!refresh);
    } catch (err) {
      console.error("Ошибка добавления комментария:", err);
      if (err.response?.status === 401) {
        alert("Вы не авторизованы.");
      } else if (err.response?.status === 415) {
        alert("Неподдерживаемый формат запроса (415). Проверь Content-Type.");
      } else {
        alert("Ошибка при добавлении комментария.");
      }
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Авторизуйтесь, чтобы поставить лайк.");
      return;
    }

    try {
      await axios.post(
        `/videos/${id}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh(!refresh);
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Вы уже поставили лайк.");
      } else {
        alert("Ошибка при попытке поставить лайк.");
      }
    }
  };

  const handleDislike = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Авторизуйтесь, чтобы поставить дизлайк.");
      return;
    }

    try {
      await axios.post(
        `/videos/${id}/dislike/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefresh(!refresh);
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Вы уже поставили дизлайк.");
      } else {
        alert("Ошибка при попытке поставить дизлайк.");
      }
    }
  };

  const handleShare = () => {
    const videoUrl = window.location.href;
    navigator.clipboard.writeText(videoUrl).then(() => {
      alert("Ссылка на видео скопирована в буфер обмена!");
    });
  };

  const formatViews = (count) => {
    if (count === 1) return "1 просмотр";
    if (count >= 2 && count <= 4) return `${count} просмотра`;
    return `${count} просмотров`;
  };

  if (!video)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row bg-[#0f0f0f] text-white px-6 pt-4 min-h-screen gap-8">
      {/* Левая часть: Видео и описание */}
      <div className="flex-1 max-w-[900px]">
        <div
          className="relative w-full rounded-lg overflow-hidden border border-gray-700 shadow-xl mb-4"
          style={{ aspectRatio: "16 / 9" }}
        >
          <video
            ref={videoRef}
            onTimeUpdate={handleProgress}
            controls
            src={video.video_file}
            className="absolute top-0 left-0 w-full h-full object-cover"
            poster={video.thumbnail}
          />
        </div>

        <h1 className="text-2xl font-bold mb-2 leading-snug">{video.title}</h1>

        <div className="flex items-center text-sm text-gray-400 gap-6 mb-4">
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{formatViews(video.views)}</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
            <ThumbsUp size={16} className="text-blue-500 hover:text-blue-600 transition" />
            <span>{video.likes_count}</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleDislike}>
            <ThumbsDown size={16} className="text-red-500 hover:text-red-600 transition" />
            <span>{video.dislikes_count}</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleShare}>
            <Share2 size={16} className="text-green-500 hover:text-green-600 transition" />
            <span>Поделиться</span>
          </div>
        </div>

        <p className="text-gray-300 mb-6 text-base leading-relaxed">
          {video.description}
        </p>

        <form onSubmit={submitComment} className="mb-6 flex gap-3">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Оставьте комментарий..."
            className="flex-1 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition font-semibold"
          >
            Отправить
          </button>
        </form>

        <div className="space-y-3">
          {video.comments.map((c) => (
            <div key={c.id} className="bg-[#1b1b1b] p-3 rounded-lg border border-gray-700">
              <span className="text-blue-400 font-semibold">{c.author.username}</span>: {c.content}
            </div>
          ))}
        </div>
      </div>

      {/* Правая колонка: Похожие видео */}
      <div className="w-full md:w-[350px]">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Похожие видео</h2>
        <div className="space-y-4">
          {related.map((v) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/video/${v.id}`}
                className="flex gap-3 bg-[#1c1c1c] hover:bg-[#222] p-2 rounded-lg border border-gray-700 transition overflow-hidden"
              >
                <div className="w-32 h-20 overflow-hidden rounded-lg">
                  <video src={v.video_file} className="w-full h-full object-cover" muted />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h3 className="text-sm font-semibold truncate">{v.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{v.description}</p>
                  <p className="text-xs text-gray-500 mt-auto">
                    👁 {formatViews(v.views)} | 👍 {v.likes_count}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
