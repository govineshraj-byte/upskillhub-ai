"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center" role="alert">
      <h1 className="text-xl font-bold text-white">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
      >
        Try again
      </button>
    </div>
  );
}
