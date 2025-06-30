"use client";
import { Button } from "@/components/ui/button";
import { getSongsById } from "@/lib/fetch";
import {
  Download,
  Pause,
  Play,
  Repeat,
  Loader2,
  Repeat1,
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
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";

export default function Player({ id }) {
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(true);
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
      if (current) {
        audioRef.current.currentTime = parseFloat(current + 1);
      }
      const audio = audioRef.current;
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setCurrent(audio.currentTime);
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

  const togglePlayPause = () => setPlaying(!playing);

  const loopSong = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const handleShare = () => toast("Coming soon!");
  const downloadSong = () => toast("Coming soon!");

  return (
    <div className="relative mb-3 mt-10 p-4 md:p-8">
      <AnimatePresence>
        {!data ? (
          <Skeleton className="w-full h-[60vh] rounded-2xl" />
        ) : (
          <motion.div
            key={data.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Album Art */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:col-span-2 relative aspect-square rounded-2xl shadow-2xl overflow-hidden"
            >
              <img
                src={data.image[2].url}
                alt="song-bg"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h1 className="text-5xl md:text-7xl font-bold">{data.name}</h1>
                <p className="text-xl md:text-2xl text-white/80 mt-2">
                  {data.artists.primary[0]?.name}
                </p>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex flex-col justify-between bg-black/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg text-white">Now Playing</h2>
                <Music className="w-6 h-6 text-primary" />
              </div>

              <div className="flex flex-col items-center gap-6 my-auto">
                <div className="w-full h-20">
                  {audioRef.current && (
                    <AudioVisualizer
                      ref={visualizerRef}
                      audioEle={audioRef.current}
                      width="100%"
                      height="100%"
                      barWidth={5}
                      gap={4}
                      barColor={"#a1a1aa"}
                      barPlayedColor={"#f4f4f5"}
                    />
                  )}
                </div>
                <div className="w-full">
                  <Slider
                    onValueChange={(e) =>
                      (audioRef.current.currentTime = e[0])
                    }
                    value={[currentTime]}
                    max={duration || 0}
                    className="w-full"
                  />
                  <div className="w-full flex items-center justify-between text-xs text-white/50 mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => (audioRef.current.currentTime -= 10)}
                  >
                    <UndoDot className="h-6 w-6 text-white/70" />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full w-20 h-20 bg-white text-black hover:bg-white/90"
                    onClick={togglePlayPause}
                  >
                    {playing ? (
                      <Pause className="h-10 w-10" />
                    ) : (
                      <Play className="h-10 w-10 ml-1" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => (audioRef.current.currentTime += 10)}
                  >
                    <RedoDot className="h-6 w-6 text-white/70" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-around items-center">
                <Button variant="ghost" size="icon" onClick={loopSong}>
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
                >
                  {isDownloading ? (
                    <Loader2 className="h-6 w-6 text-white/70 animate-spin" />
                  ) : (
                    <Download className="h-6 w-6 text-white/70" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-6 w-6 text-white/70" />
                </Button>
              </div>
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
