export default function SkeletonCard() {
  return (
    <div className="bg-[#121212] p-4 rounded-lg border border-[#3a2a22] animate-pulse">
      <div className="h-4 bg-zinc-700 rounded w-2/3 mb-3"></div>
      <div className="h-3 bg-zinc-800 rounded w-full mb-2"></div>
      <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
    </div>
  );
}