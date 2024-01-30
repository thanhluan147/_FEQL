import Axios from "axios";
import Url_BackEnd from "../../URL";
export const createDebtor = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/debtors/create`,
    {
      id: req.id,
      Debtor_BranchID: req.Debtor_BranchID,
      Owner_BranchID: req.Owner_BranchID,
      sotienNo: req.sotienNo,
      ThoiDiemNo: req.ThoiDiemNo,
      LastPaymentDate: req.LastPaymentDate,
      status: req.status,
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
export const Get_all_DEBTOR = async (req) => {
  const respod = await Axios.get(`${Url_BackEnd}/debtors/getAllDebtor`, {
    headers: {
      "Content-Type": "application/json",
      // Thêm các header khác nếu cần
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return JSON.stringify(respod.data.All_DEBTOR);
};
export const Update_DOANHTHU_BY_storeID_thoidiem = async (req) => {
  const respod = await Axios.put(
    `${Url_BackEnd}/doanhthu/updatesotien`,
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

  return JSON.stringify(respod.data);
};
