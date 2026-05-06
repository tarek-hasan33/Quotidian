import { useState } from "react";
import { QuoteCard } from "../components/quote/QuoteCard";
import { QuoteCardSkeleton } from "../components/quote/QuoteCardSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { useSearch } from "../hooks/useSearch";
import { useQuoteFeed } from "../hooks/useQuoteFeed";

const formatToday = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

const LoadMoreButton = ({ onClick, isLoading, disabled }) => (
  <button
    type="button"
    className="mt-6 w-full rounded-lg border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
    onClick={onClick}
    disabled={disabled}
  >
    {isLoading ? (
      <span className="flex items-center justify-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
        Loading...
      </span>
    ) : (
      "Load More"
    )}
  </button>
);

const SkeletonGrid = ({ count }) =>
  Array.from({ length: count }).map((_, i) => (
    <QuoteCardSkeleton key={`skeleton-${i}`} />
  ));

export const Search = () => {
  const [query, setQuery] = useState("");
  const isSearching = query.trim().length >= 2;

  const {
    results,
    loading: searchLoading,
    loadingMore: searchLoadingMore,
    error: searchError,
    hasSearched,
    hasMore: searchHasMore,
    loadMore: searchLoadMore,
  } = useSearch(query);

  const {
    quotes: feedQuotes,
    loading: feedLoading,
    loadingMore: feedLoadingMore,
    error: feedError,
    hasMore: feedHasMore,
    loadMore: feedLoadMore,
  } = useQuoteFeed();

  return (
    <div className="min-h-[calc(100vh-60px)] bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-10">

        {/* ── Search input ── */}
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
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quotes, authors, or topics"
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 pl-10 pr-10 text-sm text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400"
            aria-label="Search quotes"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6l-12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* ── Label row ── */}
        <div className="mt-4 flex items-center justify-between">
          {isSearching ? (
            <p className="text-xs text-neutral-400">
              Results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                Discover Quotes
              </p>
              <p className="text-xs text-neutral-400">{formatToday()}</p>
            </>
          )}
        </div>

        {/* ── SEARCH RESULTS ── */}
        {isSearching && (
          <div className="mt-6">
            {searchError && !searchLoading && (
              <ErrorMessage
                title="Search failed"
                description="Something went wrong while fetching search results."
              />
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {searchLoading && <SkeletonGrid count={5} />}

              {!searchLoading &&
                results.map((quote) => (
                  <QuoteCard
                    key={quote.sourceId}
                    content={quote.content}
                    author={quote.author}
                    tags={quote.tags}
                    sourceId={quote.sourceId}
                    showSave
                    showShare
                  />
                ))}

              {searchLoadingMore && <SkeletonGrid count={3} />}
            </div>

            {!searchLoading &&
              !searchError &&
              hasSearched &&
              results.length === 0 && (
                <div className="mt-10">
                  <EmptyState
                    title="No quotes found"
                    description={`No quotes found for "${query}"`}
                  />
                </div>
              )}

            {!searchLoading && searchHasMore && results.length > 0 && (
              <LoadMoreButton
                onClick={searchLoadMore}
                isLoading={searchLoadingMore}
                disabled={searchLoadingMore}
              />
            )}
          </div>
        )}

        {/* ── QUOTE FEED ── */}
        {!isSearching && (
          <div className="mt-6">
            {feedError && !feedLoading && (
              <div className="mb-6">
                <ErrorMessage
                  title="Unable to load quotes"
                  description="Something went wrong while loading the quote feed."
                  actionLabel="Try again"
                  onAction={() => window.location.reload()}
                />
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {feedLoading && <SkeletonGrid count={10} />}

              {!feedLoading &&
                feedQuotes.map((quote) => (
                  <QuoteCard
                    key={quote.id}
                    content={quote.content}
                    author={quote.author}
                    tags={quote.tags ?? []}
                    sourceId={quote.id}
                    showSave
                    showShare
                  />
                ))}

              {feedLoadingMore && <SkeletonGrid count={3} />}
            </div>

            {!feedLoading && feedHasMore && !feedError && (
              <LoadMoreButton
                onClick={feedLoadMore}
                isLoading={feedLoadingMore}
                disabled={feedLoadingMore}
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
};
