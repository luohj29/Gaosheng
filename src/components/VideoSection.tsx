"use client";
import { useState } from "react";

const videos = [
  {
    id: 1,
    title: "公司介绍",
    url: "https://www.youtube.com/embed/abcdEFGH123",
  },
  {
    id: 2,
    title: "产品信息",
    url: "https://www.youtube.com/embed/ijklMNOP456",
  },
  {
    id: 3,
    title: "行业标准",
    url: "https://www.youtube.com/embed/qrstUVWX789",
  },
];

export default function VideoPlayer() {
  const [current, setCurrent] = useState(videos[0]);

  return (
    <div className="w-full h-[600px] flex border rounded-xl overflow-hidden shadow-lg bg-white">
      {/* 左侧 3/4 播放器 */}
      <div className="w-3/4 h-full bg-black">
        <iframe
          className="w-full h-full"
          src={current.url}
          title={current.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* 右侧 1/4 列表 */}
      <div className="w-1/4 h-full p-4 flex flex-col gap-4 border-l bg-gray-50">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">视频列表</h2>

        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => setCurrent(v)}
            className={`w-full text-left px-3 py-2 rounded-lg transition 
              ${
                current.id === v.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white hover:bg-gray-200"
              }`}
          >
            {v.title}
          </button>
        ))}
      </div>
    </div>
  );
}
