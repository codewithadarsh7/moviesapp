"use client";
import { Media } from "@/types/media";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import TrailerModal from "./TrailerModal";
import { FaYoutube } from "react-icons/fa";

interface CardProps {
  media: Media;
}

interface Video {
  site: string;
  type: string;
  key: string;
}

interface TrailerResponse {
  results: Video[];
}

// helper function to fetch JSON data from URL (used with SWR to automatically fetch and cache data)
const fetcher = (url: string): Promise<TrailerResponse> =>
  fetch(url).then((res) => {
    if (res.status === 404) return { results: [] }; // ID mismatch or no videos indexed — not fatal
    if (!res.ok) throw new Error("failed to fetch trailer");
    return res.json();
  });

const Card = ({ media }: CardProps) => {
  const {
    id,
    poster_path: posterPath,
    title,
    name,
    vote_average: voteAverage,
    media_type: mediaType = "movie",
  } = media || {};

  const displayTitle = title || name || "Untitled";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: trailerData, error } = useSWR<TrailerResponse>(
    id
      ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      : null,
    fetcher,
  );

  const trailer = trailerData?.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : null;

  const openModal = () => {
    if (trailerUrl) setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex-none w-40 sm:w-48 md:w-56 min-w-[280px] max-w-[284px] bg-[#18181b] rounded-lg overflow-hidden shadow-lg snap-start">
      <Link href={`/details?id=${id}&media_type=${mediaType}`}>
        <div className="relative aspect-[2/3] group cursor-pointer">
          <Image
            src={
              posterPath
                ? `https://image.tmdb.org/t/p/w500${posterPath}`
                : "/default_poster.jpg"
            }
            alt=""
            fill
            className="object-cover rounded-t-lg group-hover:brightness-95 transition-all"
            sizes="33vw"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-xs sm:text-sm text-yellow-400">
          ⭐{voteAverage?.toFixed(1) || "N/A"}
        </p>
        <Link href={`/details?id=${id}&media_type=${mediaType}`}>
          <h3 className="text-base sm:text-lg my-1 font-semibold text-white line-clamp-2 h-12 sm:h-14 cursor-pointer hover:underline">
            {displayTitle}
          </h3>
        </Link>
        <button
          onClick={openModal}
          disabled={!trailerUrl}
          className={`flex items-center justify-center gap-1 w-full py-2 bg-[#18181b] text-white font-bold border border-gray-600 rounded-4xl hover:bg-[#252525] transition-colors text-sm sm:text-base ${!trailerUrl ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <FaYoutube className="text-red-600" size={20} />
          Trailer
        </button>
      </div>
      <TrailerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        trailerUrl={trailerUrl}
        title={displayTitle}
      />
    </div>
  );
};

export default Card;
