import Axios from "axios";
import Url_BackEnd from "../../URL";
export const GET_ALLDEBTOR_BY_Debtor_BranchID = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/debtors/getAllDebtor_byDebtor_BranchID`,
    {
      Debtor_BranchID: req,
    },
    {
      headers: {
        "Content-Type": "application/json",
        // Thêm các header khác nếu cần
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return JSON.stringify(respod.data.All_DEBTOR);
};

export const GET_ALLDEBTOR_BY_Debtor_Year_month = async (req) => {
  const respod = await Axios.post(
    `${Url_BackEnd}/debtors/getAlldebtorByYearMonth`,
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

  return JSON.stringify(respod.data.All_Debtor);
};

export const GET_ALLDEBTOR_CONNO = async (req) => {
  const respod = await Axios.get(`${Url_BackEnd}/debtors/getAllDebtorNo`, {
    headers: {
      "Content-Type": "application/json",
      // Thêm các header khác nếu cần
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return JSON.stringify(respod.data.All_DEBTOR);
};
