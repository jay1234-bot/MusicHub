"use client";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useContext, useEffect } from "react";
import { MusicContext, NextContext } from "@/hooks/use-context";
import { IoPlay } from "react-icons/io5";
import { motion } from "framer-motion";

export default function SongCard({ title, image, artist, id, desc, data }) {
    const ids = useContext(MusicContext);
    const next = useContext(NextContext);
    const setLastPlayed = () => {
        localStorage.clear();
        localStorage.setItem("last-played", id);
        if(data) {
            next.setNext(data);
        }
    };
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-fit w-[200px] cursor-pointer"
            onClick={() => {
                ids.setMusic(id);
                setLastPlayed();
            }}
        >
            <div className="overflow-hidden rounded-md">
                {image ? (
                    <div className="relative group">
                        <img src={image} alt={title} className="h-[182px] w-full bg-secondary/60 rounded-md transition-all duration-300 group-hover:blur-sm" />
                        <div className="absolute z-10 bottom-2 left-2 bg-background/60 backdrop-blur-md rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <IoPlay className="w-5 h-5 dark:fill-white" />
                        </div>
                    </div>
                ) : (
                    <Skeleton className="w-full h-[182px]" />
                )}
            </div>
            <div className="mt-3">
                {title ? (
                    <div>
                        <h1 className="text-base font-semibold truncate">{title}</h1>
                    </div>
                ) : (
                    <Skeleton className="w-[70%] h-4 mt-2" />
                )}
                {desc && (
                    <p className="text-xs text-muted-foreground truncate">{desc}</p>
                )}
                {artist ? (
                    <p className="text-sm font-light text-muted-foreground truncate">
                        {artist}
                    </p>
                ) : (
                    <Skeleton className="w-10 h-2 mt-2" />
                )}
            </div>
        </motion.div>
    )
}
