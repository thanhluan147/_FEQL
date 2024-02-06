import Axios from "axios";
import Url_BackEnd from "../../URL";
export const Get_all_Product_By_StoreID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/product/getallproduct`,
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
export const createProduct = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/product/create`,
    {
      id: req.id,
      name: req.name,
      picture: req.picture,
      loai: req.loai,
      soluong: req.soluong,
      status: "GOOD",
      StoreID: req.StoreID,
      behavior: req.behavior,
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
