import { useState } from "react";
import axios from "../utils/axiosInstance"; // или просто "axios"
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video_file", file);

    try {
      await axios.post("http://localhost:8000/api/videos/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (err) {
      alert("Ошибка загрузки");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-20 flex justify-center items-start">
      <div className="bg-[#1a1a1a] rounded-xl p-8 w-full max-w-xl shadow-xl border border-gray-800">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          📤 Загрузить Видео
        </h1>
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Название</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white outline-none focus:ring-2 ring-blue-500"
              placeholder="Введите название видео"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white resize-none outline-none focus:ring-2 ring-blue-500"
              placeholder="Краткое описание вашего видео..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Выберите видеофайл</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-green-400 text-sm">
                ✅ Вы выбрали: {file.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded font-semibold"
          >
            🚀 Загрузить
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;
