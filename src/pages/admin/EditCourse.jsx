import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Upload, List } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

function EditCourse() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modules, setModules] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, langRes, levelRes, catRes, modRes] = await Promise.all([
          axios.get(`/api/courses/${id}`),
          axios.get("/api/languages"),
          axios.get("/api/levels"),
          axios.get("/api/categories"),
          axios.get(`/api/modules?courseId=${id}`),
        ]);
        form.setFieldsValue(courseRes.data);
        setImagePaths(courseRes.data.existingImageUrls || []);
        setLanguages(langRes.data);
        setLevels(levelRes.data);
        setCategories(catRes.data);
        setModules(modRes.data);
      } catch (error) {
        message.error("Failed to fetch data");
      }
    };
    fetchData();
  }, [id, form]);

  const handleImageUpload = async ({ file }) => {
    if (imagePaths.length >= 4) {
      message.error("Bạn chỉ có thể tải lên tối đa 4 ảnh.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chỉ tải lên file hình ảnh.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Kích thước ảnh không được vượt quá 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("images", file);
    try {
      const response = await axios.post("/api/courses/upload-images", formData);
      if (response.data.success) {
        setImagePaths((prev) => [...prev, ...response.data.imagePaths]);
        message.success("Image uploaded successfully");
      } else {
        message.error(response.data.message || "Error uploading image");
      }
    } catch (error) {
      message.error("Error uploading image");
    }
  };

  const handleImageRemove = async (path) => {
    try {
      await axios.post("/api/courses/delete-image", { imagePath: path });
      setImagePaths((prev) => prev.filter((p) => p !== path));
      message.success("Image removed successfully");
    } catch (error) {
      message.error("Error removing image");
    }
  };

  const onFinish = async (values) => {
    const courseData = {
      ...values,
      courseId: id,
      uploadedImagePaths: imagePaths,
    };
    try {
      await axios.put(`/api/courses/${id}`, courseData);
      message.success("Course updated successfully");
      navigate("/courses");
    } catch (error) {
      message.error("Failed to update course");
    }
  };

  return (
    <>
      <Header />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* Left Column: Modules */}
            <div className="w-full lg:w-1/3 px-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-xl font-bold mb-4">Modules Course</h4>
                {modules.length > 0 ? (
                  <List
                    dataSource={modules}
                    renderItem={(module) => (
                      <List.Item>
                        <Link
                          to={`/lesson-quiz?moduleNumber=${module.moduleNumber}&moduleName=${module.moduleName}&courseId=${module.courseId}`}
                        >
                          <Button type="link">{module.moduleName}</Button>
                        </Link>
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No modules available.</p>
                )}
                <Link to={`/modules?courseId=${id}`}>
                  <Button className="mt-4">Add Modules</Button>
                </Link>
              </div>
            </div>
            {/* Right Column: Edit Form */}
            <div className="w-full lg:w-2/3 px-4">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h4 className="text-2xl font-bold mb-4">Edit Course</h4>
                <Form form={form} onFinish={onFinish} layout="vertical">
                  <Form.Item name="courseId" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item name="oldCategoryId" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Course Name"
                    name="courseName"
                    rules={[{ required: true, message: "Please enter course name" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="Course Images (Max 4)">
                    <Upload
                      listType="picture-card"
                      fileList={imagePaths.map((path, index) => ({
                        uid: index,
                        name: `image-${index}`,
                        status: "done",
                        url: path,
                      }))}
                      onRemove={(file) => handleImageRemove(file.url)}
                      customRequest={handleImageUpload}
                      accept="image/*"
                    >
                      {imagePaths.length < 4 && <UploadOutlined />}
                    </Upload>
                  </Form.Item>
                  <Form.Item label="Course Description" name="description">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                  <Form.Item
                    label="Course Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter course price" }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item label="Course Discount" name="discount">
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item
                    label="Course Language"
                    name="languageId"
                    rules={[{ required: true, message: "Please select a language" }]}
                  >
                    <Select>
                      {languages.map((lang) => (
                        <Select.Option key={lang.value} value={lang.value}>
                          {lang.text}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Course Level"
                    name="levelId"
                    rules={[{ required: true, message: "Please select a level" }]}
                  >
                    <Select>
                      {levels.map((level) => (
                        <Select.Option key={level.value} value={level.value}>
                          {level.text}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Course Type"
                    name="categoryId"
                    rules={[{ required: true, message: "Please select a category" }]}
                  >
                    <Select>
                      {categories.map((cat) => (
                        <Select.Option key={cat.value} value={cat.value}>
                          {cat.text}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                    <Link to="/courses">
                      <Button className="ml-2">Back</Button>
                    </Link>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default EditCourse;