"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const FLAG_MAP: Record<string, string> = {
  en: "🇺🇸",
  zh: "🇨🇳",
  ja: "🇯🇵",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  ar: "🇸🇦"
};

const SUPPORTED_LOCALES = ["en", "zh", "fr", "de", "es", "ja", "ar"];

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname(); //获取当前链接
  const [open, setOpen] = useState(false); //设置Hover按钮默认关
  const wrapperRef = useRef<HTMLDivElement | null>(null); 
  const hoverTimeoutRef = useRef<number | null>(null); //设置延迟时间

  // 生成目标 locale 的 URL，保留其余 path
  function switchLocaleUrl(target: string) {
    if (!pathname) return `/${target}`;
    const segments = pathname.split("/");
    // 如果 path 为 "/" 或没有 locale 段，直接加上
    if (segments.length <= 1 || !segments[1]) {
      return `/${target}`;
    }
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  // 外部点击关闭
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // 键盘 ESC 关闭
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Hover 开/关（带短延迟以防闪烁）
  function handleMouseEnter() {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setOpen(true);
  }
  function handleMouseLeave() {
    // 延迟关闭，给鼠标移动留出时间
    hoverTimeoutRef.current = window.setTimeout(() => setOpen(false), 120);
  }

  // 点击按钮切换（对于触摸设备）
  function handleToggleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen((v) => !v);
  }

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 当前语言按钮 - 使用 button 以便可聚焦/键盘操作 */}
      <button
        onClick={handleToggleClick}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center justify-center rounded px-2 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
      >
        <span className="text-2xl select-none pointer-events-none">{FLAG_MAP[locale]}</span>
      </button>

      {/* 下拉菜单 */}
      <div
        role="menu"
        aria-hidden={!open}
        className={`origin-top-right absolute right-0 mt-2 w-max rounded bg-white border shadow-lg z-50 transform transition-all duration-150 ${
          open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        }`}
        // 防止菜单自身的点击事件被冒泡到 document（触发外部关闭）
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 flex flex-col gap-1 min-w-[120px] max-h-[320px] overflow-y-auto">
          {SUPPORTED_LOCALES.map((lng) => {
            const isCurrent = lng === locale;
            // 如果是当前语言，显示不可点击状态
            if (isCurrent) {
              return (
                <div
                  key={lng}
                  className="flex items-center gap-2 px-3 py-1 rounded text-sm text-gray-700 bg-gray-100 cursor-default select-none"
                >
                  <span className="text-xl">{FLAG_MAP[lng]}</span>
                  <span className="ml-1">{lng.toUpperCase()}</span>
                </div>
              );
            }

            return (
              <Link
                key={lng}
                href={switchLocaleUrl(lng)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-1 rounded text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <span className="text-xl">{FLAG_MAP[lng]}</span>
                <span className="ml-1">{lng.toUpperCase()}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
