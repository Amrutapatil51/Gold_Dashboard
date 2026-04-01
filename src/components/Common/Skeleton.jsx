import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind classes
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-slate-800/80 border border-slate-700/30", className)}
      {...props}
    />
  );
};

export default Skeleton;
