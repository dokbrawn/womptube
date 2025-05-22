import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import VideoPage from "./pages/VideoPage";
import ProfilePage from "./pages/ProfilePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar — фиксированный слева */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 pl-16 sm:pl-20">
        {/* Навбар — фиксирован сверху */}
        <NavBar username={username} setUsername={setUsername} />

        {/* Контент — отступ сверху на высоту навбара */}
        <main className="pt-20 px-4 sm:px-6 lg:px-10 w-full min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
