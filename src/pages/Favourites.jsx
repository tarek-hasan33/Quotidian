import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { QuoteCard } from "../components/quote/QuoteCard";
import { useSavedQuotes } from "../hooks/useSavedQuotes";

export const Favourites = () => {
  const { savedQuotes, loading, error } = useSavedQuotes();

  return (
    <div className="w-full overflow-x-hidden min-h-[calc(100vh-60px)] bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Your favourites
          </h1>
          <span className="text-sm text-neutral-500">
            {savedQuotes.length} saved
          </span>
        </div>

        {loading && (
          <p className="mt-6 text-sm text-neutral-500">Loading quotes...</p>
        )}

        {!loading && error && (
          <div className="mt-6">
            <ErrorMessage
              title="Unable to load favourites"
              description="Something went wrong while loading your saved quotes."
            />
          </div>
        )}

        {!loading && !error && savedQuotes.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="No favourites yet"
              description="You haven't saved any quotes yet"
              actionLabel="Browse quotes"
              actionHref="/feed"
            />
          </div>
        )}

        {!loading && !error && savedQuotes.length > 0 && (
          <div className="mt-8 grid items-stretch gap-4 sm:gap-6 md:grid-cols-2">
            {savedQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                content={quote.content}
                author={quote.author}
                tags={quote.tags ?? []}
                sourceId={quote.source_id}
                showSave
                showShare
              />
            ))}
          </div>
        )}

        {!loading && !error && savedQuotes.length > 0 && (
          <div className="mt-6 text-sm text-neutral-500">
            Looking for more?{" "}
            <Link
              to="/feed"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Search quotes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
