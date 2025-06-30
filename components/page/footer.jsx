import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full py-6 flex flex-col items-center justify-center bg-background/70 backdrop-blur-md border-t border-border/30 mt-12"
        >
            <p className="text-sm text-muted-foreground mb-1">
                Made with <span className="text-red-500">♥</span> by{' '}
                <Link
                    href="https://t.me/censored_politicss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary hover:text-primary/80 transition-colors"
                >
                    krishan
                </Link>
            </p>
            <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} krishanmusic
            </p>
        </motion.footer>
    );
}
