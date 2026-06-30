import React from "react";
import { Globe, MoreHorizontal, Heart, MessageSquare, Repeat, Send, ThumbsUp } from "lucide-react";

interface LinkedInPreviewProps {
  content: string;
  userEmail?: string;
  industry?: string;
}

export default function LinkedInPreview({ content, userEmail = "mariamimari208@gmail.com", industry = "Software Development" }: LinkedInPreviewProps) {
  const displayName = userEmail.split("@")[0];
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const headline = `${industry} Professional | Innovator & Tech Enthusiast`;

  // Process text to insert paragraphs cleanly
  const paragraphs = content.split("\n");

  return (
    <div id="linkedin-preview-card" className="w-full bg-white border border-gray-200 rounded-xl shadow-sm text-gray-900 font-sans text-sm max-w-xl mx-auto overflow-hidden">
      {/* Card Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 font-bold text-slate-700 text-lg shadow-inner">
            {formattedName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer flex items-center gap-1.5">
              {formattedName}
              <span className="text-xs text-gray-400 font-normal">• 1st</span>
            </div>
            <div className="text-xs text-gray-500 font-normal leading-tight mt-0.5 max-w-sm line-clamp-1">
              {headline}
            </div>
            <div className="text-xs text-gray-400 font-normal flex items-center gap-1 mt-1">
              <span>1h • Edited •</span>
              <Globe size={12} className="text-gray-400" />
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Card Content */}
      <div className="px-4 pb-3 pt-1 text-slate-800 leading-relaxed break-words select-text">
        {paragraphs.map((para, idx) => (
          <p key={idx} className={`${para.trim() === "" ? "h-3" : "mb-3"} last:mb-0`}>
            {para}
          </p>
        ))}
      </div>

      {/* Social Counters */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="flex items-center -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white ring-1 ring-white">
              <ThumbsUp size={9} className="fill-white" />
            </span>
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white ring-1 ring-white">
              <Heart size={9} className="fill-white" />
            </span>
          </span>
          <span className="hover:underline hover:text-blue-600 cursor-pointer pl-1">
            {Math.floor(Math.random() * 45) + 24} likes
          </span>
        </div>
        <div className="flex items-center gap-2 hover:underline cursor-pointer">
          <span>{Math.floor(Math.random() * 8) + 3} comments</span>
          <span>•</span>
          <span>{Math.floor(Math.random() * 4) + 1} reposts</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-around text-gray-600 font-medium text-xs sm:text-sm">
        <button className="flex items-center gap-1.5 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition">
          <ThumbsUp size={16} />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition">
          <MessageSquare size={16} />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition">
          <Repeat size={16} />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-1.5 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition">
          <Send size={16} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
