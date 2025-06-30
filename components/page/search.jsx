"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Search() {
    const [query, setQuery] = useState("");
    const linkRef = useRef();
    const inpRef = useRef();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query) return;
        linkRef.current.click();
        inpRef.current.blur();
        setIsExpanded(false);
    };

    const expand = {
        hidden: { width: 0, opacity: 0 },
        visible: {
            width: "100%",
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 },
        },
    };

    return (
        <div className="flex items-center justify-end w-full">
            <Link href={"/search/" + query} ref={linkRef} className="hidden"></Link>
            <AnimatePresence>
                {isExpanded ? (
                    <motion.form
                        key="form"
                        variants={expand}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onSubmit={handleSubmit}
                        className="relative z-10 w-full flex items-center"
                    >
                        <Input
                            ref={inpRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoComplete="off"
                            type="search"
                            name="query"
                            placeholder="Search songs, artists, albums..."
                            className="w-full pl-4 pr-10 py-2 rounded-full bg-background/50 backdrop-blur-sm border-2 border-transparent focus:border-primary/50 transition-all"
                        />
                        <Button
                            variant="ghost"
                            type="submit"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            <SearchIcon className="w-4 h-4" />
                        </Button>
                    </motion.form>
                ) : (
                    <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(true)}
                        >
                            <SearchIcon className="w-5 h-5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
