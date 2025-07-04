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
  const [initialCourseImage, setInitialCourseImage] = useState(null); // Stores the raw URL of the image loaded from API
  const [currentUploadFile, setCurrentUploadFile] = useState([]); // Ant Design's fileList format for the single image
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, langRes, levelRes, catRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/Courses/${id}`, {
            headers: { "Cache-Control": "no-cache" },
          }),
          axios.get(`${API_BASE_URL}/api/Languages`),
          axios.get(`${API_BASE_URL}/api/Levels`),
          axios.get(`${API_BASE_URL}/api/Categories`),
        ]);

        if (courseRes.data.status === -1) {
          setIsDeleted(true);
          message.error("Khóa học đã bị xóa và không thể chỉnh sửa.");
          return;
        }

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

        // Set initial image state
        if (courseRes.data.imageUrls && courseRes.data.imageUrls.length > 0) {
          const imageUrl = courseRes.data.imageUrls[0];
          setInitialCourseImage(imageUrl); // Store raw URL
          setCurrentUploadFile([
            {
              uid: `existing-0-${imageUrl}`, // Unique ID for existing file
              name: imageUrl.substring(imageUrl.lastIndexOf("/") + 1),
              status: "done",
              url: imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`,
              rawUrl: imageUrl, // Keep raw URL for removal
            },
          ]);
        } else {
          setInitialCourseImage(null);
          setCurrentUploadFile([]);
        }

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
        message.error("Không thể tải dữ liệu: " + (error.response?.data || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form]);

  const handleUploadChange = ({ fileList, file: changedFile }) => {
    // If a file was removed, and it was the existing one, clear the initialCourseImage
    if (changedFile.status === 'removed' && changedFile.uid.startsWith('existing-')) {
      setInitialCourseImage(null);
    }
    // Always keep only the last file in the list (due to maxCount=1)
    setCurrentUploadFile(fileList.slice(-1));
  };

  const beforeUpload = (newFile) => {
    // If there's already a file (either existing or newly added but not yet processed), prevent new upload
    if (currentUploadFile.length >= 1) {
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

    // Return false to prevent Ant Design from automatically uploading.
    // We will handle the upload manually in onFinish.
    return false;
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
      values.categoryId.forEach((catId) => formData.append("CategoryIDs", catId.toString()));
    }

    // Determine if a new file is being uploaded
    const newFileToUpload = currentUploadFile.length > 0 && !currentUploadFile[0].uid.startsWith("existing-")
      ? currentUploadFile[0].originFileObj
      : null;

    // Determine if the existing image should be removed
    // This happens if:
    // 1. There was an initial image (loaded from API) AND
    // 2. (The currentUploadFile is empty (user removed it) OR a new file is being uploaded (user replaced it))
    const shouldRemoveExistingImage = initialCourseImage && (currentUploadFile.length === 0 || newFileToUpload);

    if (shouldRemoveExistingImage) {
      formData.append("RemovedImageUrls", initialCourseImage);
    }

    if (newFileToUpload) {
      formData.append("AttachmentFiles", newFileToUpload);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/Courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Cập nhật khóa học thành công");
      // After successful update, update initialCourseImage and currentUploadFile to reflect the new state
      if (newFileToUpload) {
        setInitialCourseImage(newFileToUpload.url || URL.createObjectURL(newFileToUpload));
        setCurrentUploadFile([{
          uid: `existing-0-${newFileToUpload.name}`, // Treat new file as existing after successful upload
          name: newFileToUpload.name,
          status: 'done',
          url: URL.createObjectURL(newFileToUpload),
          rawUrl: newFileToUpload.url || URL.createObjectURL(newFileToUpload), // Store URL for potential future removal
        }]);
      } else if (shouldRemoveExistingImage && !newFileToUpload) {
        // If existing image was removed and no new one was uploaded
        setInitialCourseImage(null);
        setCurrentUploadFile([]);
      }
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/courses")}>
            Quay lại
          </Button>
        </Space>
        <h2 style={{ margin: "8px 0", fontSize: "24px", fontWeight: "bold" }}>
          Lỗi: Khóa học đã bị xóa
        </h2>
        <p style={{ color: "#ff4d4f" }}>
          Khóa học này đã bị xóa và không thể chỉnh sửa. Vui lòng quay lại danh sách khóa học.
        </p>
      </div>
    );
  }

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
                  <Form.Item label="Hình ảnh khóa học (Tối đa 1 ảnh)">
                    <Upload
                      listType="picture-card"
                      fileList={currentUploadFile}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      accept=".jpg,.jpeg,.png,.gif"
                      maxCount={1} // Limit to 1 file
                    >
                      {currentUploadFile.length < 1 && (
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                >
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