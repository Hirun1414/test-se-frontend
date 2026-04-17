export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="skeleton w-full h-[400px] rounded-2xl mb-8" />
            <div className="skeleton h-9 w-64 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="skeleton h-4 w-28" />
                            <div className="skeleton h-4 w-40" />
                        </div>
                    ))}
                    <div className="skeleton h-8 w-36 mt-2" />
                </div>
                <div className="skeleton h-64 rounded-2xl" />
            </div>
        </main>
    );
}
