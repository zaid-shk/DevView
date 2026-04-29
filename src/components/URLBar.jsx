import { useState } from "react";

export default function URLBar({ onSubmit }) {
  const [url, setUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);

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
    <div className="w-full max-w-2xl mx-auto flex items-center gap-2 px-2 bg-[#1a1a1a] rounded-xl border border-gray-700">
      
      <input
        type="text"
        placeholder="Enter website URL (e.g. example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={isChecking}
        className={`flex-1 bg-transparent outline-none px-2 py-2 ${isChecking ? 'text-gray-500' : 'text-white'}`}
      />

      <button
        onClick={handleSubmit}
        disabled={isChecking}
        className="bg-yellow-400 text-black px-2 py-1 my-1 rounded-lg font-semibold hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isChecking ? "Checking..." : "Preview"}
      </button>
    </div>
  );
}
