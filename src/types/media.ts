export interface Media {
  id: number;
  media_type?: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  original_language?: string;
}

export interface TMDBListResponse {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
}