import { useState } from "react";
import axios from "../utils/axiosInstance"; // или "axios" если не используешь axiosInstance
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8000/api/auth/login/", {
      username,
      password,
    });

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    localStorage.setItem("username", username);

    navigate("/"); // сначала перенаправляем

    // затем даём React-роутеру обновить URL, и после этого обновляем страницу
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    alert("Ошибка входа. Проверьте логин и пароль.");
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f0f0f] text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6">Вход</h2>

        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded bg-[#2a2a2a] text-white"
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 rounded bg-[#2a2a2a] text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Войти
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
