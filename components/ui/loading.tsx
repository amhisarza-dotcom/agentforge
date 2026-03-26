export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
    return (
          <div className="flex justify-center py-8">
                <div className={`animate-spin ${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full`} />
          </div>
        );
}

export function PageLoading() {
    return (
          <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                        <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-dark-400 text-sm">Loading...</p>
                </div>
          </div>
        );
}

export function CardSkeleton() {
    return (
          <div className="card animate-pulse">
                <div className="h-4 bg-dark-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-dark-700 rounded w-1/2 mb-2" />
                <div className="h-3 bg-dark-700 rounded w-2/3" />
          </div>
        );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="card animate-pulse flex items-center gap-4">
                              <div className="h-10 w-10 bg-dark-700 rounded-full" />
                              <div className="flex-1">
                                          <div className="h-4 bg-dark-700 rounded w-1/3 mb-2" />
                                          <div className="h-3 bg-dark-700 rounded w-1/2" />
                              </div>
                              <div className="h-6 w-16 bg-dark-700 rounded" />
                    </div>
                  ))}
          </div>
        );
}
}</div>
