import Card from "./Card";
import { fetchMediaList } from "@/lib/tmdb";

const TopRatedTvSeries = async () => {
  const series = await fetchMediaList("/tv/top_rated", "tv");

  return (
    <section className="py-8 px-4 sm:px-8 md:px-20 bg-black text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
        Top Rated Series
      </h2>
      <div className="flex overflow-x-auto gap-14 pb-4">
        {series.length > 0 ? (
          series.map((item) => <Card key={item.id} media={item} />)
        ) : (
          <p className="text-gray-400">No Top Rated Series Found</p>
        )}
      </div>
    </section>
  );
};

export default TopRatedTvSeries;
