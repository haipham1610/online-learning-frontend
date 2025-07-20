import React from 'react';
import CommentStatusTag from './CommentStatusTag';

const CommentTable = ({ data, loading, onDelete, onModerate, selected = [], toggleSelect }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading comments...</div>
            </div>
        );
    }

    if (!data?.data || data.data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-white border rounded-lg">
                No comments found
            </div>
        );
    }

    const isAllSelected = data.data.length > 0 && data.data.every(comment => selected.includes(comment.commentId));

    return (
        <div className="bg-white border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={(e) => toggleSelect('all', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Content
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lesson
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.data.map((comment) => (
                            <tr key={comment.commentId} className="hover:bg-gray-50">
                                <td className="px-3 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(comment.commentId)}
                                        onChange={(e) => toggleSelect(comment.commentId, e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                    {comment.userName}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                                    <div className="truncate" title={comment.content}>
                                        {comment.content}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-700">
                                    {comment.lessonName}
                                </td>
                                <td className="px-4 py-4 text-sm">
                                    <CommentStatusTag status={comment.status} />
                                </td>
                                <td className="px-4 py-4 text-sm text-center space-x-2">
                                    {comment.status !== 1 && (
                                        <button
                                            onClick={() => {
                                                console.log("🟢 APPROVE SINGLE COMMENT:", {
                                                    commentId: comment.commentId,
                                                    currentStatus: comment.status,
                                                    action: 1,
                                                    commentIds: [comment.commentId],
                                                    userName: comment.userName
                                                });
                                                onModerate(1, [comment.commentId]);
                                            }}
                                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {comment.status !== 2 && (
                                        <button
                                            onClick={() => {
                                                console.log("🔴 REJECT SINGLE COMMENT:", {
                                                    commentId: comment.commentId,
                                                    currentStatus: comment.status,
                                                    action: 2,
                                                    commentIds: [comment.commentId],
                                                    userName: comment.userName,
                                                    content: comment.content.substring(0, 50) + "..."
                                                });
                                                console.log("📞 Calling onModerate function with params:", 2, [comment.commentId]);
                                                onModerate(2, [comment.commentId]);
                                            }}
                                            className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination can be added here */}
            <div className="bg-gray-50 px-4 py-3 border-t">
                <div className="text-sm text-gray-700">
                    Showing {data.data.length} of {data.totalRecords} comments
                </div>
            </div>
        </div>
    );
};

export default CommentTable;