'use client';

import { useState } from 'react';

type VideoItem = {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
};

type Props = {
  videos: VideoItem[];
};

export default function CompanyVideoPlayer({ videos }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = videos[currentIndex];

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-[450px] flex border border-black/10 rounded-3xl overflow-hidden shadow-[0_15px_45px_-35px_rgba(0,0,0,0.7)] bg-white">
      {/* 左侧 3/5 视频播放器 */}
      <div className="w-3/5 h-full bg-black">
        <iframe
          className="w-full h-full"
          src={currentVideo.embedUrl}
          title={currentVideo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 中间 1/5 信息栏 */}
      <div className="w-1/5 h-full p-6 flex flex-col border-l border-black/10 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {currentVideo.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1">
          {currentVideo.description}
        </p>
      </div>

      {/* 右侧 1/5 切换按钮列表 */}
      <div className="w-1/5 h-full p-4 flex flex-col gap-3 border-l border-black/10 bg-gray-50">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => setCurrentIndex(index)}
            className={`flex-1 w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-xs flex items-center
        ${currentIndex === index
                ? 'bg-[#00919E] text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-900 border border-black/10'
              }`}
          >
            <span className="font-medium">{video.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

