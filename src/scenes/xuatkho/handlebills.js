import Axios from "axios";
import Url_BackEnd from "../../URL";
export const createBills = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/bills/create`,
    {
      id: req.id,
      OrderID: req.OrderID,

      userID: req.userID,
      noiban: req.noiban,
      noimua: req.noimua,
      giaban: req.giaban,
      giamua: req.giamua,
      phieuxuatID: req.phieuxuatID,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data);
};
export const Get_all_Bill_By_userID = async (req) => {
  const respod = await Axios.get(`${Url_BackEnd}/bills/getallbillsByuserID`, {
    headers: {
      "Content-Type": "application/json",
      // Thêm các header khác nếu cần
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return JSON.stringify(respod.data.All_Bill);
};
export const Update_PhieuOrder_By_id = async (req) => {
  const respod = await Axios.put(
    `${Url_BackEnd}/order/updateStateOrder`,
    {
      arrayUpdate: req,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data);
};
