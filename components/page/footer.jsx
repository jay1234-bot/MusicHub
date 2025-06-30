import { Github, Twitter, Send } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
    return (
        <footer className="bg-background/50 backdrop-blur-lg mt-16 py-8 px-6 md:px-20 lg:px-32 border-t border-border/50">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4">
                    <Logo />
                    <p className="text-sm text-muted-foreground">
                        Discover and stream the best new music, curated with love for you.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <Link href="https://github.com/skrishan" target="_blank">
                            <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        </Link>
                        <Link href="https://twitter.com/skrishan" target="_blank">
                            <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        </Link>
                        <Link href="https://t.me/censored_politicss" target="_blank">
                            <Send className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        </Link>
                    </div>
                </div>
                <div className="md:col-start-3 flex flex-col gap-2">
                    <h3 className="font-semibold text-foreground">Explore</h3>
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/#trending"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Trending
                    </Link>
                    <Link
                        href="/#albums"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Albums
                    </Link>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-foreground">About</h3>
                    <Link
                        href="https://github.com/skrishan/MusicHub"
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Source Code
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        Made by Krishan
                    </p>
                </div>
            </div>
            <div className="mt-8 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} MusicHub. All Rights Reserved.</p>
            </div>
        </footer>
    )
}
