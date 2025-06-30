"use client"
import AlbumCard from "@/components/cards/album";
import ArtistCard from "@/components/cards/artist";
import SongCard from "@/components/cards/song";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getSongsByQuery, searchAlbumByQuery } from "@/lib/fetch";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [hindi, setHindi] = useState([]);
  const [punjabi, setPunjabi] = useState([]);
  const [english, setEnglish] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [
      latestData,
      popularData,
      albumData,
      hindiData,
      punjabiData,
      englishData,
    ] = await Promise.all([
      getSongsByQuery("latest").then((res) => res.json()),
      getSongsByQuery("trending").then((res) => res.json()),
      searchAlbumByQuery("latest").then((res) => res.json()),
      getSongsByQuery("hindi").then((res) => res.json()),
      getSongsByQuery("punjabi").then((res) => res.json()),
      getSongsByQuery("english").then((res) => res.json()),
    ]);
    setLatest(latestData.data.results);
    setPopular(popularData.data.results);
    setAlbums(albumData.data.results);
    setHindi(hindiData.data.results);
    setPunjabi(punjabiData.data.results);
    setEnglish(englishData.data.results);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="px-6 py-5 md:px-20 lg:px-32">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Browse</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw
            className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        <motion.div variants={item}>
          <div className="flex items-center justify-between">
            <div className="grid">
              <h1 className="text-2xl font-bold">New Releases</h1>
              <p className="text-sm text-muted-foreground">
                Top new released songs.
              </p>
            </div>
          </div>
          <ScrollArea className="rounded-md mt-4">
            <div className="flex gap-4 pb-4">
              {latest.length > 0 && !loading
                ? latest
                    .slice()
                    .map((song) => (
                      <SongCard
                        key={song.id}
                        image={song.image[2].url}
                        album={song.album}
                        title={song.name}
                        artist={song.artists.primary[0].name}
                        id={song.id}
                      />
                    ))
                : Array.from({ length: 10 }).map((_, i) => (
                    <SongCard key={i} />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.div>

        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">Top Albums</h1>
          <p className="text-sm text-muted-foreground">
            Top new released albums.
          </p>
          <ScrollArea className="rounded-md mt-4">
            <div className="flex gap-4 pb-4">
              {albums.length > 0 && !loading
                ? albums
                    .slice()
                    .map((song) => (
                      <AlbumCard
                        key={song.id}
                        lang={song.language}
                        image={song.image[2].url}
                        album={song.album}
                        title={song.name}
                        artist={song.artists.primary[0].name}
                        id={`album/${song.id}`}
                      />
                    ))
                : Array.from({ length: 10 }).map((_, i) => (
                    <SongCard key={i} />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.div>

        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">Top Hindi</h1>
          <p className="text-sm text-muted-foreground">
            Top new released hindi songs.
          </p>
          <ScrollArea className="rounded-md mt-4">
            <div className="flex gap-4 pb-4">
              {hindi.length > 0 && !loading
                ? hindi
                    .slice()
                    .map((song) => (
                      <SongCard
                        key={song.id}
                        image={song.image[2].url}
                        album={song.album}
                        title={song.name}
                        artist={song.artists.primary[0].name}
                        id={song.id}
                      />
                    ))
                : Array.from({ length: 10 }).map((_, i) => (
                    <SongCard key={i} />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.div>

        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">Top Punjabi</h1>
          <p className="text-sm text-muted-foreground">
            Top new released punjabi songs.
          </p>
          <ScrollArea className="rounded-md mt-4">
            <div className="flex gap-4 pb-4">
              {punjabi.length > 0 && !loading
                ? punjabi
                    .slice()
                    .map((song) => (
                      <SongCard
                        key={song.id}
                        image={song.image[2].url}
                        album={song.album}
                        title={song.name}
                        artist={song.artists.primary[0].name}
                        id={song.id}
                      />
                    ))
                : Array.from({ length: 10 }).map((_, i) => (
                    <SongCard key={i} />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.div>

        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">Top English</h1>
          <p className="text-sm text-muted-foreground">
            Top new released english songs.
          </p>
          <ScrollArea className="rounded-md mt-4">
            <div className="flex gap-4 pb-4">
              {english.length > 0 && !loading
                ? english
                    .slice()
                    .map((song) => (
                      <SongCard
                        key={song.id}
                        image={song.image[2].url}
                        album={song.album}
                        title={song.name}
                        artist={song.artists.primary[0].name}
                        id={song.id}
                      />
                    ))
                : Array.from({ length: 10 }).map((_, i) => (
                    <SongCard key={i} />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.div>

        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">Top Artists</h1>
          <p className="text-sm text-muted-foreground">
            Most searched artists.
          </p>
          <ScrollArea className="rounded-md mt-4">
            <div className="flex gap-4 pb-4">
              {latest.length > 0 && !loading
                ? [...new Set(latest.map((a) => a.artists.primary[0].id))].map(
                    (id) => (
                      <ArtistCard
                        key={id}
                        id={id}
                        image={
                          latest.find((a) => a.artists.primary[0].id === id)
                            .artists.primary[0].image[2]?.url ||
                          `https://az-avatar.vercel.app/api/avatar/?bgColor=0f0f0f0&fontSize=60&text=${
                            latest
                              .find((a) => a.artists.primary[0].id === id)
                              .artists.primary[0].name.split("")[0]
                              .toUpperCase() || "UN"
                          }`
                        }
                        name={
                          latest.find((a) => a.artists.primary[0].id === id)
                            .artists.primary[0].name
                        }
                      />
                    )
                  )
                : Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="grid gap-2">
                      <Skeleton className="h-[100px] w-[100px] rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.div>

        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">Trending Now</h1>
          <p className="text-sm text-muted-foreground">
            Most played songs in this week.
          </p>
          <ScrollArea className="rounded-md mt-4">
            <div className="flex gap-4 pb-4">
              {popular.length > 0 && !loading
                ? popular.map((song) => (
                    <SongCard
                      key={song.id}
                      id={song.id}
                      image={song.image[2].url}
                      title={song.name}
                      artist={song.artists.primary[0].name}
                    />
                  ))
                : Array.from({ length: 10 }).map((_, i) => (
                    <SongCard key={i} />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.div>
      </motion.div>
    </main>
  )
}
