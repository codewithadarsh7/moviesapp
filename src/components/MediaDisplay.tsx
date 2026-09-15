import Card from "./Card";
import { Media } from "@/types/media";

interface MediaDisplayProps {
  items: Media[];
}

const MediaDisplay = ({ items }: MediaDisplayProps) => {
  if (items.length === 0) {
    return (
      <div className="bg-[#0d0d0f] border border-white/5 rounded-2xl mt-8 py-16 text-center text-gray-400">
        No results found.
      </div>
    );
  }

  return (
    <section className="bg-[#0d0d0f] border border-white/5 rounded-2xl mt-8 p-5 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 justify-items-center">
        {items.map((item) => (
          <Card key={item.id} media={item} />
        ))}
      </div>
    </section>
  );
};

export default MediaDisplay;
