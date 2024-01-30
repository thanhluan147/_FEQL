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

export const GET_ALL_DOANHTHU_By_storeID_date = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/doanhthu/getdoanhthubyDate`,
    {
      storeID: req.storeID,
      thoidiem: req.thoidiem,
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
export const Update_SOTIEN_Listdebtors = async (req) => {
  const respod = await Axios.put(
    `${Url_BackEnd}/doanhthu/updatesotienOfListdebtors`,
    {
      storeID: req.storeID,
      DebtorId: req.DebtorId,
      thoidiem: req.thoidiem,
      sotien: req.sotien,
      sotiencapnhat: req.sotiencapnhat,
      storeIDNo: req.storeIDNo,
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
