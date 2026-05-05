import { useState } from "react";
import { QuoteCard } from "../components/quote/QuoteCard";
import { QuoteCardSkeleton } from "../components/quote/QuoteCardSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { useSearch } from "../hooks/useSearch";

export const Search = () => {
  const [query, setQuery] = useState("");
  const { results, loading, hasSearched } = useSearch(query);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm10 2-4.3-4.3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search quotes, authors, or topics"
          className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-sm text-neutral-700 shadow-sm focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
        />
      </div>

      {!hasSearched && !loading && (
        <p className="mt-8 text-center text-sm text-neutral-400">
          Search for a quote, author, or topic
        </p>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <QuoteCardSkeleton key={`skeleton-${index}`} />
          ))}

        {!loading &&
          results.length > 0 &&
          results.map((quote) => (
            <QuoteCard
              key={quote.sourceId}
              content={quote.content}
              author={quote.author}
              tags={quote.tags}
              sourceId={quote.sourceId}
            />
          ))}
      </div>

      {!loading && hasSearched && results.length === 0 && (
        <div className="mt-10">
          <EmptyState
            title="No quotes found"
            description="No quotes found for that search"
          />
        </div>
      )}
    </div>
  );
};
