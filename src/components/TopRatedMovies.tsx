import Card from "./Card";
import { fetchMediaList } from "@/lib/tmdb";

const TopRatedMovies = async () => {
  const movies = await fetchMediaList("/movie/top_rated", "movie");

  return (
    <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
        Top Rated Movies
      </h2>
      <div className="flex overflow-x-auto gap-14 pb-4">
        {movies.length > 0 ? (
          movies.map((movie) => <Card key={movie.id} media={movie} />)
        ) : (
          <p className="text-gray-400">No Top Rated Movies Found</p>
        )}
      </div>
    </section>
  );
};

export default TopRatedMovies;
