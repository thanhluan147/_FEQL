import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import styled from "styled-components";
import { GridToolbar } from "@mui/x-data-grid";
import React from "react";
import * as XLSX from "xlsx";
import {
  Get_all_branch_By_userid,
  Get_all_User_By_branchID,
  Get_all_branch,
} from "./handlebranch";
import "./style.css";
import HandleAccessAccount from "../handleAccess/handleAccess";
import {
  HandleCreateStaff,
  HandleDeletedStaff,
  HandleEditStaff,
} from "./handlestaff";
import { useState, useEffect } from "react";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./style.css";
const BRACNH = () => {
  const nav = useNavigate();
  useTranslation();
  const [stateStore, setStateStore] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const checkAccess = async () => {
    const check = HandleAccessAccount();
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      if (resolvedResult === "true" || resolvedResult) {
      } else {
        nav("/");
      }
    } else {
      if (check === "true" || check) {
      } else {
        nav("/");
      }
    }
  };
  const columns = [
    { field: "id", headerName: `${i18n.t("STT_B")}` },
    {
      field: "branchID",
      headerName: `${i18n.t("MA_B")}`,
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: BranchIDCell,
    },
    {
      field: "name",
      headerName: `${i18n.t("TEN_B")}`,
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "diachi",
      headerName: `${i18n.t("DIACHI_B")}`,
      flex: 1,
    },
    {
      field: "masothue",
      headerName: `${i18n.t("MASOTHUE_B")}`,
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "CreateAt",
      headerName: `${i18n.t("THOIDIEMTAO_B")}`,
      flex: 2,
      renderCell: UpdatedateObjectCell,
      cellClassName: "name-column--cell",
    },
  ];
  const handleExportExcel = () => {
    const rows = stateBranch.map((staff) => {
      return {
        [i18n.t("MA_B")]: staff.branchID, // Thay đổi tên cột 'id'
        [i18n.t("TEN_B")]: staff.name, // Thay đổi tên cột 'name'
        [i18n.t("DIACHI_B")]: staff.diachi,
        [i18n.t("MASOTHUE_B")]: staff.masothue,

        // Thêm các trường khác nếu cần
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Điều chỉnh chiều rộng của cột (ví dụ: cột 'A' sẽ rộng hơn)
    ws["!cols"] = [{ width: 15 }, { width: 30 }, { width: 40 }, { width: 20 }];

    XLSX.utils.book_append_sheet(wb, ws, "Branch Data");
    XLSX.writeFile(wb, "Branch_Data.xlsx");
  };
  const [stateBranch, setStateBranch] = useState([]);
  const handleLogin = (x) => {
    const storeID = x; // Giá trị bạn muốn truyền
    nav("/details", { state: { storeID } });
  };
  function BranchIDCell(params) {
    const arrayObject = params.value;
    return (
      <span
        className="HoverLink"
        style={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={() => handleLogin(arrayObject)}
      >
        {arrayObject}
      </span>
    );
  }
  const goToDetailsScreen = (paramX) => {
    nav("/details", { state: paramX });
  };
  function UpdatedateObjectCell(params) {
    const arrayObject = params.value;
    const originalDateString = arrayObject;
    const originalDate = new Date(originalDateString);

    // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây từ đối tượng Date
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = originalDate.getDate().toString().padStart(2, "0");
    const hours = originalDate.getHours().toString().padStart(2, "0");
    const minutes = originalDate.getMinutes().toString().padStart(2, "0");
    const seconds = originalDate.getSeconds().toString().padStart(2, "0");

    // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return <span>{formattedDateString}</span>;
  }
  const fetchingBranch = async () => {
    const objBranch = Get_all_branch();

    if (objBranch instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await objBranch;

      setStateBranch(JSON.parse(resolvedResult));

      setStateStore(JSON.parse(resolvedResult));
    } else {
      // Nếu không phải là promise, cập nhật state ngay lập tức

      setStateBranch(JSON.parse(objBranch));
      setStateStore(JSON.parse(objBranch));
    }
  };

  const fetchingapi = async () => {
    await fetchingBranch();
  };
  useEffect(() => {
    try {
      checkAccess();
      fetchingapi();
    } catch (error) {}
  }, []);
  const rowsWithId = stateBranch.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  return (
    <Box m="20px">
      <Header title={i18n.t("TITLEBRANCH")} subtitle={i18n.t("DESBRANCH")} />
      <select id="chinhanh">
        {stateStore &&
          stateStore.map((object, index) => (
            <React.Fragment key={index}>
              {index === 0 ? (
                <option selected id="target" value={object.id}>
                  {object.name}
                </option>
              ) : (
                <option value={object.id}>{object.name}</option>
              )}
            </React.Fragment>
          ))}
      </select>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <button
          style={{ backgroundColor: "green", color: "white" }}
          onClick={handleExportExcel}
        >
          Export Excel
        </button>
        <button
          data-toggle="modal"
          data-target="#staticBackdrop"
          disabled
          style={{ backgroundColor: "#0d6efd", color: "white" }}
        >
          Thêm chi nhánh
        </button>
        <button className="btn-danger" style={{ color: "white" }} disabled>
          Xóa chi nhánh
        </button>
        <div
          class="modal fade"
          id="staticBackdrop"
          data-backdrop="static"
          data-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5
                  style={{ color: "black" }}
                  class="modal-title"
                  id="staticBackdropLabel"
                >
                  Thêm chi nhánh
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body" style={{ color: "black" }}>
                <label htmlFor="name">Mã chi nhánh</label>
                <input type="text" name="name"></input>
                <label htmlFor="phone">Tên chi nhánh</label>
                <input type="text" name="phone"></input>
                <label htmlFor="Role">Mã số thuế</label>
                <input type="text" name="Role"></input>
                <label htmlFor="ngayvao">{i18n.t("NV_TEAM")}</label>
                <input
                  type="text"
                  name="ngayvao"
                  placeholder="YYYY/MM/DD"
                ></input>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  {i18n.t("BTN_DONG")}
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-dismiss="modal"
                >
                  {i18n.t("BTN_XACNHAN")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <DataGrid
          checkboxSelection
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={15}
          rows={rowsWithId}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default BRACNH;
