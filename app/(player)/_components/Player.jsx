"use client";
import { Button } from "@/components/ui/button";
import { getSongsById } from "@/lib/fetch";
import {
  Download,
  Pause,
  Play,
  Repeat,
  Loader2,
  Share2,
  RedoDot,
  UndoDot,
  Music,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import Link from "next/link";
import { NextContext } from "@/hooks/use-context";
import { useMusic } from "@/components/music-provider";
import { motion, AnimatePresence } from "framer-motion";
import { AudioVisualizer } from "react-audio-visualize";

export default function Player({ id }) {
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const next = useContext(NextContext);
  const { current, setCurrent } = useMusic();
  const visualizerRef = useRef(null);

  useEffect(() => {
    const getSong = async () => {
      try {
        const get = await getSongsById(id);
        const data = await get.json();
        setData(data.data[0]);
        const highQuality = data?.data[0]?.downloadUrl.find(
          (q) => q.quality === "320kbps"
        );
        setAudioURL(highQuality?.url);
      } catch (error) {
        console.error("Failed to fetch song", error);
        toast.error("Failed to load song.");
      }
    };
    getSong();
    localStorage.setItem("last-played", id);
  }, [id]);

  useEffect(() => {
    if (audioRef.current) {
      const lastTime = localStorage.getItem(`pos-${id}`);
      if (lastTime) {
        audioRef.current.currentTime = parseFloat(lastTime);
        setCurrentTime(parseFloat(lastTime));
      }
      if (current) {
        audioRef.current.currentTime = parseFloat(current + 1);
      }
      const audio = audioRef.current;
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setCurrent(audio.currentTime);
        localStorage.setItem(`pos-${id}`, audio.currentTime);
      };
      audio.addEventListener("timeupdate", handleTimeUpdate);
      return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, [data]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const loopSong = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const downloadSong = async () => {
    if (!audioURL) return toast("No audio to download");
    setIsDownloading(true);
    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${data.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (e) {
      toast.error("Download failed!");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: data.name,
          text: `Listen to ${data.name} by ${data.artists.primary[0]?.name}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (e) {
      toast.error("Share failed!");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] py-8">
      <AnimatePresence>
        {!data ? (
          <Skeleton className="w-full h-[350px] rounded-2xl" />
        ) : (
          <motion.div
            key={data.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl mx-auto flex flex-col items-center glassy rounded-2xl shadow-2xl p-6"
            style={{ background: "rgba(30,30,40,0.7)", backdropFilter: "blur(16px)" }}
          >
            {/* Album Art */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-lg mb-6"
            >
              <img
                src={data.image[2].url}
                alt="song-bg"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
            {/* Song Info */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">{data.name}</h1>
              <p className="text-base text-white/80 mt-1">{data.artists.primary[0]?.name}</p>
            </div>
            {/* Visualizer */}
            <div className="w-full h-14 flex items-center justify-center mb-2">
              {audioRef.current && (
                <AudioVisualizer
                  ref={visualizerRef}
                  audioEle={audioRef.current}
                  width="100%"
                  height="100%"
                  barWidth={4}
                  gap={3}
                  barColor={"#a1a1aa"}
                  barPlayedColor={"#f4f4f5"}
                />
              )}
            </div>
            {/* Seekbar */}
            <div className="w-full flex flex-col gap-1 mb-2">
              <Slider
                onValueChange={(e) => (audioRef.current.currentTime = e[0])}
                value={[currentTime]}
                max={duration || 0}
                className="w-full"
              />
              <div className="w-full flex items-center justify-between text-xs text-white/50">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
              </div>
            </div>
            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (audioRef.current.currentTime -= 10)}
                aria-label="Rewind 10 seconds"
              >
                <UndoDot className="h-7 w-7 text-white/70" />
              </Button>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  className="rounded-full w-16 h-16 bg-white text-black shadow-xl hover:bg-white/90"
                  onClick={togglePlayPause}
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (audioRef.current.currentTime += 10)}
                aria-label="Forward 10 seconds"
              >
                <RedoDot className="h-7 w-7 text-white/70" />
              </Button>
            </div>
            {/* Extra Controls */}
            <div className="flex justify-center items-center gap-6 mt-2">
              <Button variant="ghost" size="icon" onClick={loopSong} aria-label="Loop">
                <Repeat
                  className={`h-6 w-6 transition-colors ${
                    isLooping ? "text-primary" : "text-white/70"
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadSong}
                disabled={isDownloading}
                aria-label="Download"
              >
                {isDownloading ? (
                  <Loader2 className="h-6 w-6 text-white/70 animate-spin" />
                ) : (
                  <Download className="h-6 w-6 text-white/70" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                <Share2 className="h-6 w-6 text-white/70" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <audio
        id="audio-element"
        crossOrigin="anonymous"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedData={() => setDuration(audioRef.current?.duration || 0)}
        autoPlay={playing}
        src={audioURL}
        ref={audioRef}
      ></audio>
    </div>
  );
}
