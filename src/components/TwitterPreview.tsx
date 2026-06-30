import React from "react";
import { MessageCircle, Heart, Repeat2, Share, BarChart2, Bookmark, Check } from "lucide-react";

interface TwitterPreviewProps {
  content: string;
  userEmail?: string;
}

export default function TwitterPreview({ content, userEmail = "mariamimari208@gmail.com" }: TwitterPreviewProps) {
  const displayName = userEmail.split("@")[0];
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const handle = displayName.toLowerCase();

  const charCount = content.length;
  const isOverLimit = charCount > 280;
  const limitPercentage = Math.min((charCount / 280) * 100, 100);

  // Split content by paragraphs
  const paragraphs = content.split("\n");

  return (
    <div id="twitter-preview-card" className="w-full bg-white border border-gray-200 rounded-xl shadow-sm text-gray-950 font-sans text-sm max-w-xl mx-auto overflow-hidden">
      {/* Platform Warning Header if over limit */}
      {isOverLimit && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-700 flex items-center gap-2">
          <span className="font-semibold">Note:</span> Tweet is {charCount - 280} characters over the standard 280-character limit. It will be generated as a Thread, or require Twitter Blue / X Premium.
        </div>
      )}

      <div className="p-4">
        {/* Card Header */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            {formattedName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-bold text-gray-900 truncate hover:underline cursor-pointer">{formattedName}</span>
              <span className="text-gray-500 text-xs truncate">@{handle}</span>
              <span className="text-gray-500 text-xs">•</span>
              <span className="text-gray-500 text-xs hover:underline cursor-pointer">1h</span>
            </div>

            {/* Card Content */}
            <div className="mt-2 text-[15px] text-gray-900 leading-normal break-words whitespace-pre-wrap select-text">
              {content}
            </div>

            {/* Character Count & Visual Gauge Indicator */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{charCount} / 280 characters</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Custom circular progress indicator for character count */}
                <div className="relative w-5 h-5">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke={isOverLimit ? "#ef4444" : "#e5e7eb"}
                      strokeWidth="2"
                      fill="transparent"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke={isOverLimit ? "#ef4444" : charCount > 250 ? "#f59e0b" : "#1d9bf0"}
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={50}
                      strokeDashoffset={50 - (50 * limitPercentage) / 100}
                    />
                  </svg>
                </div>
                {isOverLimit ? (
                  <span className="text-xs text-red-500 font-semibold">Over Limit</span>
                ) : charCount > 250 ? (
                  <span className="text-xs text-amber-500 font-semibold">Almost Full</span>
                ) : null}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex items-center justify-between text-gray-500 max-w-md">
              <button className="group flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition p-1.5 rounded-full hover:bg-blue-50">
                <MessageCircle size={16} />
                <span className="text-xs">{Math.floor(Math.random() * 20) + 5}</span>
              </button>
              <button className="group flex items-center gap-1.5 hover:text-green-500 cursor-pointer transition p-1.5 rounded-full hover:bg-green-50">
                <Repeat2 size={16} />
                <span className="text-xs">{Math.floor(Math.random() * 10) + 2}</span>
              </button>
              <button className="group flex items-center gap-1.5 hover:text-rose-500 cursor-pointer transition p-1.5 rounded-full hover:bg-rose-50">
                <Heart size={16} className="group-hover:fill-rose-500" />
                <span className="text-xs">{Math.floor(Math.random() * 80) + 15}</span>
              </button>
              <button className="group flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition p-1.5 rounded-full hover:bg-blue-50">
                <BarChart2 size={16} />
                <span className="text-xs">{Math.floor(Math.random() * 800) + 200}</span>
              </button>
              <div className="flex gap-1">
                <button className="hover:text-blue-500 cursor-pointer p-1.5 rounded-full hover:bg-blue-50 transition">
                  <Bookmark size={16} />
                </button>
                <button className="hover:text-blue-500 cursor-pointer p-1.5 rounded-full hover:bg-blue-50 transition">
                  <Share size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
