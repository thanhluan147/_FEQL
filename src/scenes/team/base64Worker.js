// base64Worker.js

self.addEventListener("message", (event) => {
  const { base64Data, key } = event.data;
  const decodedData = decodeBase64Data(base64Data);
  self.postMessage({ key, decodedData });
});

function decodeBase64Data(base64Data) {
  // Thực hiện xử lý dữ liệu base64 ở đây
  // Ví dụ: Giả sử dùng atob để giải mã base64
  return atob(base64Data);
}
