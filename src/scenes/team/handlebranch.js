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

export const Get_all_STAFFOFF_By_branchID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/staffoff/getallStaft`,
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
