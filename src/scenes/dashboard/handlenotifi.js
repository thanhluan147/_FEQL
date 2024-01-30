import Axios from "axios";
import Url_BackEnd from "../../URL";

export const GET_Notifi_BY_ID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/notifi/findone`,
    {
      id: "id01",
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.notifications.content);
};

export const Update_Notifi_By_id = async (req) => {
  const respod = await Axios.put(
    `${Url_BackEnd}/notifi/update`,
    {
      id: "id01",
      content: req,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.updateNotifi);
};
