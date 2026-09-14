"use client";
import MediaDisplay from "@/components/MediaDisplay";
import useSWR from "swr";

// Helper function to fetch JSON data from a URL (used with SWR to automatically fetch and cache data)
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  });

const MoviesPage = () => {
  // TMDB API URL to get a list of popular movies
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&sort_by=popularity.desc&page=1`;

  // Use SWR to fetch and cache the movies data
  const { data: moviesData, error, isLoading } = useSWR(apiUrl, fetcher);

  if (error) {
    return <div>Failed to load movies.</div>;
  }

  if (isLoading || !moviesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Pass movies data results to MediaDisplay component */}
      <MediaDisplay items={moviesData.results || []} />
    </div>
  );
};

export default MoviesPage;
