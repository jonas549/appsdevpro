export default function BlogPostLoading() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#07090F] pt-28 pb-14 px-6">
        <div className="max-w-[720px] mx-auto">
          <div className="h-4 w-20 bg-white/5 rounded mb-8 animate-pulse" />
          <div className="h-3 w-48 bg-white/5 rounded mb-5 animate-pulse" />
          <div className="h-10 w-full bg-white/5 rounded mb-3 animate-pulse" />
          <div className="h-10 w-4/5 bg-white/5 rounded mb-5 animate-pulse" />
          <div className="h-5 w-full bg-white/[0.03] rounded animate-pulse" />
        </div>
      </div>
      <div className="bg-[#FAFBFC] px-6 py-16">
        <div className="max-w-[720px] mx-auto space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-4 bg-slate-100 rounded animate-pulse ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
          ))}
          <div className="h-4 w-full bg-slate-100 rounded animate-pulse mt-8" />
          <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
