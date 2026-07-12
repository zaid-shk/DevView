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
    if (
      base.includes("localhost") ||
      base.match(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)
    ) {
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
    <div
      className={clsx(
        "w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 md:px-2 md:p-0 rounded-xl md:border transition-colors duration-300 ",
        theme === "light"
          ? "md:bg-zinc-100 md:border-zinc-200 md:shadow-sm"
          : "md:bg-[#1a1a1a] md:border-gray-700",
      )}
    >
      <input
        type="text"
        placeholder="Enter website URL (e.g. example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={isChecking}
        className={clsx(
          "w-full flex-1 md:bg-transparent outline-none px-3 py-3 text-sm sm:text-base rounded-xl border md:border-none transition-colors duration-300",
          isChecking
            ? "text-gray-500"
            : theme === "light"
              ? "text-zinc-900"
              : "text-white",
              
          theme === "light"
            ? "bg-zinc-100 border-zinc-200 md:border-none shadow-sm md:shadow-none"
            : "bg-[#1a1a1a] border-gray-700 md:border-none",
        )}
      />
      <button
        onClick={handleSubmit}
        disabled={isChecking}
        className={clsx(
          "w-full sm:w-auto px-4 md:py-1.5 py-2 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
          theme === "light"
            ? "bg-blue-600 hover:bg-blue-500 text-white"
            : "bg-[#ffc53d] hover:bg-[#facc15] text-black",
        )}
      >
        {isChecking ? "Checking..." : "Preview"}
      </button>
    </div>
  );
}
