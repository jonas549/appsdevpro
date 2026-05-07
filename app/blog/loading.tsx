export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#07090F]">
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-white/5 rounded-lg mb-4 animate-pulse" />
          <div className="h-12 w-80 bg-white/5 rounded-lg mb-12 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/[0.04] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 bg-white/5 rounded" />
                  <div className="h-6 w-full bg-white/5 rounded" />
                  <div className="h-6 w-3/4 bg-white/5 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded mt-2" />
                  <div className="h-4 w-5/6 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
