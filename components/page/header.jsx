"use client"
import { ModeToggle } from "../ModeToggle";
import Logo from "./logo";
import { Button } from "../ui/button";
import Search from "./search";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function Header() {
    const path = usePathname();
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
        >
            <div className="flex items-center justify-between w-full gap-4 p-4 md:px-20 lg:px-32">
                <div className="flex items-center gap-2">
                    <Logo />
                    <ModeToggle />
                </div>
                <div className="flex-1 flex justify-end sm:justify-center">
                    <div className="w-full max-w-md">
                        <Search />
                    </div>
                </div>
                {path !== "/" && (
                    <Button asChild>
                        <Link href="/" className="flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </Button>
                )}
            </div>
        </motion.header>
    )
}
