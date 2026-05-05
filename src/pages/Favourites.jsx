import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { QuoteCard } from "../components/quote/QuoteCard";
import { useSavedQuotes } from "../hooks/useSavedQuotes";

export const Favourites = () => {
  const { savedQuotes, loading } = useSavedQuotes();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
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

      {!loading && savedQuotes.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="No favourites yet"
            description="You haven't saved any quotes yet"
            actionLabel="Browse quotes"
            actionHref="/search"
          />
        </div>
      )}

      {!loading && savedQuotes.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
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

      {!loading && savedQuotes.length > 0 && (
        <div className="mt-6 text-sm text-neutral-500">
          Looking for more? <Link to="/search">Search quotes</Link>
        </div>
      )}
    </div>
  );
};
