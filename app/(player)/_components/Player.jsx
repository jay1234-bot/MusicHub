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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
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
    if (audioRef.current && data) {
      const audio = audioRef.current;
      
      const lastTime = localStorage.getItem(`pos-${id}`);
      if (lastTime) {
        audio.currentTime = parseFloat(lastTime);
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        localStorage.setItem(`pos-${id}`, audio.currentTime);
      };
      const handleLoadedData = () => {
        setDuration(audio.duration);
        if (localStorage.getItem("p") === "true") {
          audio.play();
          setPlaying(true);
        }
      }
      
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadeddata", handleLoadedData);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadeddata", handleLoadedData);
      }
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
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const loopSong = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const downloadSong = async () => {
    if (!audioURL) return toast.error("Audio source not available for download.");
    setIsDownloading(true);
    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${data.name || 'song'}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("Download started!");
    } catch (e) {
      toast.error("Download failed!");
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
        title: data?.name,
        text: `Listen to ${data?.name} by ${data?.artists?.primary[0]?.name}`,
        url: shareUrl,
    }
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (e) {
      toast.error("Share failed!");
      console.error(e);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] py-8">
      <AnimatePresence>
        {!data ? (
          <Skeleton className="w-full max-w-xl h-[450px] rounded-2xl" />
        ) : (
          <motion.div
            key={data.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl mx-auto flex flex-col items-center bg-background/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg mb-6"
            >
              <img
                src={data.image[2].url}
                alt={data.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </motion.div>
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold drop-shadow-lg">{data.name}</h1>
              <p className="text-base text-muted-foreground mt-1">{data.artists.primary[0]?.name}</p>
            </div>
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
            <div className="w-full flex flex-col gap-1 mb-2">
              <Slider
                onValueChange={(e) => (audioRef.current.currentTime = e[0])}
                value={[currentTime]}
                max={duration || 0}
                className="w-full"
              />
              <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2 mb-4">
              <Button variant="ghost" size="icon" onClick={() => (audioRef.current.currentTime -= 10)} >
                <UndoDot className="h-7 w-7" />
              </Button>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button size="icon" className="rounded-full w-16 h-16 bg-primary text-primary-foreground shadow-xl hover:bg-primary/90" onClick={togglePlayPause} >
                  {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
              </motion.div>
              <Button variant="ghost" size="icon" onClick={() => (audioRef.current.currentTime += 10)} >
                <RedoDot className="h-7 w-7" />
              </Button>
            </div>
            <div className="flex justify-center items-center gap-6 mt-2">
              <Button variant="ghost" size="icon" onClick={loopSong}>
                <Repeat className={`h-6 w-6 transition-colors ${ isLooping ? "text-primary" : "text-muted-foreground" }`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={downloadSong} disabled={isDownloading} >
                {isDownloading ? ( <Loader2 className="h-6 w-6 animate-spin" /> ) : ( <Download className="h-6 w-6" /> )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-6 w-6" />
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
        src={audioURL}
        ref={audioRef}
      ></audio>
    </div>
  );
}
