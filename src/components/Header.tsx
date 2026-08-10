"use client"
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
    const pathname = usePathname(); // Using pathname to highlight the active navigation link

    const [isMenuOpen, setIsMenuOpen] = useState(false) // state for control mobile menu

    const [isSearchOpen, setIsSearchOpen] = useState(false) //state for control the search visibility

    const [searchTerm, setSearchTerm] = useState("") // state to store the search input value

    const [suggestions, setSuggestions] = useState([]) // state to store the search suggestion results

    const [isLoading, setIsLoading] = useState(false) // state to track loading status



    // navigation links

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Movies", path: "/movies" },
        { name: "TV Series", path: "/tv-series" },
    ]

    // fetch search suggestions from the TMDB based on input value
    const fetchSuggestions = async (query: string) => {

        // clear suggestions if query is empty or spaces
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        //show loading indicator before starting api call
        setIsLoading(true);

        try {

            //get TMDB API key from .env.local
            const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

            //build API URL with encoded query for safe URL fromatting
            const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

            // fetch search results without caching for fresh data
            const res = await fetch(url, { cache: "no-store" });

            if (res.ok) {

                //convert response to JSON
                const data = await res.json();

                //keep only movies and tv series, and set the limit to 5 results
                const filteredResults = data.results
                .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
                .slice(0, 5) || [];

                // update suggestions with filtered results
                setSuggestions(filteredResults);
            } else {

                // clear suggestions if API call fails
                setSuggestions([]);
            }
        } catch (err) {
            console.error(err);  // log error for debugging
            setSuggestions([]);  // clear suggestions on error
        } finally {

            // hide loading indicator after API call completes
            setIsLoading(false);
        }
    };

    // handle search button click behaviour
    const handleSearchClick = () => {

        // if search is open and suggestions exist, close search and reset 
        if (isSearchOpen) {
            setIsSearchOpen(false);
            setSearchTerm("");
            setSuggestions([]);
        } else if (searchTerm.trim()) {

            // if search term exists, open search, show search and fetch suggestions
            setIsSearchOpen(true);
            fetchSuggestions(searchTerm);
        }
    };

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
                    <input type="text" placeholder="Quick Search..." className="w-full px-4 py-1.5 lg:py-3 bg-white text-sm text-gray-500 focus:outline-none placeholder-gray-500 rounded-xl border border-gray-500 focus:border-white pr-10"
                    value= {searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSuggestions([]);
                        setIsSearchOpen(false); // close dropdown + revert icon to Search on any edi
                    }}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick= {handleSearchClick}>
                       {
                            isLoading ? (
                                // show loading spinner during API call
                                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"/>
                            ) : isSearchOpen ? (
                                // show close icon when search is open and suggestions exist
                                <X className="w-5 h-5 text-gray-500"/>
                            ) : (
                                // show search icon when search is closed or no suggestions exist
                                <Search className="w-5 h-5 text-gray-500"/>
                            )
                        }  
                    </button>

                    <AnimatePresence>
                        {
                            isSearchOpen && (
                                <motion.div className="absolute left-0 top-full mt-1 w-full bg-[#18181b] border border-gray-500 rounded-lg shadow-lg z-50"
                                initial = {{ opacity: 0, y: -10 }}
                                animate = {{ opacity: 1, y: 0 }}
                                exit = {{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                >
                                    {/* render loading, suggestions, or no results found message */}
                                    {
                                        isLoading ? (
                                            // show while API call is in progress
                                            <div className="p-4 text-sm text-gray-400 text-center">
                                                Searching...
                                            </div>

                                            // spinning animation

                                            // <div className="flex items-center justify-center py-4">
                                            //     <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"/>
                                            // </div>
                                        ) : suggestions.length > 0 ? (
                                            suggestions.map((item: any) => (
                                                <Link
                                                    key={`${item.media_type}-${item.id}`}
                                                    href= {"/"}
                                                >
                                                    <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer">
                                                        <Image src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/default_poster.jpg"} alt={item.name || item.title} width={32} height={48} 
                                                        className="w-8 aspect-2/3 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                        <h3 className="text-sm text-white line-clamp-2 h-10">
                                                            {item.title || item.name || "unnamed"}
                                                        </h3>
                                                        <p>
                                                            {(item.release_date || item.first_air_date)?.split("-")[0] || "N/A"}
                                                        </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (

                                            // No results found message
                                            <div className="p-2 text-sm text-gray-400 text-center">
                                                No Results Found
                                            </div>  
                                        )
                                    }
                                </motion.div> 
                            )
                        }
                    </AnimatePresence>
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
                {/* Mobile Search bar */}
                <motion.div className="relative w-full mb-4">
                    <input type="text"
                        placeholder="Quick Search..."
                        className= "w-full px-4 py-2 bg-white text-gray-500 placeholder-gray-500 rounded-xl border border-gray-500 focus:outline-none focus:border-white pr-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSuggestions([]);
                            setIsSearchOpen(false); // close dropdown + revert icon to Search on any edi
                        }}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleSearchClick}>
                        {
                            isLoading ? (
                                // show loading spinner during API call
                                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"/>
                            ) : isSearchOpen ? (
                                // show close icon when search is open and suggestions exist
                                <X className="w-5 h-5 text-gray-500"/>
                            ) : (
                                // show search icon when search is closed or no suggestions exist
                                <Search className="w-5 h-5 text-gray-500"/>
                            )
                        }
                    </button>
                    <AnimatePresence>
                        {
                            isSearchOpen && (
                                <motion.div className="absolute left-0 top-full mt-1 w-full bg-[#18181b] border border-gray-500 rounded-lg shadow-lg z-50"
                                initial = {{ opacity: 0, y: -10 }}
                                animate = {{ opacity: 1, y: 0 }}
                                exit = {{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                >
                                    {/* render loading, suggestions, or no results found message */}
                                    {
                                        isLoading ? (
                                            // show while API call is in progress
                                            <div className="p-4 text-sm text-gray-400 text-center">
                                                Searching...
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            suggestions.map((item: any) => (
                                                <Link
                                                    key={`${item.media_type}-${item.id}`}
                                                    href= {"/"}
                                                >
                                                    <div className="flex items-center gap-2 p-2 hover:bg-[#252525] rounded-lg cursor-pointer">
                                                        <Image src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/default_poster.jpg"} alt={item.name || item.title} width={32} height={48} 
                                                        className="w-8 aspect-2/3 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                        <h3 className="text-sm text-white line-clamp-2 h-10">
                                                            {item.title || item.name || "unnamed"}
                                                        </h3>
                                                        <p>
                                                            {(item.release_date || item.first_air_date)?.split("-")[0] || "N/A"}
                                                        </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (

                                            // No results found message
                                            <div className="p-2 text-sm text-gray-400 text-center">
                                                No Results Found
                                            </div>  
                                        )
                                    }
                                </motion.div> 
                            )
                        }
                    </AnimatePresence>
                </motion.div>
                
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-2 items-center">
                    {
                        navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setIsMenuOpen(false)}
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