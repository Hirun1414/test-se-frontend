import ReviewLikeButtons from './ReviewLikeButtons';

export default function ReviewList({
    reviews,
    currentUserId,
    isAdmin = false,
}: {
    reviews?: ReviewItem[];
    currentUserId?: string | null;
    isAdmin?: boolean;
}) {
    if (!reviews || reviews.length === 0) {
        return (
            <section className="mt-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">รีวิวจากผู้ใช้งาน</h2>
                <p className="text-sm text-gray-500">ยังไม่มีรีวิวสำหรับโรงแรมนี้</p>
            </section>
        );
    }

    return (
        <section className="mt-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                รีวิวจากผู้ใช้งาน{' '}
                <span className="text-sm font-normal text-gray-400">({reviews.length})</span>
            </h2>
            <div className="space-y-4">
                {reviews.map((r) => {
                    const userId = r.user && typeof r.user === 'object' ? r.user._id : r.user as string;
                    const userName = r.user && typeof r.user === 'object' ? r.user.name : 'ผู้ใช้';
                    const initial = userName.charAt(0).toUpperCase();
                    const isOwnReview = currentUserId && userId === currentUserId;

                    return (
                        <article
                            key={r._id}
                            className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-sm font-semibold">
                                        {initial}
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">{userName}</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span
                                            key={s}
                                            className={`text-sm ${s <= r.score ? 'text-amber-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{r.comment}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(r.createdAt).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>

                            {/* Like/Dislike buttons — hidden on own review */}
                            {!isOwnReview && (
                                <ReviewLikeButtons
                                    reviewId={r._id}
                                    hotelId={r.hotel as string}
                                    initialLikes={(r.likes ?? []) as string[]}
                                    initialDislikes={(r.dislikes ?? []) as string[]}
                                    currentUserId={currentUserId ?? null}
                                    showDislikeCount={isAdmin}
                                />
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
