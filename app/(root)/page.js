"use client";
import { getHome, searchSong } from "@/lib/fetch";
import SongCard from "@/components/cards/song";
import AlbumCard from "@/components/cards/album";
import ArtistCard from "@/components/cards/artist";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function Home() {
  const [data, setData] = useState(null);
  const [hindiSongs, setHindiSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const homeRes = await getHome();
      const homeData = await homeRes.json();
      setData(homeData.data);

      const hindiRes = await searchSong("hindi");
      const hindiData = await hindiRes.json();
      setHindiSongs(hindiData.data.results);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="mb-32">
      <div className="flex justify-between items-center mb-8 px-6 md:px-20 lg:px-32">
        <h1 className="text-3xl font-bold">Listen Now</h1>
        <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
          <RotateCcw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="px-6 md:px-20 lg:px-32 space-y-12">
        {/* Top Hindi Songs */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Hindi Songs</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate={!loading ? "show" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {!loading && hindiSongs.length > 0
              ? hindiSongs.map((song) => (
                  <motion.div variants={item} key={song.id}>
                    <SongCard
                      id={song.id}
                      title={song.name}
                      artist={song.primaryArtists}
                      image={song.image[2].url}
                      data={hindiSongs}
                    />
                  </motion.div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-[250px] rounded-lg" />
                ))}
          </motion.div>
        </section>

        {/* Trending Songs */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Trending</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate={!loading ? "show" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {!loading && data?.trending.songs.length > 0
              ? data.trending.songs.map((song) => (
                  <motion.div variants={item} key={song.id}>
                    <SongCard
                      id={song.id}
                      title={song.name}
                      artist={song.primaryArtists}
                      image={song.image[2].url}
                      data={data.trending.songs}
                    />
                  </motion.div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-[250px] rounded-lg" />
                ))}
          </motion.div>
        </section>

        {/* Top Albums */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Albums</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate={!loading ? "show" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {!loading && data?.albums.length > 0
              ? data.albums.map((album) => (
                  <motion.div variants={item} key={album.id}>
                    <AlbumCard
                      id={album.id}
                      title={album.name}
                      artist={album.artists[0]?.name}
                      image={album.image[2].url}
                    />
                  </motion.div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-[250px] rounded-lg" />
                ))}
          </motion.div>
        </section>

        {/* Top Artists */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Artists</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate={!loading ? "show" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {!loading && data?.artists.length > 0
              ? data.artists.map((artist) => (
                  <motion.div variants={item} key={artist.id}>
                    <ArtistCard
                      id={artist.id}
                      name={artist.name}
                      image={artist.image[2].url}
                    />
                  </motion.div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-[250px] rounded-lg" />
                ))}
          </motion.div>
        </section>
      </div>
    </main>
  );
} 