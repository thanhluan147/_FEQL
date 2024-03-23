import Axios from "axios";
import Url_BackEnd from "../../URL";
export const Get_all_branch_By_userid = async (req) => {
  const respod = await Axios.get(
    `${Url_BackEnd}/Branch/getallbranch/`,

    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.All_Branch);
};

export const Get_all_branch = async (req) => {
  const respod = await Axios.get(`${Url_BackEnd}/Branch/admin/getallbranch/`, {
    headers: {
      "Content-Type": "application/json",
      // Thêm các header khác nếu cần
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return JSON.stringify(respod.data.All_Branch);
};

export const Get_all_User_By_branchID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/Staff/getallStaft/`,
    {
      branchID: req,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.All_Branch);
};

export const CreateBranch = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/Branch/create`,
    {
      branchID: req.branchID,
      name: req.name,
      diachi: req.diachi,
      masothue: req.masothue,
      userId: localStorage.getItem("id"),
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

export const CreateStore = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/store/create`,
    {
      id: req.id,
      name: req.name,
      BranchId: req.BranchId,
      status: "OK",
      code: req.code,
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
