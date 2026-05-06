import React from 'react';
import * as motion from 'motion/react-client';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 ${className}`}>
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="h-full w-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
      />
    </div>
  );
}

export function RoadmapCardSkeleton() {
  return (
    <div className="theme-card rounded-[3rem] p-10 space-y-10">
      <div className="flex items-start justify-between">
        <Skeleton className="h-20 w-20 rounded-3xl" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="pt-6 border-t theme-border flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}
