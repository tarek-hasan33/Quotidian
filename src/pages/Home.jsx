import { QuoteCard } from "../components/quote/QuoteCard";
import { QuoteCardSkeleton } from "../components/quote/QuoteCardSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
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
    <div className="min-h-[calc(100vh-60px)] bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          Quote of the day
        </p>

        <div className="mt-4">
          {loading && <QuoteCardSkeleton />}
          {error && (
            <ErrorMessage
              title="Unable to load daily quote"
              description="Something went wrong while loading your daily quote."
              actionLabel="Try again"
              onAction={() => window.location.reload()}
            />
          )}
          {!loading && !error && quote && (
            <QuoteCard
              content={quote.content}
              author={quote.author}
              tags={quote.tags}
              sourceId={quote.id}
            />
          )}
        </div>

        <p className="mt-4 text-sm text-neutral-400">{formatToday()}</p>
      </div>
    </div>
  );
};
