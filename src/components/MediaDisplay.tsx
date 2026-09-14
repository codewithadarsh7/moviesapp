interface MediaItem {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface MediaDisplayProps {
  items: MediaItem[];
}

const MediaDisplay = ({ items }: MediaDisplayProps) => {
  if (items.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg overflow-hidden shadow-md">
          {item.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="w-full h-72 bg-gray-200 flex items-center justify-center">
              No image
            </div>
          )}
          <div className="p-2">
            <h3 className="font-semibold text-sm truncate">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.release_date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaDisplay;
