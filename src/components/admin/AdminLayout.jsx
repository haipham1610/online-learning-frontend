import React, { useState } from 'react';
import {
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Menu items cho sidebar
  const sidebarItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Quản lý khóa học',
      children: [
        {
          key: 'course-list',
          icon: <UnorderedListOutlined />,
          label: 'Danh sách khóa học',
          onClick: () => navigate('/admin/courses'),
        },
        {
          key: 'course-add',
          icon: <PlusOutlined />,
          label: 'Thêm khóa học',
          onClick: () => navigate('/admin/courses/add'),
        },
      ],
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
      onClick: () => navigate('/admin/users'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => navigate('/admin/settings'),
    },
  ];

  // Header menu items
  const headerItems = [
    {
      key: 'home',
      label: 'Trang chủ',
      onClick: () => navigate('/'),
    },
    {
      key: 'admin',
      label: 'Admin Panel',
    },
  ];

  // Tạo breadcrumb dựa trên đường dẫn hiện tại
  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [{ title: 'Admin', href: '/admin' }];

    if (pathSegments.includes('courses')) {
      breadcrumbItems.push({ title: 'Quản lý khóa học' });
      
      if (pathSegments.includes('add')) {
        breadcrumbItems.push({ title: 'Thêm khóa học' });
      } else if (pathSegments.includes('edit')) {
        breadcrumbItems.push({ title: 'Chỉnh sửa khóa học' });
      } else if (pathSegments.length === 2) {
        breadcrumbItems.push({ title: 'Danh sách khóa học' });
      }
    }

    return breadcrumbItems;
  };

  // Lấy selected keys cho menu
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes('/admin/courses/add')) return ['course-add'];
    if (path.includes('/admin/courses/edit')) return ['course-list'];
    if (path.includes('/admin/courses')) return ['course-list'];
    if (path.includes('/admin/users')) return ['users'];
    if (path.includes('/admin/settings')) return ['settings'];
    return ['dashboard'];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.includes('/admin/courses')) return ['courses'];
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            className="demo-logo" 
            style={{ 
              color: 'white', 
              fontSize: '18px', 
              fontWeight: 'bold',
              marginRight: '24px'
            }}
          >
            Admin Panel
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['admin']}
            items={headerItems}
            style={{ flex: 1, minWidth: 0 }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'white' }}>Xin chào, Admin</span>
          <Button 
            size="small" 
            onClick={() => navigate('/auth')}
          >
            Đăng xuất
          </Button>
        </div>
      </Header>

      <Layout>
        <Sider 
          width={250} 
          style={{ background: colorBgContainer }}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            defaultOpenKeys={getOpenKeys()}
            style={{ 
              height: '100%', 
              borderRight: 0,
              paddingTop: '16px'
            }}
            items={sidebarItems}
          />
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            items={getBreadcrumbItems()}
            style={{ margin: '16px 0' }}
          />

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;