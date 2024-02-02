import Axios from "axios";
import Url_BackEnd from "../../URL";
export const HandleCreateStaff = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/Staff/create`,
    {
      id: req.id,
      name: req.name,
      phone: req.phone,
      Role: req.Role,
      branchID: req.branchID,
      ngayvao: req.ngayvao,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return respod.data;
};

export const HandleEditStaff = async (req) => {
 
  const respod = await Axios.put(
    `${Url_BackEnd}/Staff/updateStaff`,
    {
      id: req.id,
      name: req.name,
      phone: req.phone,
      Role: req.Role,
      branchID: req.branchID,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return respod;
};

export const HandleDeletedStaff = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/Staff/deletedstaff/`,
    {
      arraydeleted: req,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return respod.data;
};
