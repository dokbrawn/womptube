import { useState } from "react";
import axios from "../utils/axiosInstance"; // или "axios" если не используешь axiosInstance
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/auth/register/", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      alert("Ошибка регистрации");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="pt-20 px-4"> {/* или pt-[72px], если нужен точный отступ */}
  {/* здесь твой контент */}
</div>

      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
        />
        <button
          type="submit"
          className="bg-blue-800 w-full py-2 rounded text-white"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
