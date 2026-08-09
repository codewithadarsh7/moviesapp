"use client"
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const pathname = usePathname(); // Using pathname to highlight the active navigation link

    const [isMenuOpen, setIsMenuOpen] = useState(false) // state for control mobile menu

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

                    {/* mobile menu toggle button */}

                    <motion.button
                        className= "md:hidden text-white hover:text-white/80 cursor-pointer"
                        onClick= {() => setIsMenuOpen(!isMenuOpen)}
                        whileTap= {{ scale: 0.9 }}
                    >
                        {
                            isMenuOpen ? (
                                <X className="w-6 h-6"/>
                            ) : (
                                <Menu className="w-6 h-6"/>
                            )
                        }
                    </motion.button>
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

            {/* Mobile Menu */}
            <motion.div className={`md:hidden backdrop-blur-xs bg-[rgba(24,24,27,0.6)] z-50 absolute left-0 w-full px-4 py-4 ${ isMenuOpen ? 'block' : 'hidden' }`}
            initial = {{ opacity: 0, y: -20 }}
            animate = { isMenuOpen ? {opacity: 1, y: 0} : {opacity: 0, y: -20} }
            transition={{ duration: 0.3 }}
            >
                {/* Search bar */}
                <motion.div className="relative w-full mb-4">
                    <input type="text"
                        placeholder="Quick Search..."
                        className= "w-full px-4 py-2 bg-white text-gray-500 placeholder-gray-500 rounded-xl border border-gray-500 focus:outline-none focus:border-white pr-10"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                        <Search className="w-5 h-5 text-gray-500"/>
                    </button>
                </motion.div>
                
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-2 items-center">
                    {
                        navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="block text-white text-base font-medium hover:text-white/80"
                            >
                                {link.name}
                            </Link>
                        ))
                    }
                </nav>
            </motion.div>
        </motion.header>
    )
}