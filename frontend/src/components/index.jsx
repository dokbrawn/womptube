import React from "react";
import { ChatSection } from "./ChatSection";
import { HeaderSection } from "./HeaderSection";
import { VideoPlayerSection } from "./VideoPlayerSection";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] dark">
      {/* Header spans full width */}
      <HeaderSection />

      {/* Main content area with video player and chat */}
      <div className="flex flex-1 w-full">
        {/* Video player takes larger portion on the left */}
        <div className="flex-grow">
          <VideoPlayerSection />
        </div>

        {/* Chat section on the right */}
        <div className="w-1/3">
          <ChatSection />
        </div>
      </div>
    </div>
  );
}
