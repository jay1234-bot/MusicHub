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
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { NextContext } from "@/hooks/use-context";
import Next from "@/components/cards/next";
import { useMusic } from "@/components/music-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function Player({ id }) {
  const [data, setData] = useState([]);
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const params = useSearchParams();
  const next = useContext(NextContext);
  const { current, setCurrent } = useMusic();

  const getSong = async () => {
    const get = await getSongsById(id);
    const data = await get.json();
    setData(data.data[0]);
    if (data?.data[0]?.downloadUrl[4]?.url) {
      setAudioURL(data?.data[0]?.downloadUrl[4]?.url);
    } else if (data?.data[0]?.downloadUrl[3]?.url) {
      setAudioURL(data?.data[0]?.downloadUrl[3]?.url);
    } else if (data?.data[0]?.downloadUrl[2]?.url) {
      setAudioURL(data?.data[0]?.downloadUrl[2]?.url);
    } else if (data?.data[0]?.downloadUrl[1]?.url) {
      setAudioURL(data?.data[0]?.downloadUrl[1]?.url);
    } else {
      setAudioURL(data?.data[0]?.downloadUrl[0]?.url);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const togglePlayPause = () => {
    if (playing) {
      audioRef.current.pause();
      localStorage.setItem("p", "false");
    } else {
      audioRef.current.play();
      localStorage.setItem("p", "true");
    }
    setPlaying(!playing);
  };

  const downloadSong = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(audioURL);
      const datas = await response.blob();
      const url = URL.createObjectURL(datas);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.name}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (e) {
      toast.error("Download failed!");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSeek = (e) => {
    const seekTime = e[0];
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const loopSong = () => {
    audioRef.current.loop = !audioRef.current.loop;
    setIsLooping(!isLooping);
  };

  const handleShare = () => {
    try {
      navigator.share({
        url: `https://${window.location.host}/${data.id}`,
      });
    } catch (e) {
      toast.error("Sharing is not supported on this device.");
    }
  };

  useEffect(() => {
    getSong();
    localStorage.setItem("last-played", id);
    localStorage.removeItem("p");
    if (current) {
        if(audioRef.current) {
            audioRef.current.currentTime = parseFloat(current + 1);
        }
    }
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      try {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setCurrent(audio.currentTime);
      } catch (e) {
        setPlaying(false);
      }
    };
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [id]);

  useEffect(() => {
    const handleRedirect = () => {
      if (currentTime === duration && !isLooping && duration !== 0) {
        if (next?.nextData?.id) {
          window.location.href = `https://${window.location.host}/${next?.nextData?.id}`;
        }
      }
    };
    if (isLooping || duration === 0) return;
    handleRedirect();
  }, [currentTime, duration, isLooping, next?.nextData?.id]);

  return (
    <div className="relative mb-3 mt-10">
      <audio
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedData={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        autoPlay={playing}
        src={audioURL}
        ref={audioRef}
      ></audio>

      {data.length <= 0 ? (
        <div className="grid gap-6 w-full">
          <div className="sm:flex px-6 md:px-20 lg:px-32 grid gap-5 w-full">
            <Skeleton className="md:w-[130px] aspect-square rounded-2xl md:h-[150px]" />
            <div className="flex flex-col justify-between w-full">
              <div>
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-3 w-16 mb-4" />
              </div>
              <div>
                <Skeleton className="h-4 w-full rounded-full mb-2" />
                <div className="w-full flex items-center justify-between">
                  <Skeleton className="h-[9px] w-6" />
                  <Skeleton className="h-[9px] w-6" />
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full"
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-background">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-black/50 bg-[radial-gradient(circle_500px_at_50%_200px,#31303b,transparent)]"></div>
          </div>
          {data?.image && (
            <AnimatePresence>
              <motion.img
                key={data.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={data.image[2].url}
                alt="song-bg"
                className="absolute inset-0 -z-20 h-full w-full object-cover blur-3xl opacity-50"
              />
            </AnimatePresence>
          )}

          <div className="grid gap-6 w-full px-6 md:px-20 lg:px-32 py-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <AnimatePresence>
                  <motion.div
                    key={data.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, rotate: playing ? 360 : 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                      default: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    className="relative w-64 h-64 md:w-80 md:h-80"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: playing
                          ? [
                              "0 0 0 2px rgba(255, 255, 255, 0.1)",
                              "0 0 0 4px rgba(255, 255, 255, 0.1)",
                              "0 0 0 2px rgba(255, 255, 255, 0.1)",
                            ]
                          : "none",
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <img
                      src={data.image[2].url}
                      className="rounded-full w-full h-full object-cover shadow-2xl"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex flex-col justify-between w-full text-center md:text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={data.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="sm:mt-0 mt-3"
                  >
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    <p className="text-lg text-muted-foreground">
                      by{" "}
                      <Link
                        href={
                          "/search/" +
                          `${encodeURI(
                            data.artists.primary[0].name
                              .toLowerCase()
                              .split(" ")
                              .join("+")
                          )}`
                        }
                        className="text-foreground hover:underline"
                      >
                        {data.artists.primary[0]?.name || "unknown"}
                      </Link>
                    </p>
                  </motion.div>
                </AnimatePresence>
                <div className="grid gap-4 w-full mt-8">
                  <Slider
                    onValueChange={handleSeek}
                    value={[currentTime]}
                    max={duration || 0}
                    className="w-full"
                  />
                  <div className="w-full flex items-center justify-between text-xs">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 0)}</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={loopSong}
                      className="rounded-full"
                    >
                      {!isLooping ? (
                        <Repeat className="h-5 w-5" />
                      ) : (
                        <Repeat1 className="h-5 w-5 text-primary" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => (audioRef.current.currentTime -= 10)}
                      className="rounded-full"
                    >
                      <UndoDot className="h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16"
                      onClick={togglePlayPause}
                    >
                      {playing ? (
                        <Pause className="h-8 w-8 text-black" />
                      ) : (
                        <Play className="h-8 w-8 fill-black" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => (audioRef.current.currentTime += 10)}
                      className="rounded-full"
                    >
                      <RedoDot className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={downloadSong}
                      className="rounded-full"
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Download className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleShare}
                      className="rounded-full"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {next.nextData && (
        <div className="mt-20 px-6 md:px-20 lg:px-32">
          <h2 className="text-xl font-bold mb-4">Next Up</h2>
          <Next
            name={next.nextData.name}
            artist={next.nextData.artist}
            image={next.nextData.image}
            id={next.nextData.id}
          />
        </div>
      )}
    </div>
  );
}
