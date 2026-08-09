"use client"
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Header() {
    const pathname = usePathname(); // Using pathname to highlight the active navigation link

    // navigation links

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Movies", path: "/movies" },
        { name: "TV Series", path: "/tv-series" },
    ]

    return(
        <motion.header className="bg-transparent text-white w-full py-2 z-50 px-4 md:px-10 xl:px-36 absolute top-0 left-0"
        initial ={{opacity: 0}}
        animate ={{opacity: 1}}
        transition ={{duration: 0.5}}
        >

            {/* desktop design section} */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* Logo Section */}

                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link href= "/">
                        <span className="text-2xl md:text-xl lg:text-3xl font-bold text-amber-500">Topendraa</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <motion.div className="relative w-full md:w-1/3 md:mx-8 hidden md:block">
                    <input type="text" placeholder="Quick Search..." className="w-full px-4 py-1.5 lg:py-3 bg-white text-sm text-gray-500 focus:outline-none placeholder-gray-500 rounded-xl border border-gray-500 focus:border-white pr-10"/>
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-default">
                        <Search className="w-5 h-5 text-gray-500"/>
                    </button>
                </motion.div>

                {/* Navigation Links */}

                <nav className="hidden md:flex md:items-center md:space-x-6">
                    {
                        navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`text-xs sm:text-base font-medium relative text-white ${pathname === link.path ? 'text-white' : 'hover:text-white/80'}`}
                            >
                                {link.name}

                                {/* Underline animation for active link */}

                                {pathname === link.path && (
                                    <motion.span
                                        className="absolute left-0 bottom-0 w-full h-0.5 bg-amber-500"
                                        layoutId="underline"
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </Link>
                        ))
                    }
                </nav>
            </div>
        </motion.header>
    )
}