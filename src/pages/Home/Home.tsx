import { HomePostType } from "@/actions/home/home-action";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Home = () => {
    const [data, _] = React.useState<HomePostType[] | null>(null);
    const [commentInputs, setCommentInputs] = React.useState<Record<number, string>>({});

    React.useEffect(() => {
        const getData = async () => {
            try {

            } catch (err) {
                console.error(err);
            }
        };
        getData();
    }, []);

    const handleCommentChange = (postId: number, value: string) => {
        setCommentInputs(prev => ({ ...prev, [postId]: value }));
    };

    const handleCommentSubmit = async (postId: number) => {
        const content = commentInputs[postId];
        if (!content) return;

        try {


            setCommentInputs(prev => ({ ...prev, [postId]: "" }));
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };





    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-8">
            {data?.map(post => (
                <div key={post.id} className="bg-white shadow rounded-lg p-5">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                            {post.user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{post.user?.username ?? post.author}</p>
                            <p className="text-sm text-gray-400">
                                Posted {dayjs(post.created_at).format("MMMM D, YYYY h:mm A")}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-4 space-y-2">
                        <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
                        <p className="text-gray-700">{post.content}</p>
                    </div>

                    {/* Reactions */}
                    <div className="flex items-center mt-4 text-sm text-gray-500 gap-3">
                        <button
                            className="flex items-center gap-1 hover:text-blue-600 transition"

                        >
                            👍 {post.reactions?.length ?? 0} Likes
                        </button>
                        <span>💬 {post.comments?.length ?? 0} Comments</span>
                    </div>


                    {/* Comments */}
                    <div className="mt-4">
                        <p className="font-semibold text-sm mb-1 text-gray-600">Comments</p>
                        <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-1">
                            {post.comments?.map(comment => (
                                <div key={comment.id} className="flex gap-2 items-start">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                        {comment.user?.username?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div className="bg-gray-100 p-2 rounded-md w-full">
                                        <p className="font-medium text-gray-800">{comment.user?.username ?? "User"}</p>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Comment */}
                        <div className="flex gap-2 mt-3">
                            <input
                                className="flex-1 border p-2 rounded text-sm bg-gray-50 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Write a comment..."
                                value={commentInputs[post.id] || ""}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
                                onClick={() => handleCommentSubmit(post.id)}
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;
