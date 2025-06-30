import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ArtistCard({ image, name, id }) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 40 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 40 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
        <Link href={"/search/" + `${encodeURI(name.toLowerCase().split(" ").join("+"))}`}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transformStyle: "preserve-3d",
                    rotateX,
                    rotateY,
                }}
                className="flex flex-col items-center gap-2 cursor-pointer"
            >
                <div
                    style={{ transform: "translateZ(20px)" }}
                    className="overflow-hidden rounded-full h-28 w-28 border-2 border-primary/30"
                >
                    <img src={image} alt={name} className="w-full h-full object-cover"/>
                </div>
                <div
                    style={{ transform: "translateZ(40px)" }}
                    className="mt-2 text-center"
                >
                    <h1 className="text-sm font-semibold truncate max-w-[100px] text-white">{name}</h1>
                </div>
            </motion.div>
        </Link>
    )
}
