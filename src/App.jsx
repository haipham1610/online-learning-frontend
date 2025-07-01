import Auth from "./pages/auth/Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import ManaCourse from "./pages/admin/ManaCourse.jsx";
import AddCourse from "./pages/admin/AddCourse.jsx";
import EditCourse from "./pages/admin/EditCourse.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

// Component Dashboard đơn giản cho admin
const AdminDashboard = () => (
  <div>
    <h2 style={{ marginBottom: '16px' }}>Dashboard</h2>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '16px' 
    }}>
      <div style={{ 
        padding: '24px', 
        background: '#f0f2f5', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Tổng số khóa học</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>0</p>
      </div>
      <div style={{ 
        padding: '24px', 
        background: '#f0f2f5', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Học viên</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>0</p>
      </div>
      <div style={{ 
        padding: '24px', 
        background: '#f0f2f5', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Doanh thu tháng</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>0 VNĐ</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courseDetail" element={<CourseDetails />} />
        
        <Route path="manacourses" element={<ManaCourse />} />
        {/* Admin routes với layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<ManaCourse />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />
          <Route path="users" element={<div>Quản lý người dùng - Coming soon</div>} />
          <Route path="settings" element={<div>Cài đặt - Coming soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;