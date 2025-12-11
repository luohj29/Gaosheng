"use client";

import { useState } from "react";

type ContactItem = {
  id: string;
  icon: string;
  label: string;
  value: string;
  useImage?: boolean; // 如果为 true，则使用图片显示，value 为图片路径
};

const CONTACTS: ContactItem[] = [
  { id: "wechat", icon: "/icon/wechat.webp", label: "WeChat", value: "/contact/wechat.webp", useImage: true },
  { id: "phone", icon: "/icon/tel.webp", label: "Phone", value: "00852-53008243 \n+86-13702827856" },
  { id: "whatsapp", icon: "/icon/whatsapp.webp", label: "WhatsApp", value: "/contact/whatsapp.webp", useImage: true },
  { id: "email", icon: "/icon/email.webp", label: "Email", value: "officefurniture1@gaoshenghk.com" }
];

export default function ContactInfo() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <div
      className="
        fixed right-4 top-1/3 
        flex flex-col items-end gap-3 
        z-50
      "
    >
      {CONTACTS.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setClicked(clicked === item.id ? null : item.id)}
        >
          {/* 图标按钮（always shown） */}
          <div
            className="
              w-12 h-12 rounded-full 
              flex items-center justify-center cursor-pointer
              shadow-md  transition
            "
          >
            <img
              src={item.icon}
              alt={item.label}
              className="w-6 h-6 object-contain"
            />
          </div>

          {/* hover 展开显示的信息条 */}
          <div
            className={`
              absolute right-14 top-1/2 -translate-y-1/2 
              px-3 py-2 rounded bg-white shadow-lg border
              transition-all duration-200 ease-out origin-right
              ${item.useImage ? 'min-w-[200px] max-w-[300px]' : 'min-w-[160px] max-w-[240px]'}
              ${hovered === item.id || clicked === item.id
                ? "opacity-100 scale-100 translate-x-0 pointer-events-auto"
                : "opacity-0 scale-95 translate-x-2 pointer-events-none"
              }
            `}
          >
            <div className="font-semibold text-gray-800 mb-1">{item.label}</div>
            {item.useImage ? (
              <img 
                src={item.value} 
                alt={item.label}
                className="w-full h-auto rounded object-contain"
              />
            ) : (
              <div className="text-gray-600 text-sm break-words whitespace-pre-line">{item.value}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
