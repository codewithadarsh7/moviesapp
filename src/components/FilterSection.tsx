"use client";

import { Genre, Language } from "@/types/tmdb";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

interface FilterSectionProps {
  genres?: Genre[];
  languages?: Language[];
  placeholder: string;
}

interface Filters {
  genre: string;
  year: string;
  rating: string;
  language: string;
  sortBy: string;
  query: string;
  [key: string]: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: DropdownOption[];
}

function Dropdown({ label, name, value, onChange, options }: DropdownProps) {
  return (
    <div>
      <label className="block mb-1.5 text-xs text-gray-400">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl bg-[#1c1c1e] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/60 transition"
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FaChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
      </div>
    </div>
  );
}

const FilterSection = ({
  genres = [],
  languages = [],
  placeholder,
}: FilterSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<Filters>({
    genre: "",
    year: "",
    rating: "",
    language: "",
    sortBy: "",
    query: "",
  });

  // sync filter state with URL query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters((prev) => ({
      ...prev,
      genre: params.get("genre") || "",
      year: params.get("year") || "",
      rating: params.get("rating") || "",
      language: params.get("language") || "",
      sortBy: params.get("sortBy") || "",
      query: params.get("query") || "",
    }));
  }, []); // empty dependency array to run once on mount

  // handle changes to filter inputs and update state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value })); // update specific filter field
  };

  // handle search button click to update URL with filter values via Next's router
  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value); // add non-empty filter values to URL
    });
    params.set("page", "1"); // reset to page 1 for new filter results
    router.push(`${pathname}?${params.toString()}`);
  };

  // define static filter options for years, rating, and sortBy
  const filterOptions = {
    years: ["2025", "2024", "2020-now", "2010-2019", "2000-2009", "1990-1999"],
    ratings: ["9", "8", "7", "6", "5", "4", "3", "2", "1"],
    sortBy: [
      { label: "Most Popular", value: "popularity.desc" },
      { label: "Newest", value: "release_date.desc" },
      { label: "Oldest", value: "release_date.asc" },
      { label: "Top Rated", value: "vote_average.desc" },
    ],
  };

  return (
    <section className="bg-[#0d0d0f] border border-white/5 rounded-2xl p-5 sm:p-6 mt-20">
      {/* search input */}
      <div className="mb-5">
        <label className="block mb-1.5 text-xs text-gray-400">Search</label>
        <div className="relative">
          <input
            type="text"
            name="query"
            placeholder={placeholder}
            autoComplete="off"
            value={filters.query}
            onChange={handleChange}
            className="w-full rounded-xl bg-[#1c1c1e] border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 transition"
          />
          <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        </div>
      </div>

      {/* filter dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Dropdown
          label="Genre"
          name="genre"
          value={filters.genre}
          onChange={handleChange}
          options={genres.map((g) => ({ label: g.name, value: String(g.id) }))}
        />
        <Dropdown
          label="Year"
          name="year"
          value={filters.year}
          onChange={handleChange}
          options={filterOptions.years.map((y) => ({ label: y, value: y }))}
        />
        <Dropdown
          label="Rating"
          name="rating"
          value={filters.rating}
          onChange={handleChange}
          options={filterOptions.ratings.map((r) => ({
            label: `${r}+`,
            value: r,
          }))}
        />
        <Dropdown
          label="Language"
          name="language"
          value={filters.language}
          onChange={handleChange}
          options={languages.map((l) => ({
            label: l.english_name,
            value: l.iso_639_1,
          }))}
        />
        <Dropdown
          label="Sort By"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          options={filterOptions.sortBy}
        />
      </div>

      {/* search button */}
      <button
        onClick={handleSearch}
        className="mt-5 w-full rounded-xl bg-yellow-400 text-black font-semibold py-2.5 hover:bg-yellow-500 active:bg-yellow-600 transition"
      >
        Search
      </button>
    </section>
  );
};

export default FilterSection;
