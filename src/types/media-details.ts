export interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface MediaDetails {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  runtime?: number;
  number_of_seasons?: number;
  genres?: { id: number; name: string }[];
  created_by?: { id: number; name: string }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

export interface Video {
  site: string;
  type: string;
  key: string;
}

export interface VideoResponse {
  results: Video[];
}