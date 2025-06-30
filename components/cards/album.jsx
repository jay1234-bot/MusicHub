import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

export default function AlbumCard({ title, image, artist, id, desc, lang }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-fit w-[200px] cursor-pointer"
        >
            <Link href={`/${id}`}>
                <div className="overflow-hidden rounded-md">
                    {image ? (
                        <div className="relative group">
                            <img
                                src={image}
                                alt={title}
                                className="h-[182px] w-full bg-secondary/60 rounded-md transition-all duration-300 group-hover:brightness-75"
                            />
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
                        <div className="mt-1">
                            <p className="text-sm font-light text-muted-foreground truncate">
                                {artist}
                            </p>
                            {lang && (
                                <Badge variant="outline" className="font-normal mt-1">
                                    {lang}
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <Skeleton className="w-10 h-2 mt-2" />
                    )}
                </div>
            </Link>
        </motion.div>
    )
}