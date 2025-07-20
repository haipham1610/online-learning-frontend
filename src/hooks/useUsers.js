import { useState, useEffect } from 'react';
import { UserService } from '../services/userService';

export const useUsers = (initialParams = {}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalRecords: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const [filters, setFilters] = useState({
        pageNumber: 1,
        pageSize: 10,
        searchTerm: '',
        role: null,
        status: null,
        sortBy: 'CreatedAt',
        isDescending: true,
        ...initialParams
    });

    const fetchUsers = async (params = filters) => {
        setLoading(true);
        setError(null);

        try {
            const response = await UserService.getUsers(params);

            if (response.success) {
                setUsers(response.data.data);
                setPagination({
                    totalRecords: response.data.totalRecords,
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages,
                    hasNextPage: response.data.hasNextPage,
                    hasPreviousPage: response.data.hasPreviousPage
                });
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const updateFilters = (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters); // ✅ chỉ setFilters, không fetch trực tiếp
    };

    const refresh = () => {
        fetchUsers(filters);
    };

    // ✅ Tự fetch mỗi khi filters thay đổi
    useEffect(() => {
        fetchUsers(filters);
    }, [filters]);

    return {
        users,
        loading,
        error,
        pagination,
        filters,
        updateFilters,
        refresh,
        fetchUsers
    };
};
