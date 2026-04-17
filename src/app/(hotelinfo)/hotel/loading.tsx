export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto px-4 pb-12">
            <div className="py-8 border-b border-gray-100 mb-6">
                <div className="skeleton h-9 w-48 mb-2" />
                <div className="skeleton h-4 w-72" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-full h-[360px] bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="skeleton w-full h-[52%]" style={{ borderRadius: 0 }} />
                        <div className="px-3 pt-3 flex flex-col gap-2">
                            <div className="skeleton h-5 w-4/5" />
                            <div className="skeleton h-4 w-2/5" />
                            <div className="skeleton h-5 w-1/3 mt-1" />
                        </div>
                        <div className="px-3 mt-3">
                            <div className="skeleton h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
