import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AlbumCard({ title, image, artist, id, desc, lang }) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 40 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 40 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
    const glareX = useTransform(x, [-300, 300], ["120%", "-20%"]);
    const glareY = useTransform(y, [-200, 200], ["120%", "-20%"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
    };
    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <Link href={`/${id}`}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transformStyle: "preserve-3d",
                    rotateX,
                    rotateY,
                }}
                className="relative h-fit w-[200px] cursor-pointer rounded-lg bg-black/20 backdrop-blur-sm border border-white/10"
            >
                <div
                    style={{
                        transform: "translateZ(40px)",
                    }}
                    className="overflow-hidden rounded-md p-4"
                >
                    {image ? (
                        <div className="relative group">
                            <img
                                src={image}
                                alt={title}
                                className="h-[150px] w-full bg-secondary/60 rounded-md"
                            />
                            <motion.div
                                style={{
                                    transform: "translateZ(20px)",
                                    background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4), transparent 40%)`,
                                }}
                                className="absolute inset-0"
                            />
                        </div>
                    ) : (
                        <Skeleton className="w-full h-[150px]" />
                    )}
                    <div className="mt-3">
                        {title ? (
                            <div>
                                <h1 className="text-base font-semibold truncate text-white">
                                    {title}
                                </h1>
                            </div>
                        ) : (
                            <Skeleton className="w-[70%] h-4 mt-2" />
                        )}
                        {desc && (
                            <p className="text-xs text-muted-foreground truncate">{desc}</p>
                        )}
                        {artist ? (
                            <div className="mt-1">
                                <p className="text-sm font-light text-white/60 truncate">
                                    {artist}
                                </p>
                                {lang && (
                                    <Badge
                                        variant="outline"
                                        className="font-normal mt-1 border-white/20 text-white/70"
                                    >
                                        {lang}
                                    </Badge>
                                )}
                            </div>
                        ) : (
                            <Skeleton className="w-10 h-2 mt-2" />
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}