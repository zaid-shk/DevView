import { useState } from "react";
import { useSelector } from "react-redux";
import { clsx } from "clsx";

export default function URLBar({ onSubmit }) {
  const [url, setUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const theme = useSelector((state) => state.app.theme);

  const checkUrl = async (testUrl) => {
    try {
      // no-cors mode allows us to ping the server without CORS errors.
      // If the domain doesn't exist or SSL fails, it throws an error.
      await fetch(testUrl, { mode: "no-cors" });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!url || isChecking) return;

    let base = url.trim();

    // If user already specified a protocol, use it directly
    if (base.startsWith("http://") || base.startsWith("https://")) {
      onSubmit(base);
      return;
    }

    // Default to http for localhost and local IPs
    if (base.includes("localhost") || base.match(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)) {
      onSubmit("http://" + base);
      return;
    }

    setIsChecking(true);

    // Predict correct URL by testing common permutations
    const protocolsToTry = [
      `https://${base}`,
      `https://www.${base}`,
      `http://${base}`,
      `http://www.${base}`,
    ];

    let correctUrl = `https://${base}`; // Fallback

    for (const testUrl of protocolsToTry) {
      const isReachable = await checkUrl(testUrl);
      if (isReachable) {
        correctUrl = testUrl;
        break;
      }
    }

    onSubmit(correctUrl);
    setIsChecking(false);
  };

  return (
    <div className={clsx(
      "w-full max-w-2xl mx-auto flex items-center gap-2 px-2 rounded-xl border transition-colors duration-300",
      theme === 'light' ? "bg-zinc-100 border-zinc-200 shadow-sm" : "bg-[#1a1a1a] border-gray-700"
    )}>
      
      <input
        type="text"
        placeholder="Enter website URL (e.g. example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={isChecking}
        className={clsx(
          "flex-1 bg-transparent outline-none px-2 py-3 transition-colors",
          isChecking ? 'text-gray-500' : (theme === 'light' ? 'text-zinc-900' : 'text-white')
        )}
      />

      <button
        onClick={handleSubmit}
        disabled={isChecking}
        className={clsx(
          "px-4 py-1.5 my-1 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
          theme === 'light' ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-[#ffc53d] hover:bg-[#facc15] text-black"
        )}
      >
        {isChecking ? "Checking..." : "Preview"}
      </button>
    </div>
  );
}
