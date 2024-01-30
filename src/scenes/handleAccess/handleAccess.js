import Axios from "axios";
import Url_BackEnd from "../../URL";
const HandleAccessAccount = async (req) => {
  const respod = await Axios.get(`${Url_BackEnd}/checkaccess/`, {
    headers: {
      // Thêm các header khác nếu cần
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (respod.data.success) {
    return true;
  }
  return false;
};

export default HandleAccessAccount;
