import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import React from "react";

export default function ChatSection() {
  // Chat messages data
  const messages = [
    {
      id: 1,
      author: "Женя",
      text: "Всем привет",
      likes: 567,
      liked: true,
    },
    {
      id: 2,
      author: "Женя",
      text: "Какое-то сообщение длиннее, чем 1 строка.",
      likes: 11,
      liked: false,
    },
    {
      id: 3,
      author: "Женя",
      text: "Всем привет",
      likes: 42,
      liked: false,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Tabs navigation */}
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="w-full h-12 bg-transparent">
          <TabsTrigger
            value="chat"
            className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[#808080] relative [font-family:'Inter-SemiBold',Helvetica] font-semibold text-sm"
          >
            Чат
            <div className="absolute w-10 h-0.5 bottom-0 left-1/2 -translate-x-1/2 bg-blue-800 data-[state=inactive]:hidden" />
          </TabsTrigger>
          <TabsTrigger
            value="qa"
            className="flex-1 h-12 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[#808080] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-sm"
          >
            Вопрос / ответ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex flex-col flex-1 m-0">
          {/* Messages container */}
          <div className="flex flex-col items-start gap-3 p-4 flex-1 overflow-y-auto">
            {messages.map((message) => (
              <Card
                key={message.id}
                className="w-full bg-[#222222] border-none"
              >
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-center gap-2 w-full">
                    <div className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#aaaaaa] text-sm">
                      {message.author}
                    </div>
                  </div>

                  <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-base leading-[19.2px]">
                    {message.text}
                  </div>

                  <div className="flex items-center justify-end gap-2 w-full">
                    <div className="inline-flex items-center justify-center gap-1">
                      <Heart
                        className={`w-4 h-4 ${message.liked ? "fill-current text-white" : "text-[#aaaaaa]"}`}
                      />
                      <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#aaaaaa] text-sm">
                        {message.likes}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Input area */}
          <div className="flex-col h-[120px] items-start gap-3 p-4 flex w-full">
            <Input
              placeholder="Текст"
              className="h-12 px-4 py-0 bg-[#2a2a2a] text-[#808080] [font-family:'Inter-Regular',Helvetica] font-normal text-sm border-none"
            />

            <div className="flex items-center gap-2 w-full">
              <div className="inline-flex items-center gap-2">
                <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#aaaaaa] text-xs">
                  Имя в чате:
                </div>
                <div className="[font-family:'Inter-Medium',Helvetica] font-medium text-white text-xs">
                  Нина
                </div>
                <div className="inline-flex items-center justify-end">
                  <div className="[font-family:'Inter-Medium',Helvetica] font-medium text-blue-800 text-xs cursor-pointer">
                    Ред.
                  </div>
                </div>
              </div>

              <div className="flex-1" />

              <Button className="w-[100px] h-9 bg-blue-800 rounded-[18px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm">
                Отправить
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="qa">
          {/* Content for Q&A tab would go here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
