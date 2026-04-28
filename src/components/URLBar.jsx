import { useState } from "react";

export default function URLBar({ onSubmit }) {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (!url) return;

    let formattedUrl = url.trim();

    // add https if missing
    if (!formattedUrl.startsWith("http")) {
      formattedUrl = "https://" + formattedUrl;
      formattedUrl = "https://www." + formattedUrl;
    }

    onSubmit(formattedUrl);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex items-center gap-2 px-2 bg-[#1a1a1a] rounded-xl border border-gray-700">
      
      <input
        type="text"
        placeholder="Enter website URL (e.g. example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1 bg-transparent outline-none text-white px-2 py-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-yellow-400 text-black px-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        Preview
      </button>
    </div>
  );
}
