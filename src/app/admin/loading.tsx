export default function Loading() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="skeleton h-9 w-48 mb-6" />
            <div className="flex flex-col gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 items-center">
                        <div className="skeleton h-5 w-1/4" />
                        <div className="skeleton h-5 w-1/4" />
                        <div className="skeleton h-5 w-1/6" />
                        <div className="skeleton h-8 w-20 ml-auto rounded-lg" />
                    </div>
                ))}
            </div>
        </main>
    );
}
