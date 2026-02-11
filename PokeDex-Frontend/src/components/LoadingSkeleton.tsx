

export const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-32 animate-pulse">
      <div className="bg-[#161B22]/40 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden min-h-[500px] flex flex-col md:flex-row">
        <div className="w-full md:w-[45%] bg-white/[0.02] flex items-center justify-center p-12 border-b md:border-b-0 md:border-r border-white/5">
          <div className="w-64 h-64 bg-white/5 rounded-3xl" />
        </div>
        <div className="flex-1 p-12 space-y-8">
          <div className="space-y-4">
            <div className="h-10 w-48 bg-white/5 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-white/5 rounded-full" />
              <div className="h-6 w-20 bg-white/5 rounded-full" />
            </div>
          </div>
          <div className="h-px w-full bg-white/5" />
          <div className="grid grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-2 w-12 bg-white/5 rounded" />
                <div className="h-1 w-full bg-white/5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
