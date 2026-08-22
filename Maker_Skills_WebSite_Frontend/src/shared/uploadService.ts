import axios from "axios";

/**
 * Simple file upload utility
 * @param {string} url - API endpoint URL
 * @param {File} file - File object to upload
 * @param {string} [fieldName='file'] - FormData field name
 * @param {Object} [params={}] - Additional parameters
 * @returns {Promise<{url: string, data: any, status: number}>}
 */
export const uploadFile = async (
  url: string,
  file: File,
  fieldName = "file",
  params = {}
) => {
  const formData = new FormData();
  formData.append(fieldName, file);

  // Add additional params to FormData if needed
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      url: response.config.url,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      url: error.config.url,
      error: error.response?.data || { message: "Upload failed" },
      status: error.response?.status || 500,
    };
  }
};
