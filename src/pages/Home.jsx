import { QuoteCard } from "../components/quote/QuoteCard";
import { QuoteCardSkeleton } from "../components/quote/QuoteCardSkeleton";
import { useDailyQuote } from "../hooks/useDailyQuote";

const formatToday = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

export const Home = () => {
  const { quote, loading, error } = useDailyQuote();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs uppercase tracking-widest text-neutral-400">
        Quote of the day
      </p>

      <div className="mt-4">
        {loading && <QuoteCardSkeleton />}
        {error && (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
            Something went wrong while loading your daily quote.
          </div>
        )}
        {!loading && !error && quote && (
          <QuoteCard
            content={quote.content}
            author={quote.author}
            tags={quote.tags}
            sourceId={quote.sourceId}
          />
        )}
      </div>

      <p className="mt-4 text-sm text-neutral-400">{formatToday()}</p>
    </div>
  );
};
