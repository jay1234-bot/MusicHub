import Link from "next/link";
import { motion } from "framer-motion";

export default function ArtistCard({ image, name, id }) {
    return (
        <Link href={"/search/" + `${encodeURI(name.toLowerCase().split(" ").join("+"))}`}>
            <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2 cursor-pointer"
            >
                <div className="overflow-hidden rounded-full h-28 w-28 border-2 border-primary/10 hover:border-primary/30 transition-colors duration-300">
                    <img src={image} alt={name} className="w-full h-full object-cover"/>
                </div>
                <div className="mt-2 text-center">
                    <h1 className="text-sm font-semibold truncate max-w-[100px]">{name}</h1>
                </div>
            </motion.div>
        </Link>
    )
}
