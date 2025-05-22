import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";

function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [comment, setComment] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get(`/videos/${id}/`)
      .then((res) => setVideo(res.data))
      .catch((err) => console.error("Ошибка загрузки видео:", err));

    axios
      .get(`/videos/`)
      .then((res) => setRelated(res.data.filter((v) => v.id !== parseInt(id))))
      .catch((err) => console.error("Ошибка загрузки похожих видео:", err));

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
        .catch(() => {});
    }
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

  const formatViews = (count) => {
    if (count === 1) return "1 просмотр";
    if (count >= 2 && count <= 4) return `${count} просмотра`;
    return `${count} просмотров`;
  };

  if (!video) return <div className="text-white p-6">Загрузка...</div>;

  return (
    <div className="flex flex-col md:flex-row bg-[#0f0f0f] text-white px-6 pt-4 min-h-screen gap-8">
      {/* Левая часть: Видео и описание */}
      <div className="flex-1 max-w-[900px]">
        <div className="relative w-full rounded-lg overflow-hidden border border-gray-700 shadow-xl mb-4" style={{ aspectRatio: '16 / 9' }}>
          <video
            controls
            src={video.video_file}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold mb-2 leading-snug">{video.title}</h1>

        <div className="flex items-center text-sm text-gray-400 gap-6 mb-4">
          <span>👁 {formatViews(video.views)}</span>
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
            <HandThumbUpIcon className="w-5 h-5 text-blue-500 hover:text-blue-600 transition" />
            <span>{video.likes_count}</span>
          </div>
        </div>

        <p className="text-gray-300 mb-6 text-base leading-relaxed">{video.description}</p>

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
            <Link
              key={v.id}
              to={`/video/${v.id}`}
              className="flex gap-3 bg-[#1c1c1c] hover:bg-[#222] p-2 rounded-lg border border-gray-700 transition overflow-hidden"
            >
              <div className="w-32 h-20 overflow-hidden rounded-lg">
                <video
                  src={v.video_file}
                  className="w-full h-full object-cover"
                  muted
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-sm font-semibold truncate">{v.title}</h3>
                <p className="text-xs text-gray-400 truncate">{v.description}</p>
                <p className="text-xs text-gray-500 mt-auto">👁 {formatViews(v.views)} | 👍 {v.likes_count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
