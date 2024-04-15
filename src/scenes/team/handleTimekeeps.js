import Axios from "axios";
import Url_BackEnd from "../../URL";
export const HandleCreateTimekeeps = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/timekeep/create`,
    {
      staffid: req.staffid,
      staffName: req.staffName,
      branchID: req.branchID,
      OT: req.OT,
      reason: "...",
      startCheck: "...",
      endCheck: "...",
      createDate: req.createDate,
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

export const Get_all_TIMEKEEPING_By_DateF_DateT_branchID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/timekeep/getAllTimekeeep`,
    {
      branchID: req.branchID,
      createDateF: req.createDateF,
      createDateT: req.createDateT,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.all_Time);
};

export const GET_ALL_TIMEKEEP_FROM_API = async (req) => {
  const respod = await Axios.get(`${Url_BackEnd}/api/sql`, {
    headers: {
      "Content-Type": "application/json",
      // Thêm các header khác nếu cần
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return respod.data;
};

export const GET_ALL_TIMEKEEP_FROM_API_SEARCH = async (req) => {
  console.log("check req " + JSON.stringify(req));
  const respod = await Axios.post(
    `${Url_BackEnd}/api/search`,
    {
      dateF: req.dateF,
      dateT: req.dateT,
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

export const HandleEditTimekeeps = async (req) => {
  console.log("check req " + JSON.stringify(req));
  const respod = await Axios.put(
    `${Url_BackEnd}/timekeep/update`,
    {
      id: req.id,
      branchID: req.branchID,
      reason: req.reason,
      startCheck: req.startCheck,
      endCheck: req.endCheck,
      Total: req.Total,
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
export const HandleDeletedTime = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/timekeep/deleted`,
    {
      id: req,
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
