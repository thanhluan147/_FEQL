import Axios from "axios";
import Url_BackEnd from "../../URL";
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
      sotienThucTe: req.sotienThucTe,
      StoreID: req.StoreID,
      ngaylap: req.ngaylap,
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
