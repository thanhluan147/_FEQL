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

export const DeletePhieuOrder = async (req) => {
  console.log("check req " + JSON.stringify(req));
  const respod = await Axios.post(
    `${Url_BackEnd}/order/deleteOrder`,
    {
      id: req[0].id,
      arrayUpdateProductIntoStore: req[0].arrayProduct,
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

export const UPdateProductStatusOrder = async (req) => {
  const respod = await Axios.put(
    `${Url_BackEnd}/order/updateProductStatusOrder`,
    {
      stateOrder: req,
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

export const Get_all_Order_By_StoreID_Year_Month = async (req) => {
  console.log("check req YEar " + JSON.stringify(req));
  const respod = await Axios.post(
    `${Url_BackEnd}/order/getALlOrderByYearMonth`,
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

  return JSON.stringify(respod.data.All_Order);
};

export const Update_PhieuStore_By_id = async (req) => {
  const respod = await Axios.put(
    `${Url_BackEnd}/phieustore/UpdatePhieuStore`,
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

  return JSON.stringify(respod.data.All_PhieuStore);
};
