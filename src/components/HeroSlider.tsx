"use client";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import TrailerModal from "./TrailerModal";

// fetch data from the url and return it as JSON and throw error if the request fails

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch trailer");
    }
    return res.json();
  });

interface Movie {
  id: number;
  media_type: string;
  title?: string;
  name?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
}

interface HeroSliderProps {
  movies: Movie[];
}

const HeroSlider = ({ movies }: HeroSliderProps) => {
  const [currentSlide, setcurrentSlide] = useState(0); // state to track the current slide index
  const [swiperInstance, setswiperInstance] = useState<SwiperType | null>(null); // store swiper instance for controlling slide navigation
  const [isModalOpen, setIsModalOpen] = useState(false); // state to show or hide the trailer modal
  const [selectedMedia, setSelectedMedia] = useState<Movie | null>(null); // store the selected media to display its trailer

  // create a function to get the media title
  const getMediaTitle = (media: any) => {
    return media.media_type === "movie"
      ? media.title || "untitle"
      : media.name || "untitle";
  };

  // create a function to get the movie genres
  const getGenres = (media: any) => {
    if (
      media.media_type === "movie" &&
      media.genres &&
      media.genres.length > 0
    ) {
      return media.genres.map((g: any) => g.name).join(", ");
    }
    return "";
  };

  // create a function to format movie runtime into hours and minutes
  const formatDuration = (media: any) => {
    if (media.media_type === "movie" && media.runtime) {
      const h = Math.floor(media.runtime / 60);
      const m = media.runtime % 60;
      return `${h}h ${m}m`;
    }
    return "";
  };

  // handle navigation button clicks to switch to specified slide and update current slide state
  const handleButtonClick = (index: any) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
      setcurrentSlide(index);
    }
  };

  // fetch trailer videos for the selected media using SWR
  const { data: trailerData, error } = useSWR(
    selectedMedia
      ? `https://api.themoviedb.org/3/${selectedMedia.media_type}/${selectedMedia.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      : null,
    fetcher,
  );

  // find the first youtube trailer from the fetched videos
  const trailer = trailerData?.results?.find(
    (video: any) => video.site === "YouTube" && video.type === "Trailer",
  );

  // build the youtube embed URL for the trailer if it founds
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : null;

  // open the trailer modal and set the selected media
  const openModal = (media: any) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  // close the trailer modal and clear the selected media
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  console.log("MOVIES:", movies);
  console.log("FIRST MOVIE:", movies[0]);
  return (
    <section className="relative w-full min-w-0 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={movies.length > 1}
        slidesPerView={1}
        observer={true}
        observeParents={true}
        pagination={{
          clickable: true,
        }}
        onSlideChange={(swiper) => setcurrentSlide(swiper.realIndex)}
        onSwiper={(swiper) => setswiperInstance(swiper)}
        className="w-full max-w-full h-[670px] sm:h-full md:h-[670px]"
      >
        {/* map through movies to create a slide for each movie */}
        {movies.map((media: any) => (
          <SwiperSlide
            key={`${media.media_type}-${media.id}`}
            className="!w-full"
          >
            <div className="relative w-full h-full sm:h-[670px] md:h-[720px]">
              <div
                className="absolute inset-0 bg-cover bg-center bg-gray-900"
                style={{
                  backgroundImage: media.backdrop_path
                    ? `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path})`
                    : undefined,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
              <div className="absolute inset-0 flex items-center sm:items-end p-5 sm:p-5 md:p-20 text-white max-w-xs sm:max-w-md md:max-w-2xl">
                <div>
                  <Link
                    href={`/details?id=${media.id}&media_type=${media.media_type}`}
                  >
                    <h1 className="text-2xl sm:text-2xl md:text-5xl font-bold leading-tight sm:leading-snug">
                      {getMediaTitle(media)}
                    </h1>
                  </Link>
                  <p className="text-sm sm:text-sm md:text-lg mt-0.5 sm:mt-2 text-yellow-400 font-semibold sm:leading-5">
                    {getGenres(media)}
                  </p>
                  <p className="text-sm sm:text-sm md:text-lg mt-5 line-clamp-5 hidden sm:block sm:leading-5">
                    {media.overview || "No Description Available"}
                  </p>
                  <p className="text-sm sm:text-sm md:text-lg mt-5 sm:leading-5">
                    <span className="mr-4">
                      ⭐ {(media.vote_average ?? 0).toFixed(1)}
                    </span>
                    {media.media_type === "movie" && (
                      <>
                        <span className="mr-4">|</span>
                        <span>{formatDuration(media)}</span>
                      </>
                    )}
                  </p>
                  <button
                    onClick={() => openModal(media)}
                    disabled={!media.id}
                    className={`mt-5 sm:mt-8 inline-block bg-yellow-400 text-black px-4 py-2 sm:px-4 sm:py-2 md:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition text-sm sm:text-base md:text-base ${!media.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <TrailerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        trailerUrl={trailerUrl}
        title={selectedMedia ? getMediaTitle(selectedMedia) : "Trailer"}
      />
    </section>
  );
};

export default HeroSlider;
