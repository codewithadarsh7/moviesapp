export interface Genre {
  id: number;
  name: string;
}

export interface GenreListResponse {
  genres: Genre[];
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface YearRange {
  gte?: string;
  lte?: string;
}