import Axios from "axios";
import Url_BackEnd from "../../URL";
const HandleLogin = async (req) => {
  
  const respod = await Axios.post(
    `${Url_BackEnd}/Auth/Login`,
    {
      username: req.username,
      password: req.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        // 'Authorization': `Bearer ${yourAccessToken}`,
      },
    }
  );
  localStorage.setItem("id", respod.data.user.userID);
  localStorage.setItem("token", respod.data.Accesstoken);
  return respod.data;
};

export default HandleLogin;
