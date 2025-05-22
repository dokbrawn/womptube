import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize, Play, PlaySquare, Settings, Volume2 } from "lucide-react";
import React from "react";

export default function VideoPlayerSection() {
  // Video metadata
  const videoData = {
    title: "Название видео",
    views: "1.2K просмотров",
    publishDate: "Опубликовано: 12.05.2023",
    currentTime: "12:34",
    totalDuration: "45:00",
    channel: {
      name: "Женя",
      subscribers: "10.5K подписчиков",
      initial: "Ж",
    },
    description:
      "Какое-то сообщение длиннее, чем 1 строка. Это демонстрирует как выглядит многострочный текст в описании видео. Здесь может быть размещена дополнительная информация о видео.",
  };

  return (
    <div className="flex flex-col w-full items-start">
      {/* Video Player */}
      <div className="flex flex-col h-[480px] items-center justify-center relative w-full bg-black">
        {/* Play Button Overlay */}
        <Button
          variant="outline"
          size="icon"
          className="w-20 h-20 rounded-full bg-blue-800 bg-opacity-90 border-none"
        >
          <Play className="w-8 h-8 text-white" />
        </Button>

        {/* Video Controls */}
        <div className="flex flex-col w-full h-12 items-start justify-end gap-2 px-2 py-4 absolute bottom-0 left-0 bg-gradient-to-r from-transparent to-black">
          {/* Progress Bar */}
          <div className="flex flex-col h-1 items-start relative self-stretch w-full mt-[-20px] bg-[#333333] rounded-sm">
            <div className="relative w-[30%] h-1 bg-blue-800 rounded-sm" />
          </div>

          {/* Control Buttons */}
          <div className="flex h-6 items-center gap-4 relative self-stretch w-full mt-[-8px]">
            <div className="flex h-6 items-center gap-4">
              <PlaySquare className="w-6 h-6 text-white" />
              <span className="text-white text-sm">
                {videoData.currentTime} / {videoData.totalDuration}
              </span>
            </div>

            <div className="flex-1" />

            <div className="flex h-6 items-center justify-end gap-4">
              <Volume2 className="w-6 h-6 text-white" />
              <Settings className="w-6 h-6 text-white" />
              <Maximize className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Information */}
      <Card className="w-full border-none bg-transparent">
        <CardContent className="flex flex-col items-start gap-4 p-6">
          {/* Video Title */}
          <h2 className="self-stretch font-bold text-white text-2xl leading-[28.8px]">
            {videoData.title}
          </h2>

          {/* Video Stats */}
          <div className="flex items-center gap-4 self-stretch w-full">
            <span className="text-[#aaaaaa] text-sm">{videoData.views}</span>
            <span className="text-[#aaaaaa] text-sm">
              {videoData.publishDate}
            </span>
          </div>

          {/* Channel Information */}
          <div className="flex items-center gap-4 self-stretch w-full">
            <Avatar className="w-10 h-10 bg-[#2a2a2a]">
              <AvatarFallback className="font-semibold text-white text-base">
                {videoData.channel.initial}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start justify-center gap-1">
              <span className="font-semibold text-white text-base">
                {videoData.channel.name}
              </span>
              <span className="text-[#aaaaaa] text-sm">
                {videoData.channel.subscribers}
              </span>
            </div>

            <div className="flex-1" />

            <Button className="w-[120px] h-10 bg-blue-800 rounded-[20px] hover:bg-blue-700">
              Подписаться
            </Button>
          </div>

          {/* Description */}
          <div className="flex flex-col items-start gap-2 self-stretch w-full">
            <h3 className="font-semibold text-white text-base leading-[19.2px]">
              Описание
            </h3>
            <p className="text-[#aaaaaa] text-sm leading-[16.8px]">
              {videoData.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
