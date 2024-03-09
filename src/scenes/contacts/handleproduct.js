import Axios from "axios";
import Url_BackEnd from "../../URL";
export const Get_all_Product_By_StoreID = async (req) => {
  let tempstoreid = "";
  if (!req.StoreID) {
    tempstoreid = req;
  } else {
    tempstoreid = req.StoreID;
  }
  const respod = await Axios.post(
    `${Url_BackEnd}/product/getallproduct`,
    {
      StoreID: tempstoreid,
      startIndex: req.startIndex,
      endIndex: req.endIndex,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.All_Products);
};

export const Get_all_ProductB_By_StoreID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/productp/getallproductB`,
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

  return JSON.stringify(respod.data.All_Products);
};

export const Get_all_LENGHT_Product_By_StoreID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/product/getallProductLength`,
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
  return respod.data.soluong;
};
export const createProduct = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/product/create`,
    {
      id: req.id,
      name: "...",
      picture: "...",
      loai: req.loai,
      soluong: req.soluong,
      status: "GOOD",
      StoreID: req.StoreID,
      behavior: "...",
      xuatxu: "...",
      sotien: req.sotien,
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

export const createProductp = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/productp/create`,
    {
      id: req.id,
      name: req.name,
      picture: req.picture,
      loai: req.loai,
      soluong: req.soluong,
      status: req.status,
      StoreID: req.StoreID,
      date: req.date,
      xuatxu: req.xuatxu,
      sotien: req.sotien,
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

export const EditProduct = async (req) => {
  const respod = await Axios.put(
    `${Url_BackEnd}/product/update`,
    {
      id: req.id,
      name: req.name,
      picture: req.picture,
      loai: req.loai,
      soluong: parseInt(req.soluong),
      status: req.status,
      StoreID: req.StoreID,
      xuatxu: req.xuatxu,
      sotien: req.sotien,
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

export const DeleteProduct = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/product/delete`,
    {
      arraydelted: req,
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
