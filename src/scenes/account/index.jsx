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
const ACCOUNT = () => {
  const [stateStore, setStateStore] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "Số thứ tự" },
    {
      field: "branchID",
      headerName: "Mã chi nhánh",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Tên chi nhánh",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "diachi",
      headerName: "Địa chỉ",
      flex: 1,
    },
    {
      field: "masothue",
      headerName: "Mã số thuế",
      flex: 1,
      cellClassName: "name-column--cell",
    },
  ];
  const [stateBranch, setStateBranch] = useState([]);

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
    fetchingapi();
  }, []);
  const rowsWithId = stateBranch.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  return (
    <Box m="20px">
      <Header title="BRANCH" subtitle="Managing the BRANCH" />

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
        <DataGrid
          checkboxSelection
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={10}
          rows={rowsWithId}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default ACCOUNT;
