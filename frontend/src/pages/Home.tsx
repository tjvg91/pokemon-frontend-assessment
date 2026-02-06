import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/Header';
import PokeCard from '@/components/PokeCard';
import { useWindowSize } from '@/hooks';
import type { Pokemon } from '@/types';

const DEBOUNCE_MS = 300;
const API_URL = import.meta.env.VITE_API_URL;

function fetchPokemons(): Promise<Pokemon[]> {
  return fetch(`${API_URL}/pokemons`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch pokemons');
    return res.json() as Promise<Pokemon[]>;
  });
}

function filterBySearch(
  list: Pokemon[],
  searchStr: string,
) {
  if (!searchStr.trim()) return list;
  const term = searchStr.trim().toLowerCase();
  return list.filter((pokemon) => pokemon.name.toLowerCase().includes(term));
}

const FILTER_ICON_MAX_WIDTH = 439;

type HpCategory = 'red' | 'orange' | 'green';

const HP_CATEGORIES: { id: HpCategory; label: string; min: number; max: number }[] = [
  { id: 'red', label: 'Low', min: 0, max: 50 },
  { id: 'orange', label: 'Medium', min: 51, max: 80 },
  { id: 'green', label: 'High', min: 81, max: Infinity },
];

function filterByHpCategory(list: Pokemon[], categories: Set<HpCategory>): Pokemon[] {
  if (categories.size === 0) return list;
  return list.filter((p) =>
    HP_CATEGORIES.some(
      (cat) => categories.has(cat.id) && p.hp >= cat.min && p.hp <= cat.max
    )
  );
}

const Home = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filterAccordionOpen, setFilterAccordionOpen] = useState(false);
  const [hpCategories, setHpCategories] = useState<Set<HpCategory>>(new Set());
  const [debouncedSearch] = useDebounce(searchInput, DEBOUNCE_MS);
  const { width } = useWindowSize();
  const showFilterIcon = width <= FILTER_ICON_MAX_WIDTH;

  const { data: pokemons, isLoading, error } = useQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
  });

  const toggleHpCategory = (cat: HpCategory) => {
    setHpCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setHpCategories(new Set());
  };

  const hasActiveFilters = searchInput.trim() !== '' || hpCategories.size > 0;

  const filteredPokemons = useMemo(() => {
    let list = filterBySearch(pokemons ?? [], debouncedSearch);
    list = filterByHpCategory(list, hpCategories);
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [pokemons, debouncedSearch, hpCategories]);

  return (
    <div>
      <Header />
      <main className="flex flex-col items-center gap-4 p-4">
        <div className="flex w-full max-w-md flex-col items-center gap-0 mt-5">
          <label className="relative flex w-full items-center rounded-lg border-2 border-blue-800 focus-within:ring-1 focus-within:ring-blue-800">
            <FontAwesomeIcon
              icon={faSearch}
              className="pointer-events-none absolute left-3 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Pokemons…"
              className="w-full rounded-lg border-0 bg-transparent py-2 pl-9 pr-20 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-0"
              aria-label="Search Pokemons"
            />
            <button
              type="button"
              onClick={() => setFilterAccordionOpen((prev) => !prev)}
              className="absolute right-3 flex items-center gap-1 text-blue-800 hover:text-blue-600 outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-1 rounded"
              aria-expanded={filterAccordionOpen}
              aria-label="Toggle filter options"
            >
              {showFilterIcon ? (
                <FontAwesomeIcon icon={faFilter} aria-hidden />
              ) : (
                <span className="text-sm font-medium">Filter</span>
              )}
              <FontAwesomeIcon
                icon={filterAccordionOpen ? faChevronUp : faChevronDown}
                className="text-xs"
                aria-hidden
              />
            </button>
          </label>
          {filterAccordionOpen && (
            <div
              className="w-full overflow-hidden rounded-lg border-2 border-blue-800 bg-white/95 px-4 py-3"
              role="region"
              aria-label="Additional filter options"
            >
              <p className="text-sm font-medium text-blue-800 mb-2">HP category</p>
              <div className="flex flex-row gap-2 text-sm text-blue-800">
                {HP_CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={hpCategories.has(cat.id)}
                      onChange={() => toggleHpCategory(cat.id)}
                      className="accent-blue-800 rounded border-blue-800"
                    />
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        cat.id === 'red'
                          ? 'bg-red-500'
                          : cat.id === 'orange'
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                      }`}
                      aria-hidden
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-3 w-full rounded border border-blue-800 bg-transparent py-2 text-sm font-medium text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-1"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
        {isLoading && <p className="text-blue-800">Loading pokemons…</p>}
        {error && (
          <p className="text-red-600" role="alert">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
        )}
        {filteredPokemons != null && filteredPokemons.length > 0 && (
          <div className="w-full max-w-6xl gap-4 max-[439px]:grid max-[439px]:grid-cols-1 min-[440px]:flex min-[440px]:flex-wrap min-[440px]:justify-center">
            {filteredPokemons.map((pokemon) => (
              <PokeCard pokemon={pokemon} key={pokemon.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
