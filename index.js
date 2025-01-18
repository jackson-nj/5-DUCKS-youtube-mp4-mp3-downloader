import express from "express";
import ytdl from "ytdl-core";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint
app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

// Video info endpoint
app.get("/video-info", async (req, res) => {
  try {
    const { url } = req.query;
    console.log("Received URL:", url);

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const videoID = ytdl.getVideoID(url);
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
    });

    // Format duration
    const duration = info.videoDetails.lengthSeconds;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedDuration = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    const videoDetails = {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: formattedDuration,
      embedUrl: `https://www.youtube.com/embed/${videoID}`,
      formats: {
        video: [
          { label: "1080p", format: "mp4" },
          { label: "720p", format: "mp4" },
          { label: "480p", format: "mp4" },
          { label: "360p", format: "mp4" },
        ]
          .filter((quality) =>
            info.formats.some(
              (f) =>
                f.qualityLabel?.includes(quality.label) &&
                f.container === quality.format
            )
          )
          .map((quality) => {
            const format = info.formats.find(
              (f) =>
                f.qualityLabel?.includes(quality.label) &&
                f.container === quality.format
            );
            return {
              itag: format.itag,
              quality: quality.label,
              container: quality.format,
              size: format.contentLength
                ? `${(format.contentLength / 1024 / 1024).toFixed(2)} MB`
                : "Unknown size",
            };
          }),
        audio: [
          { label: "High", quality: "AUDIO_QUALITY_HIGH" },
          { label: "Medium", quality: "AUDIO_QUALITY_MEDIUM" },
        ]
          .filter((quality) =>
            info.formats.some(
              (f) => f.audioQuality === quality.quality && !f.hasVideo
            )
          )
          .map((quality) => {
            const format = info.formats.find(
              (f) => f.audioQuality === quality.quality && !f.hasVideo
            );
            return {
              itag: format.itag,
              quality: quality.label,
              container: "mp3",
              size: format.contentLength
                ? `${(format.contentLength / 1024 / 1024).toFixed(2)} MB`
                : "Unknown size",
            };
          }),
      },
    };

    console.log("Sending video details:", videoDetails);
    res.json(videoDetails);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// YouTubeDownloader.jsx
const handleConvert = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    window.location.href = `http://localhost:5000/download?url=${encodeURIComponent(
      url
    )}`;
  } catch (error) {
    console.error("Download error:", error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

const handleDownload = async (blob) => {
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  try {
    a.href = downloadUrl;
    a.download = "video.mp4";
    document.body.appendChild(a);
    a.click();
    return true;
  } catch (error) {
    throw new Error("Download creation failed");
  } finally {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  }
};
