import Axios from "axios";
import Url_BackEnd from "../../URL";

export const GET_ALL_DOANHTHU_By_storeID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/doanhthu/getalldoanhthuByStoreId`,
    {
      storeID: req,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.All_DOANHTHU);
};

export const Update_ListOfCreditors_Listdebtors_By_id = async (req) => {
  console.log("Update req " + JSON.stringify(req));
  const respod = await Axios.put(
    `${Url_BackEnd}/doanhthu/updateDoanhthuListDebCre`,
    {
      storeID: req.storeID,
      thoidiem: req.thoidiem,
      ListOfCreditors: req.ListOfCreditors,
      Listdebtors: req.Listdebtors,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.All_PhieuStore);
};
