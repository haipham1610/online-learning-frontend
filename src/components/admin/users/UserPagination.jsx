import React from 'react';

const UserPagination = ({ pagination, onPageChange }) => {
    const { pageNumber, totalPages } = pagination;

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];

        for (let i = Math.max(1, pageNumber - delta); i <= Math.min(totalPages, pageNumber + delta); i++) {
            range.push(i);
        }

        return range;
    };

    return (
        <div className="flex justify-end mt-6">
            <div className="inline-flex shadow-sm rounded overflow-hidden border">
                {/* Trước */}
                <button
                    onClick={() => onPageChange(pageNumber - 1)}
                    disabled={pageNumber === 1}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm flex items-center gap-1"
                >
                    ← Trước
                </button>

                {/* Trang số */}
                {getPageNumbers().map((num) => (
                    <button
                        key={num}
                        onClick={() => onPageChange(num)}
                        className={`px-3 py-2 text-sm border-l ${num === pageNumber
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'bg-white hover:bg-gray-100 text-gray-700'
                            }`}
                    >
                        {num}
                    </button>
                ))}

                {/* Sau */}
                <button
                    onClick={() => onPageChange(pageNumber + 1)}
                    disabled={pageNumber === totalPages}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-sm flex items-center gap-1 border-l"
                >
                    Sau →
                </button>
            </div>
        </div>
    );
};

export default UserPagination;
