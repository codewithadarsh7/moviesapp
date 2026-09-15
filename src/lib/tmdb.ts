import { Media } from "@/types/media";

export async function fetchMediaList(
  endpoint: string,
  mediaType: "movie" | "tv",
  limit: number = 5,
): Promise<Media[]> {
  const apikey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${apikey}`,
    );

    if (!res.ok) return [];

    const data = await res.json();
    const results: Media[] = data.results ? data.results.slice(0, limit) : [];

    // TMDB doesn't include media_type on single-type endpoints (tv/*, movie/*),
    // only on mixed ones (trending/all, search/multi) — so stamp it ourselves
    // using the media_type the caller already knows, unless TMDB already sent one.
    return results.map((item) => ({
      ...item,
      media_type: item.media_type ?? mediaType,
    }));
  } catch {
    return [];
  }
}