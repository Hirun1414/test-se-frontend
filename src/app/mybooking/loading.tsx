export default function Loading() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="skeleton h-9 w-48 mb-6" />
            <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4">
                        <div className="skeleton w-28 h-24 rounded-lg flex-shrink-0" />
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="skeleton h-5 w-48" />
                            <div className="skeleton h-4 w-32" />
                            <div className="skeleton h-4 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
