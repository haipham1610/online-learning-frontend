import React, { useEffect, useState } from 'react';
import { getComments, bulkModerateComments, deleteComment, getCommentStatistics, moderateComment } from '../../services/commentApi';
import CommentTable from '../../components/admin/comments/CommentTable';
import CommentFilter from '../../components/admin/comments/CommentFilter';
import CommentStats from '../../components/admin/comments/CommentStats';
import BulkActionBar from '../../components/admin/comments/BulkActionBar';

const AdminCommentPage = () => {
    const [filters, setFilters] = useState({ page: 1, pageSize: 10 });
    const [data, setData] = useState({ data: [], totalRecords: 0 });
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState(null);
    const [selectedComments, setSelectedComments] = useState([]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await getComments(filters);
            // Xử lý response data structure
            setData(res.data.data || { data: [], totalRecords: 0 });
        } catch (err) {
            console.error('Error fetching comments', err);
            // Set empty data nếu có lỗi
            setData({ data: [], totalRecords: 0 });
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const res = await getCommentStatistics();
            setStatistics(res.data.data);
        } catch (err) {
            console.error('Error fetching statistics', err);
            // Set default statistics
            setStatistics({
                totalComments: 0,
                pendingCount: 0,
                approvedCount: 0,
                rejectedCount: 0,
                reportedCount: 0,
                mostActiveUser: 'N/A'
            });
        }
    };

    useEffect(() => {
        fetchComments();
        fetchStatistics();
    }, [filters]);

    const handleBulkModerate = async (action, commentIds = selectedComments) => {
        if (!commentIds || commentIds.length === 0) {
            alert('Please select comments to moderate');
            return;
        }

        try {
            console.log("📦 BULK MODERATE:", { action, commentIds });
            await bulkModerateComments({ commentIds: commentIds, action });

            await fetchComments();
            await fetchStatistics();
            setSelectedComments([]);

            alert(`Successfully ${action === 'approve' || action === 1 ? 'approved' : 'rejected'} ${commentIds.length} comments`);
        } catch (err) {
            console.error('❌ Bulk moderation failed:', err);
            alert('Bulk moderation failed. Please try again.');
        }
    };

    // ✅ FIX: Đổi thứ tự tham số để match với CommentTable
    const handleSingleModerate = async (action, commentIds) => {
        try {
            const commentId = Array.isArray(commentIds) ? commentIds[0] : commentIds;

            console.log("🔍 SINGLE MODERATE:", {
                action,
                commentIds,
                commentId,
                actionType: action === 1 ? 'approve' : action === 2 ? 'reject' : action
            });

            await moderateComment({
                commentId: commentId,
                action: action,
                reason: '' // hoặc có thể truyền message tùy use case
            });

            await fetchComments();
            await fetchStatistics();
            setSelectedComments(prev => prev.filter(id => id !== commentId));

            const actionText = action === 1 || action === 'approve' ? 'approved' : 'rejected';
            alert(`Comment ${actionText} successfully`);

        } catch (err) {
            console.error('❌ Single moderation failed:', err);
            alert(`Moderation failed: ${err.message || 'Please try again.'}`);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await deleteComment(commentId);

            // Refresh data
            await fetchComments();
            await fetchStatistics();

            // Remove from selection
            setSelectedComments(prev => prev.filter(id => id !== commentId));

            alert('Comment deleted successfully');
        } catch (err) {
            console.error('Delete failed', err);
            alert('Delete failed. Please try again.');
        }
    };

    const toggleSelectComment = (commentId, checked) => {
        if (commentId === 'all') {
            if (checked) {
                setSelectedComments(data.data?.map(comment => comment.commentId) || []);
            } else {
                setSelectedComments([]);
            }
        } else {
            if (checked) {
                setSelectedComments(prev => [...prev, commentId]);
            } else {
                setSelectedComments(prev => prev.filter(id => id !== commentId));
            }
        }
    };

    // Wrapper functions cho BulkActionBar
    const handleBulkApprove = () => handleBulkModerate(1); // Đổi từ 'approve' sang 1
    const handleBulkReject = () => handleBulkModerate(2);  // Đổi từ 'reject' sang 2
    const handleClearSelection = () => setSelectedComments([]);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-semibold">Manage Comments</h1>

            <CommentStats data={statistics} />

            <CommentFilter onChange={setFilters} />

            <BulkActionBar
                selectedCount={selectedComments.length}
                onApprove={handleBulkApprove}
                onReject={handleBulkReject}
                onClear={handleClearSelection}
            />

            <CommentTable
                data={data}
                loading={loading}
                onDelete={handleDelete}
                onModerate={handleSingleModerate}
                selected={selectedComments}
                toggleSelect={toggleSelectComment}
            />
        </div>
    );
};

export default AdminCommentPage;