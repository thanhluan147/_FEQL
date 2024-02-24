import Url_BackEnd from "../../URL";
import axios from "axios";
function generateRandomString() {
  // Hàm để tạo số ngẫu nhiên trong khoảng từ min đến max (bao gồm cả max)
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Hàm để tạo một ký tự chữ cái ngẫu nhiên
  const getRandomLetter = () => String.fromCharCode(getRandomNumber(65, 90)); // Từ A đến Z

  // Tạo chuỗi gồm 2 chữ cái và 8 số ngẫu nhiên
  const randomString =
    getRandomLetter() +
    getRandomLetter() +
    getRandomNumber(10000000, 99999999).toString();

  return randomString;
}
export const HandleUpload = async (
  type,
  file,
  statechinhanh,
  stateimageFileName
) => {
  try {
    // Kiểm tra xem file có tồn tại không
    if (!file) {
      console.error("Please select a file");
      return;
    }

    // // Đọc nội dung của file
    // const reader = new FileReader();
    // reader.readAsDataURL(file);

    const fileContent = file; // Lấy phần nội dung base64

    // Gửi yêu cầu POST đến API để tải lên file
    await axios.post(`${Url_BackEnd}/api/upload`, {
      filename: stateimageFileName,

      content: fileContent,

      type: type,
      machinhanh: statechinhanh,
    });

    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
export const CheckFileName = async (filename, type, statechinhanh) => {
  try {
    // Gửi yêu cầu POST đến API để tải lên file
    const name = await axios.post(`${Url_BackEnd}/api/checkname`, {
      filename,
      type: type,
      machinhanh: statechinhanh,
    });
    console.log("new name " + name.data);
    return name.data;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
