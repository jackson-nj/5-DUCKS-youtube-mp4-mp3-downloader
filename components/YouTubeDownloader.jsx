import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const API_URL = "http://localhost:5000";

function YouTubeDownloader() {
  const [darkMode, setDarkMode] = useState(false);
  const [url, setUrl] = useState("");
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  const languages = [
    "English",
    "Español",
    "Français",
    "Deutsch",
    "Italiano",
    "日本語",
    "한국어",
    "中文",
  ];

  const faqItems = [
    {
      question: "Is 5DUCKS YouTube converter free to use?",
      answer:
        "Yes, 5DUCKS YouTube converter is completely free to use with no hidden charges or registration required.",
    },
    {
      question: "What video quality options are available?",
      answer:
        "We support various quality options including 1080p, 720p, 480p, and 360p. You can choose the quality that best suits your needs after conversion.",
    },
    {
      question: "Is it safe to use 5DUCKS converter?",
      answer:
        "Yes, our converter is completely safe to use. We don't store any personal information and all conversions are processed securely.",
    },
    {
      question: "How long does it take to convert a video?",
      answer:
        "Conversion time depends on the video length and quality. Most videos are converted within a few minutes.",
    },
    {
      question: "What are the supported platforms?",
      answer:
        "Our converter works on all major platforms including Windows, Mac, Linux, iOS, and Android devices through any modern web browser.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Test server connection
      const pingResponse = await fetch(`${API_URL}/ping`);
      if (!pingResponse.ok) {
        throw new Error("Server not responding");
      }

      // Get video info
      const response = await fetch(
        `${API_URL}/video-info?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch video info");
      }

      const data = await response.json();
      console.log("Video info received:", data);
      setVideoInfo(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url, itag, format) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/download?url=${encodeURIComponent(
          url
        )}&itag=${itag}&format=${format}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Download failed");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `video.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        {/* Header */}
        <nav className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <div className="text-red-500 text-2xl font-bold flex items-center">
              <span className="text-red-500 mr-1">▶</span>
              5DUCKS
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span>🌐</span>
                {selectedLanguage}
                <span>▼</span>
              </button>

              {showLanguages && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                  {languages.map((language) => (
                    <button
                      key={language}
                      onClick={() => {
                        setSelectedLanguage(language);
                        setShowLanguages(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <span className="text-xl">
                {darkMode ? <FaSun /> : <FaMoon />}
              </span>
            </button>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4">
          {/* Tab Options */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center mb-8">
            <button className="flex-1 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg flex items-center justify-center gap-2">
              <span>⬇️</span>
              Download
            </button>
            <button className="flex-1 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center gap-2">
              <span>MP3</span>
            </button>
            <button className="flex-1 py-3 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 shadow-sm rounded-r-lg flex items-center justify-center gap-2">
              <span>MP4</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            YouTube Downloader
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Effortlessly convert and download YouTube videos to MP4 format for
            free in high-definition quality.
          </p>

          {/* Search Box */}
          <div className="border border-red-200 dark:border-red-800 rounded-xl p-3 mb-8 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                placeholder="Paste YouTube link here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 outline-none text-gray-700 dark:text-gray-300 bg-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-red-500 text-white px-8 py-2 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Convert"}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {videoInfo && (
            <div className="mt-8 space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={videoInfo.embedUrl}
                  className="w-full h-[400px] rounded-lg"
                  allowFullScreen
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {videoInfo.title}
              </h2>

              {/* Format Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Formats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Video Formats
                  </h3>
                  <div className="space-y-2">
                    {videoInfo.formats?.video?.map((format) => (
                      <button
                        key={format.itag}
                        onClick={() => handleDownload(url, format.itag, "mp4")}
                        className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        MP4 - {format.quality}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Formats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Audio Formats
                  </h3>
                  <div className="space-y-2">
                    {videoInfo.formats?.audio?.map((format) => (
                      <button
                        key={format.itag}
                        onClick={() => handleDownload(url, format.itag, "mp3")}
                        className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        MP3 - {format.quality}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How to Use */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              How to Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  1. Copy YouTube URL
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Go to YouTube and copy the video URL you want to convert
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  2. Paste URL
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Paste the URL into the input field above and click "Convert"
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">⬇️</span>
                </div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  3. Download MP4
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose your preferred quality and download the converted MP4
                  file
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === index ? null : index)
                    }
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.question}
                    </span>
                    <span className="text-gray-500 text-xl">
                      {openFaqIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-800 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="text-red-500 text-2xl font-bold flex items-center mb-4">
                  <span className="text-red-500 mr-1">▶</span>
                  5DUCKS
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The fastest and most reliable YouTube to MP4 converter.
                  Download your favorite videos in high quality for free.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      Copyright
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Support
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="mailto:support@5ducks.com"
                      className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 flex items-center gap-2"
                      aria-label="Contact Support"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/help"
                      className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 flex items-center gap-2"
                      aria-label="Visit Help Center"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Help Center
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
              <p>© {new Date().getFullYear()} 5DUCKS. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default YouTubeDownloader;
