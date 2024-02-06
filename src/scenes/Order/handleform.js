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
      StoreID: req.StoreID,
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
export const getAllOrder_BY_storeID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/order/getAllOrderByStoreId`,
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

  return JSON.stringify(respod.data.All_Order);
};

export const createOrder = async (req) => {
  console.log("check req " + JSON.stringify(req));
  const respod = await Axios.post(
    `${Url_BackEnd}/order/create`,
    {
      id: req.id,
      tongtien: req.tongtien,
      storeID: req.storeID,
      arrayProduct: req.arrayProduct,
      CreateAt: req.CreateAt,
      phieustoreID: req.phieustoreID,
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
