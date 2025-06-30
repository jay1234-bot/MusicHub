"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  ExternalLink,
  Pause,
  Play,
  Repeat,
  Repeat1,
  X,
} from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import Link from "next/link";
import { MusicContext, NextContext } from "@/hooks/use-context";
import { Skeleton } from "../ui/skeleton";
import { useMusic } from "../music-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function Player() {
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState("");
  const [isLooping, setIsLooping] = useState(false);
  const values = useContext(MusicContext);
  const next = useContext(NextContext);

  const { current, setCurrent } = useMusic();

  useEffect(() => {
    if (values.music) {
      const getSong = async () => {
        const get = await getSongsById(values.music);
        const res = await get.json();
        setData(res.data[0]);
        const highQuality = res.data[0]?.downloadUrl.find(
          (q) => q.quality === "320kbps"
        );
        setAudioURL(highQuality?.url);
      };
      getSong();
    }
  }, [values.music]);

  useEffect(() => {
    setPlaying(localStorage.getItem("p") === "true");
  }, []);

  useEffect(() => {
    if (audioRef.current && data) {
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

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      localStorage.setItem("p", "false");
    } else {
      audioRef.current.play();
      setPlaying(true);
      localStorage.setItem("p", "true");
    }
  };

  const loopSong = () => {
    audioRef.current.loop = !isLooping;
    setIsLooping(!isLooping);
  };

  const closePlayer = () => {
    values.setMusic(null);
    setCurrent(0);
    localStorage.removeItem("last-played");
    localStorage.removeItem("p");
    setPlaying(false);
    setData(null);
    setAudioURL(null);
    if(audioRef.current) {
        audioRef.current.src = null;
    }
  };

  return (
    <main>
      <audio
        autoPlay={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedData={() => setDuration(audioRef.current.duration)}
        src={audioURL}
        ref={audioRef}
      ></audio>
      <AnimatePresence>
        {values.music && data && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="max-w-4xl mx-auto p-2">
              <div className="bg-black/30 backdrop-blur-xl rounded-lg shadow-2xl p-3 flex items-center gap-4 border border-white/10">
                <img
                  src={data.image[1].url}
                  alt={data.name}
                  className="rounded-md h-14 w-14 object-cover"
                />
                <div className="flex-grow">
                  <Link
                    href={`/${values.music}`}
                    className="font-bold text-white hover:underline truncate"
                  >
                    {data.name}
                  </Link>
                  <p className="text-sm text-white/60 truncate">
                    {data.artists.primary[0].name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white/70 hover:text-white"
                    onClick={loopSong}
                  >
                    <Repeat
                      className={`h-5 w-5 transition-colors ${
                        isLooping ? "text-primary" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-white text-black rounded-full h-10 w-10"
                    onClick={togglePlayPause}
                  >
                    {playing ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white/70 hover:text-white"
                    asChild
                  >
                    <Link href={`/${values.music}`} title="Go to Player">
                      <ExternalLink className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white/70 hover:text-white"
                    onClick={closePlayer}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
