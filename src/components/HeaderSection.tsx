import React from "react";
import HeroSlider from "@/components/HeroSlider";

async function fetchTrendingMovies() {
  // get the api key
  const apikey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // fetch past week trending movies
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${apikey}`,
  );

  // if the request fails return an empty list
  if (!res.ok) return [];

  // convert the response to JSON and display only 5 movies from the results
  const data = await res.json();
  const movies = data.results ? data.results.slice(0, 5) : [];

  // fetch extra details for each movie
  const detailedMovies = await Promise.all(
    movies.map(async (movie: any) => {
      if (movie.media_type === "movie") {
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apikey}`,
        );

        // if details are fetched successfully add them to the movie
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          return {
            ...movie,
            genres: detailData.genres,
            runtime: detailData.runtime,
          };
        }
      }
      // if there is no extra data fetched return the movie as it is
      return movie;
    }),
  );
  // return the final list of movies with extra details
  return detailedMovies;
}

const HeaderSection = async () => {
  const movies = await fetchTrendingMovies();
  return <HeroSlider movies={movies} />;
};

export default HeaderSection;
