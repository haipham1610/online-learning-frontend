import { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Upload, Card, Space, Row, Col } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5293";

function AddCourse() {
  const [form] = Form.useForm();
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null); // Single file to be uploaded
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [langRes, levelRes, catRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/Languages`),
          axios.get(`${API_BASE_URL}/api/Levels`),
          axios.get(`${API_BASE_URL}/api/Categories`),
        ]);
        setLanguages(
          langRes.data.map((lang) => ({
            value: lang.languageId,
            text: lang.languageName,
          }))
        );
        setLevels(
          levelRes.data.map((level) => ({
            value: level.levelId,
            text: level.levelName,
          }))
        );
        setCategories(
          catRes.data.map((cat) => ({
            value: cat.categoryId,
            text: cat.categoryName,
          }))
        );
      } catch (error) {
        console.error("Fetch Data Error:", error.response?.data || error.message);
        message.error("Không thể tải dữ liệu cần thiết để tạo khóa học.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUploadChange = ({ fileList }) => {
    // Since maxCount is 1, fileList will have at most 1 item
    if (fileList.length > 0) {
      setFile(fileList[0].originFileObj);
    } else {
      setFile(null);
    }
  };

  const beforeUpload = (newFile) => {
    // Prevent upload if a file is already selected
    if (file) {
      message.error("Bạn chỉ có thể tải lên tối đa 1 ảnh!");
      return Upload.LIST_IGNORE; // Prevent adding to fileList
    }

    // Validate file type
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const extension = newFile.name.slice(newFile.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      message.error(`File ${newFile.name} có định dạng không hợp lệ. Chỉ cho phép: ${allowedExtensions.join(", ")}`);
      return Upload.LIST_IGNORE;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (newFile.size > maxSize) {
      message.error(`File ${newFile.name} vượt quá giới hạn 10MB`);
      return Upload.LIST_IGNORE;
    }

    return true; // Allow upload
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("CourseName", values.courseName);
    formData.append("Description", values.description || "");
    formData.append("Creator", "Admin");
    formData.append("StudyTime", values.studyTime);
    if (values.languageId !== undefined && values.languageId !== null) {
      formData.append("LanguageID", values.languageId.toString());
    }
    if (values.levelId !== undefined && values.levelId !== null) {
      formData.append("LevelID", values.levelId.toString());
    }
    if (values.price !== undefined && values.price !== null) {
      formData.append("Price", values.price.toString());
    }
    if (Array.isArray(values.categoryId)) {
      values.categoryId.forEach((id) => formData.append("CategoryIDs", id.toString()));
    }
    if (file) {
      formData.append("AttachmentFiles", file);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/Courses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Tạo khóa học thành công");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Create Course Error:", error.response?.data || error.message);
      message.error("Tạo khóa học thất bại: " + (error.response?.data || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Prepare fileList for Ant Design Upload component
  const currentFileList = file ? [{
    uid: '1', // Unique ID for the file
    name: file.name,
    status: 'done',
    url: URL.createObjectURL(file),
    originFileObj: file,
  }] : [];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/courses")}>
            Quay lại
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>➕ Thêm khóa học mới</h2>
        <p style={{ margin: "4px 0 0 0", color: "#666" }}>Tạo khóa học mới cho hệ thống</p>
      </div>
      <Row gutter={24}>
        <Col xs={24} lg={24}>
          <Card title="📝 Thông tin khóa học">
            <Form form={form} onFinish={onFinish} layout="vertical" requiredMark={false}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div>
                  <Form.Item
                    label="Tên khóa học"
                    name="courseName"
                    rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
                  >
                    <Input placeholder="Nhập tên khóa học" />
                  </Form.Item>
                  <Form.Item label="Mô tả khóa học" name="description">
                    <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết về khóa học" />
                  </Form.Item>
                  <Form.Item
                    label="Thời gian học"
                    name="studyTime"
                    rules={[{ required: true, message: "Vui lòng nhập thời gian học" }]}
                  >
                    <Input placeholder="Ví dụ: 10 giờ" />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item label="Hình ảnh khóa học (Tối đa 1 ảnh)">
                    <Upload
                      listType="picture-card"
                      fileList={currentFileList}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      accept=".jpg,.jpeg,.png,.gif"
                      maxCount={1} // Limit to 1 file
                    >
                      {currentFileList.length < 1 && (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <Form.Item
                  label="Ngôn ngữ"
                  name="languageId"
                  rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ" }]}
                >
                  <Select placeholder="Chọn ngôn ngữ" allowClear>
                    {languages.map((lang) => (
                      <Select.Option key={lang.value} value={lang.value}>
                        {lang.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Cấp độ"
                  name="levelId"
                  rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
                >
                  <Select placeholder="Chọn cấp độ" allowClear>
                    {levels.map((level) => (
                      <Select.Option key={level.value} value={level.value}>
                        {level.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Danh mục"
                  name="categoryId"
                  rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                >
                  <Select placeholder="Chọn danh mục" mode="multiple" allowClear>
                    {categories.map((cat) => (
                      <Select.Option key={cat.value} value={cat.value}>
                        {cat.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <Form.Item
                  label="Giá khóa học (VNĐ)"
                  name="price"
                  rules={[{ required: true, message: "Vui lòng nhập giá khóa học" }]}
                >
                  <Input type="number" placeholder="0" min={0} />
                </Form.Item>
              </div>
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "24px",
                  borderTop: "1px solid #f0f0f0",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <Button type="primary" htmlType="submit" loading={submitting} size="large">
                  {submitting ? "Đang tạo..." : "Tạo khóa học"}
                </Button>
                <Button size="large" onClick={() => navigate("/admin/courses")}>
                  Hủy bỏ
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AddCourse;