export default function Loading() {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb] items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#e3dbfe] border-t-[#704ee7] rounded-full animate-spin mb-4"></div>
        <p className="text-[#64748b]">Loading achievements...</p>
      </div>
    </div>
  )
}
  