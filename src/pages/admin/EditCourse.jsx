import { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Upload, Card, Space, Row, Col } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5293";

function EditCourse() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]); // Files to be uploaded
  const [existingImageFiles, setExistingImageFiles] = useState([]); // Existing images as Ant Design file objects
  const [removedImageUrls, setRemovedImageUrls] = useState([]); // URLs of images to be removed
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, langRes, levelRes, catRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/Courses/${id}`),
          axios.get(`${API_BASE_URL}/api/Languages`),
          axios.get(`${API_BASE_URL}/api/Levels`),
          axios.get(`${API_BASE_URL}/api/Categories`),
        ]);

        const courseData = {
          courseName: courseRes.data.courseName,
          description: courseRes.data.description,
          creator: courseRes.data.creator,
          studyTime: courseRes.data.studyTime,
          languageId: courseRes.data.languageID,
          levelId: courseRes.data.levelID,
          price: courseRes.data.currentPrice,
          categoryId: courseRes.data.categoryIDs,
          status: courseRes.data.status,
        };
        form.setFieldsValue(courseData);

        // Convert existing image URLs to Ant Design file objects with full backend URL
        const initialExistingFiles = (courseRes.data.imageUrls || []).map((url, index) => ({
          uid: `existing-${index}-${url}`,
          name: url.substring(url.lastIndexOf("/") + 1),
          status: "done",
          url: `${API_BASE_URL}${url}`,
        }));
        setExistingImageFiles(initialExistingFiles);

        setLanguages(
          langRes.data.map((lang) => ({
            value: lang.languageId,
            text: lang.languageName,
          })),
        );
        setLevels(
          levelRes.data.map((level) => ({
            value: level.levelId,
            text: level.levelName,
          })),
        );
        setCategories(
          catRes.data.map((cat) => ({
            value: cat.categoryId,
            text: cat.categoryName,
          })),
        );
      } catch (error) {
        console.error("Fetch Data Error:", error.response?.data || error.message);
        message.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form]);

  const handleUploadChange = ({ fileList }) => {
    // Calculate total files (existing + new) excluding removed files
    const totalFiles = fileList.filter((f) => f.status !== "removed").length;

    // Prevent adding more than 4 files
    if (totalFiles > 4) {
      message.error("Bạn chỉ có thể tải lên tối đa 4 ảnh!");
      return;
    }

    // Filter out existing files that were removed
    const currentExistingFiles = fileList.filter((f) => f.uid.startsWith("existing-") && f.status !== "removed");
    setExistingImageFiles(currentExistingFiles);

    // Filter out new files that are not yet uploaded
    const newFiles = fileList
      .filter((f) => !f.uid.startsWith("existing-") && f.status !== "removed")
      .map((f) => f.originFileObj)
      .filter((f) => f);
    setFiles(newFiles);

    // Track removed existing files
    const removedUrls = fileList
      .filter((f) => f.status === "removed" && f.uid.startsWith("existing-"))
      .map((f) => f.url.replace(API_BASE_URL, ""));
    setRemovedImageUrls(removedUrls);
  };

  const beforeUpload = (file, fileList) => {
    // Calculate current total files (existing + new, excluding removed)
    const currentTotalFiles = [
      ...existingImageFiles.filter((f) => f.status !== "removed"),
      ...files,
      ...fileList,
    ].length;

    // Check if adding new files exceeds the limit
    if (currentTotalFiles > 4) {
      message.error("Bạn chỉ có thể tải lên tối đa 4 ảnh!");
      return false; // Prevent upload
    }

    // Validate file type
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      message.error(`File ${file.name} có định dạng không hợp lệ. Chỉ cho phép: ${allowedExtensions.join(", ")}`);
      return false; // Prevent upload
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error(`File ${file.name} vượt quá giới hạn 10MB`);
      return false; // Prevent upload
    }

    return true; // Allow upload
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    const formData = new FormData();

    formData.append("CourseName", values.courseName);
    formData.append("Description", values.description || "");
    formData.append("StudyTime", values.studyTime);
    formData.append("Status", values.status.toString());

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

    // Append newly selected files
    files.forEach((file) => formData.append("AttachmentFiles", file));

    // Append URLs of images to be removed
    removedImageUrls.forEach((url) => formData.append("RemovedImageUrls", url));

    try {
      await axios.put(`${API_BASE_URL}/api/Courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Cập nhật khóa học thành công");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Update Course Error:", error.response?.data || error.message);
      message.error("Cập nhật khóa học thất bại: " + (error.response?.data || error.message));
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

  const allFiles = [
    ...existingImageFiles,
    ...files.map((file, index) => ({
      uid: `new-${index}-${file.name}`,
      name: file.name,
      status: "done",
      url: URL.createObjectURL(file),
      originFileObj: file,
    })),
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/courses")}>
            Quay lại
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "bold" }}>✏️ Chỉnh sửa khóa học</h2>
        <p style={{ margin: "4px 0 0 0", color: "#666" }}>Cập nhật thông tin khóa học</p>
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
                    label="Người tạo"
                    name="creator"
                    rules={[{ required: true, message: "Vui lòng nhập tên người tạo" }]}
                  >
                    <Input placeholder="Nhập tên người tạo" />
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
                  <Form.Item label="Hình ảnh khóa học (Tối đa 4 ảnh)">
                    <Upload
                      listType="picture-card"
                      fileList={allFiles}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      accept=".jpg,.jpeg,.png,.gif"
                      multiple
                      maxCount={4} // Limit to 4 files
                    >
                      {allFiles.length < 4 && (
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
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value={0}>Bản nháp</Select.Option>
                  <Select.Option value={1}>Hoạt động</Select.Option>
                </Select>
              </Form.Item>
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
                  {submitting ? "Đang cập nhật..." : "Cập nhật khóa học"}
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

export default EditCourse;