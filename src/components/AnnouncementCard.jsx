import React from "react";

export default function AnnouncementCard({ title, date, desc }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 hover:shadow-md transition">
      <h4 className="font-semibold text-blue-700 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 mb-2">{date}</p>
      <p className="text-gray-700 text-sm">{desc}</p>
    </div>
  );
}
