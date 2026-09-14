import HeaderSection from "@/components/HeaderSection";
import TopRatedMovies from "@/components/TopRatedMovies";
import TopRatedTvSeries from "@/components/TopRatedTvSeries";
import TrendingMovies from "@/components/TrendingMovies";
import TrendingTvSeries from "@/components/TrendingTvSeries";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white min-w-0 w-full overflow-x-hidden">
      <HeaderSection />
      <TrendingMovies />
      <TopRatedMovies />
      <TrendingTvSeries />
      <TopRatedTvSeries />
    </div>
  );
}
