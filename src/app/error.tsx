"use client";

import React, { useEffect } from 'react';

export default function ErrorBoundaryFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-stone-50 border border-stone-200 rounded-2xl w-full min-h-[300px]">
      <h2 className="text-lg font-bold text-stone-900 mb-2">Something went wrong!</h2>
      <p className="text-sm text-stone-600 mb-4 max-w-sm text-center">
        An unexpected error occurred while loading this section of the tracker. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-stone-900 text-stone-100 font-medium text-sm rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
