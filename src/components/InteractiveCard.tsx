'use client'

export default function InteractiveCard({ children, contentName }: { children: React.ReactNode; contentName: string }) {
    return (
        <div className="w-full bg-white rounded-xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] active:shadow-sm" style={{ boxShadow: 'var(--shadow-sm)' }}>
            {children}
        </div>
    );
}
