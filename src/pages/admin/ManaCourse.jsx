import React, { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, [pagination.current]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/courses", {
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      });
      setCourses(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
      }));
    } catch (error) {
      message.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = async (courseId) => {
    try {
      await axios.post(`/api/courses/${courseId}/draft`);
      message.success("Course drafted successfully");
      fetchCourses();
    } catch (error) {
      message.error("Failed to draft course");
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: "10%",
    },
    { title: "Course Name", dataIndex: "courseName", width: "20%" },
    { title: "Description", dataIndex: "description", width: "30%" },
    {
      title: "Price (VNĐ)",
      dataIndex: "price",
      render: (price) => price.toLocaleString("vi-VN"),
      width: "17%",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (discount) => `${discount || 0}%`,
      width: "13%",
    },
    {
      title: "Language",
      dataIndex: "language",
      render: (language) => language?.languageName || "N/A",
      width: "15%",
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (level) => level?.levelName || "N/A",
      width: "15%",
    },
    {
      title: "Course Type",
      dataIndex: "courseCategories",
      render: (categories) =>
        categories?.map((cat) => cat.category.categoryName).join(", ") || "N/A",
      width: "18%",
    },
    { title: "Status", dataIndex: "status", width: "14%" },
    {
      title: "Actions",
      render: (_, record) => (
        <div>
          <Link to={`/manaCourses/edit/${record.courseId}`}>
            <Button type="primary" size="small" className="mr-2">
              ✏ Edit
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDraft(record.courseId)}
          >
            <Button danger size="small">
              ✏ Draft
            </Button>
          </Popconfirm>
        </div>
      ),
      width: "15%",
    },
  ];

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
    });
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50"> {/* Added padding to avoid overlap with fixed Header */}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">📚 Course List</h3>
            <Link to="/manaCourses/add">
              <Button type="primary">Create New Course</Button>
            </Link>
          </div>
          <Table
            columns={columns}
            dataSource={courses}
            rowKey="courseId"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: true }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CourseList;