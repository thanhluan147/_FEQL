import Axios from "axios";
import Url_BackEnd from "../../URL";
import "./style.css";
export const createPhieu = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/phieustore/create`,
    {
      id: req.id,
      status: req.status,
      userID: req.userID,
      loaiphieu: req.loaiphieu,
      sotien: req.sotien,
      arrayProduct: req.arrayProduct,
      updateDate: "...",
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

export const Get_all_Order = async (req) => {
  const respod = await Axios.get(`${Url_BackEnd}/order/getAllOrder`, {
    headers: {
      "Content-Type": "application/json",
      // Thêm các header khác nếu cần
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return JSON.stringify(respod.data.All_Order);
};

export const Get_all_Phieu_Store = async (req) => {
  const respod = await Axios.get(`${Url_BackEnd}/phieustore/getallphieustore`, {
    headers: {
      "Content-Type": "application/json",
      // Thêm các header khác nếu cần
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return JSON.stringify(respod.data.All_PhieuStore);
};

export const Get_all_Phieu_Store_By_StoreID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/phieustore/getphieustoreByUserID`,
    {
      StoreID: req,
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

export const Update_SOTIEN_DOANHTHU_By_TWOid = async (req) => {

  const respod = await Axios.put(
    `${Url_BackEnd}/debtors/updateSotienByDebtor_BranchIDAndOwner_BranchID`,
    {
      id: req.id,
      Owner_BranchID: req.Owner_BranchID,
      Debtor_BranchID: req.Debtor_BranchID,
      sotienNo: req.sotienNo,
      ThoiDiemNo: req.ThoiDiemNo,
      sotiencapnhat: req.sotiencapnhat,
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
