import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import styled from "styled-components";
import { GridToolbar } from "@mui/x-data-grid";
import React from "react";
import { HandleUpload, CheckFileName } from "../sendfileFTP/sendfileFTP";
import { useRef } from "react";
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
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
const Team = () => {
  useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isError, setisError] = useState(false);
  const [stateimage, setStateimg] = useState("");
  const [stateimageTwo, setStateimgTwo] = useState("");
  const [stateimageFileName, setStateimgFileName] = useState("");
  const [stateimageTwoFileName, setStateimgTwoFileName] = useState("");
  const [stateimageEdit, setStateimgEdit] = useState("");
  const [stateimageTwoEdit, setStateimgTwoEdit] = useState("");
  const [stateimageFileNameEdit, setStateimgFileNameEdit] = useState("");
  const [stateimageTwoFileNameEdit, setStateimgTwoFileNameEdit] = useState("");
  const [stateViewimg, setstateViewimg] = useState("");
  const [isloading, setIsloading] = useState(false);
  const draggedItem = useRef(null);
  const columns = [
    { field: "id", headerName: `CCCD`, editable: true },
    {
      field: "name",
      headerName: `${i18n.t("TNV_TEAM")}`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "picture",
      headerName: `${i18n.t("HINHANHTRC")}` + " CCCD",
      flex: 1,
      width: 130,
      renderCell: ImageCell,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "pictureTwo",
      headerName: `${i18n.t("HINHANHSAU")}` + " CCCD",
      flex: 1,
      width: 130,
      renderCell: ImageCell,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: `${i18n.t("SDT_TEAM")}`,
      flex: 1,
      editable: true,
    },
    {
      field: "Role",
      headerName: `${i18n.t("CV_TEAM")}`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "AccountBank",
      headerName: `${i18n.t("TTNH")}`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "ngayvao",
      headerName: `${i18n.t("NV_TEAM")}`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "CreateAt",
      headerName: `${i18n.t("TDT_TEAM")}`,
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: UpdatedateObjectCell,
      editable: true,
    },
  ];
  const [stateBranch, setStateBranch] = useState([]);
  const [stateStaff, setStateStaff] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");

  const [selectionModel, setSelectionModel] = React.useState([]);

  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };
  // base64Worker.js

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
  function ImageCell(params) {
    return (
      <>
        <img
          src={params.value}
          onDoubleClick={clickdoublegetimg}
          alt="Image"
          style={{
            width: "60%",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            cursor: "pointer",
          }}
        />
      </>
    );
  }
  const clickdoublegetimg = (e) => {
    setstateViewimg(e.target.src);
  };
  const handleSaveClick = async () => {
    try {
      setIsloading(true);
      const selectedRows = stateStaff.filter((row) =>
        selectionModel.includes(row.id)
      );
      const handledelted = await HandleDeletedStaff(selectedRows);

      if (handledelted.success) {
        setIsloading(false);
        alert("Deleted Successfully !!!");
      }
      fetchingGettAllStaft_by_branchID(statechinhanh);
    } catch (error) {
      console.log(error);
    }

    // Thực hiện xử lý theo nhu cầu của bạn
  };

  const handleExportExcel = () => {
    // Chuẩn bị dữ liệu để xuất
    const rows = stateStaff.map((staff) => {
      // Chỉ lấy các trường dữ liệu bạn muốn xuất
      return {
        [i18n.t("MNV_TEAM")]: staff.id,
        [i18n.t("TNV_TEAM")]: staff.name,
        [i18n.t("SDT_TEAM")]: staff.phone,
        [i18n.t("CV_TEAM")]: staff.Role,
        [i18n.t("TTNH")]: staff.AccountBank,
        [i18n.t("NV_TEAM")]: staff.ngayvao,

        // Thêm các trường khác nếu cần
      };
    });

    // Tạo một workbook mới
    const wb = XLSX.utils.book_new();
    // Tạo một worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(rows);

    // Điều chỉnh chiều rộng của cột (ví dụ: cột 'A' sẽ rộng hơn)
    ws["!cols"] = [
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];

    // // Định dạng màu cho hàng tiêu đề (ví dụ: hàng 1 có màu vàng)
    // ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
    // ws["A1"].s = { fill: { fgColor: { rgb: "FFFF00" } } }; // Màu vàng
    // ws["B1"].s = { fill: { fgColor: { rgb: "FFFF00" } } }; // Màu vàng

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Staff_Data");

    // Tạo tệp Excel từ workbook
    XLSX.writeFile(wb, "Staff_Data.xlsx");
  };
  let checkaccess = false;
  let chinhanhdau = "";
  const fetchingBranch = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = Get_all_branch();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        setStateBranch(JSON.parse(resolvedResult));
        chinhanhdau = JSON.parse(resolvedResult)[0].branchID;
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức

        setStateBranch(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].branchID;
      }
    } else {
      const objBranch = Get_all_branch_By_userid();
      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        setStateBranch(JSON.parse(resolvedResult));
        chinhanhdau = JSON.parse(resolvedResult)[0].branchID;
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức
        setStateBranch(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].branchID;
      }
    }
  };
  const checkAccess = async () => {
    const check = HandleAccessAccount();
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      if (resolvedResult === "true" || resolvedResult) {
        checkaccess = resolvedResult;
      } else {
        checkaccess = resolvedResult;
      }
    } else {
      if (check === "true" || check) {
        checkaccess = true;
      } else {
        checkaccess = false;
      }
    }
  };

  const fetchingGettAllStaft_by_branchID = async (x) => {
    const check = await Get_all_User_By_branchID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateStaff(JSON.parse(resolvedResult));
    } else {
      setStateStaff(JSON.parse(check));
    }
  };
  const handle_getAllStaff = async (e) => {
    await fetchingGettAllStaft_by_branchID(e.target.value);

    setStatechinhanh(e.target.value);
  };

  const fetchingapi = async () => {
    // await checkAccess();
    // await fetchingBranch();
    // await fetchingGettAllStaft_by_branchID(chinhanhdau);
    await checkAccess();
    await fetchingBranch();
    const fetchData = async () => {
      try {
        await Promise.all([fetchingGettAllStaft_by_branchID(chinhanhdau)]);
        // Tiếp tục xử lý sau khi tất cả các hàm đã hoàn thành
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setStatechinhanh(chinhanhdau);
  };
  useEffect(() => {
    try {
      fetchingapi();
    } catch (error) {}
  }, []);
  const convertoBase64 = async (e) => {
    const check = await CheckFileName(
      e.target.files[0].name,
      "STAFF",
      statechinhanh
    );
    setStateimgFileName(check);
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setAddStaffForm({
        ...addStaffForm,
        picture: render.result,
      });
      setStateimg(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
  };

  const convertoBase64PicTwo = async (e) => {
    const check = await CheckFileName(
      e.target.files[0].name,
      "STAFF",
      statechinhanh
    );
    setStateimgTwoFileName(check);

    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setAddStaffForm({
        ...addStaffForm,
        pictureTwo: render.result,
      });

      setStateimgTwo(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
  };

  const convertoBase64Edit = async (e) => {
    const check = await CheckFileName(
      e.target.files[0].name,
      "STAFF",
      statechinhanh
    );
    setStateimgFileNameEdit(check);

    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setEditStaffForm({
        ...EditStaffForm,
        picture: render.result,
      });
      setStateimgEdit(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
  };

  const convertoBase64PicTwoEdit = async (e) => {
    const check = await CheckFileName(
      e.target.files[0].name,
      "STAFF",
      statechinhanh
    );
    setStateimgTwoFileNameEdit(check);
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setEditStaffForm({
        ...EditStaffForm,
        pictureTwo: render.result,
      });

      setStateimgTwoEdit(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
  };
  const [EditStaffForm, setEditStaffForm] = useState({
    name: "",
    phone: "",
    Role: "",
    branchID: "",
    AccountBank: "",
    id: "",
    idnew: "",
    picture: "",
    pictureTwo: "",
  });
  const editstaff = async () => {
    const check = await HandleEditStaff(EditStaffForm);
    await fetchingGettAllStaft_by_branchID(statechinhanh);

    if (check.data.success) {
      alert("Update Success");
      await HandleUpload(
        "STAFF",
        stateimageEdit,
        statechinhanh,
        stateimageFileNameEdit
      );
      await HandleUpload(
        "STAFF",
        stateimageTwoEdit,
        statechinhanh,
        stateimageTwoFileNameEdit
      );
    }
    setSelectionModel([]);
    setStateimgEdit("");
    setStateimgTwoEdit("");
  };

  const handleEdit = () => {
    const selectedRows = stateStaff.filter((row) =>
      selectionModel.includes(row.id)
    );

    fetchingGettAllStaft_by_branchID(statechinhanh);

    setEditStaffForm({
      ...EditStaffForm,
      name: selectedRows[0].name,
      phone: selectedRows[0].phone,
      Role: selectedRows[0].Role,
      branchID: selectedRows[0].branchID,
      id: selectedRows[0].id,
      idnew: selectedRows[0].id,
      AccountBank: selectedRows[0].AccountBank,
      picture: selectedRows[0].picture,
      pictureTwo: selectedRows[0].pictureTwo,
    });
    setStateimgEdit(selectedRows[0].picture);
    setStateimgTwoEdit(selectedRows[0].pictureTwo);

    // setStateimg(selectedRows[0].picture);
    // setStateimgTwo(selectedRows[0].pictureTwo);
    // Thực hiện xử lý theo nhu cầu của bạn
  };
  const addStaff = async () => {
    const objectWithIdZero = stateStaff.find(
      (obj) => obj.id === addStaffForm.id
    );

    if (objectWithIdZero) {
      alert("CCCD đã tồn tại");
      return;
    }
    {
      if (
        !addStaffForm.id ||
        !addStaffForm.name ||
        !addStaffForm.ngayvao ||
        !addStaffForm.phone ||
        !addStaffForm.Role
      ) {
        setisError(true);
        return;
      }
      const notice = await HandleCreateStaff(addStaffForm);
      if (notice) {
        alert(`${i18n.t("ALERT_THEMNHANVIEN_TEAM")}`);
        await HandleUpload(
          "STAFF",
          stateimage,
          statechinhanh,
          stateimageFileName
        );
        await HandleUpload(
          "STAFF",
          stateimageTwo,
          statechinhanh,
          stateimageTwoFileName
        );
      }
      fetchingGettAllStaft_by_branchID(statechinhanh);
      setAddStaffForm({
        name: "",
        phone: "",
        Role: "",
        branchID: "",
        id: "",
        AccountBank: "",
        ngayvao: "",
        picture: "",
        pictureTwo: "",
      });
      setStateimg("");
      setStateimgTwo("");
      setStateimgFileName("");
      setStateimgTwoFileName("");
    }
  };

  const [addStaffForm, setAddStaffForm] = useState({
    name: "",
    phone: "",
    Role: "",
    branchID: "",
    id: "",
    ngayvao: "",
    AccountBank: "",
    picture: "",
    pictureTwo: "",
  });
  const onChangeStaffForm = (event) => {
    setisError(false);
    setAddStaffForm({
      ...addStaffForm,
      [event.target.name]: event.target.value,
      branchID: statechinhanh,
    });
  };

  const onChangeEditStaffForm = (event) => {
    setEditStaffForm({
      ...EditStaffForm,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Box m="20px">
      <Header title={i18n.t("TITLETEAM")} subtitle={i18n.t("DESTEAM")} />
      <div style={{ width: "100%", display: "flex" }}>
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#staticBackdrop"
        >
          {i18n.t("THEMNV")}
        </button>
        {!isloading ? (
          <button
            type="button"
            class="btn btn-primary"
            style={{ marginLeft: "1%" }}
            onClick={handleSaveClick}
          >
            {i18n.t("XOANV")}
          </button>
        ) : (
          <button
            style={{ marginLeft: "1%", backgroundColor: "grey" }}
            class="buttonload btn btn-primary"
          >
            <i class="fa fa-spinner fa-spin"></i> Deleting..
          </button>
        )}

        <button
          type="button"
          style={{ marginLeft: "1%" }}
          class="btn btn-primary"
          data-toggle="modal"
          onClick={handleEdit}
          data-target="#staticBackdropEdit"
          disabled={selectionModel.length !== 1}
        >
          {i18n.t("SUANV")}
        </button>

        <div
          class="modal fade"
          id="staticBackdropEdit"
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
                  {i18n.t("SUANV")}
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
                <label htmlFor="CCCD" name="idnew">
                  CCCD
                </label>
                <input
                  type="text"
                  name="idnew"
                  value={EditStaffForm.idnew}
                  onChange={onChangeEditStaffForm}
                ></input>
                <label htmlFor="picture">
                  {i18n.t("HINHANH_P")} CCCD Mặt trước
                </label>
                <input
                  accept="image/*"
                  onChange={convertoBase64Edit}
                  type="file"
                  id="picture"
                  name="picture"
                  onFocus={convertoBase64Edit}
                ></input>
                {stateimageEdit ? (
                  <img width={200} height={100} src={stateimageEdit}></img>
                ) : (
                  ""
                )}
                <label htmlFor="pictureTwo">
                  {i18n.t("HINHANH_P")} CCCD Mặt sau
                </label>
                <input
                  accept="image/*"
                  onChange={convertoBase64PicTwoEdit}
                  type="file"
                  id="pictureTwo"
                  name="pictureTwo"
                  onFocus={convertoBase64PicTwoEdit}
                ></input>
                {stateimageTwoEdit ? (
                  <img width={200} height={100} src={stateimageTwoEdit}></img>
                ) : (
                  ""
                )}
                <label htmlFor="name" name="name">
                  {i18n.t("TNV_TEAM")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={EditStaffForm.name}
                  onChange={onChangeEditStaffForm}
                ></input>
                <label htmlFor="phone"> {i18n.t("SDT_TEAM")}</label>
                <input
                  type="text"
                  name="phone"
                  value={EditStaffForm.phone}
                  onChange={onChangeEditStaffForm}
                ></input>
                <label htmlFor="Role"> {i18n.t("CV_TEAM")}</label>
                <input
                  type="text"
                  value={EditStaffForm.Role}
                  onChange={onChangeEditStaffForm}
                  name="Role"
                ></input>
                <label htmlFor="AccountBank"> {i18n.t("TTNH")}</label>
                <input
                  type="text"
                  value={EditStaffForm.AccountBank}
                  onChange={onChangeEditStaffForm}
                  name="AccountBank"
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
                  onClick={editstaff}
                  class="btn btn-primary"
                  data-dismiss="modal"
                >
                  {i18n.t("BTN_XACNHAN")}
                </button>
              </div>
            </div>
          </div>
        </div>

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
                  {i18n.t("THEMNV")}
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
              <div
                class="modal-body"
                style={{ color: "black", width: "320px" }}
              >
                {isError ? (
                  <span style={{ color: "red" }}>
                    *Lỗi xảy vui lòng điền đầy đủ thông tin
                  </span>
                ) : (
                  ""
                )}
                <label htmlFor="id"> {i18n.t("MNV_TEAM")} OR CCCD</label>
                <input
                  type="text"
                  name="id"
                  value={addStaffForm.id}
                  onChange={onChangeStaffForm}
                ></input>
                <label htmlFor="picture">
                  {i18n.t("HINHANH_P")} Mặt trước CCCD
                </label>
                <input
                  accept="image/*"
                  onChange={convertoBase64}
                  type="file"
                  id="picture"
                  name="picture"
                  onFocus={convertoBase64}
                ></input>
                {stateimage ? (
                  <img width={200} height={100} src={stateimage}></img>
                ) : (
                  ""
                )}

                <label htmlFor="pictureTwo">
                  {i18n.t("HINHANH_P")} Mặt sau CCCD
                </label>
                <input
                  accept="image/*"
                  onChange={convertoBase64PicTwo}
                  type="file"
                  id="pictureTwo"
                  name="pictureTwo"
                  onFocus={convertoBase64PicTwo}
                ></input>
                {stateimageTwo ? (
                  <img width={200} height={100} src={stateimageTwo}></img>
                ) : (
                  ""
                )}
                <label htmlFor="name"> {i18n.t("TNV_TEAM")}</label>
                <input
                  type="text"
                  name="name"
                  value={addStaffForm.name}
                  onChange={onChangeStaffForm}
                ></input>
                <label htmlFor="phone">{i18n.t("SDT_TEAM")}</label>
                <input
                  type="text"
                  name="phone"
                  value={addStaffForm.phone}
                  onChange={onChangeStaffForm}
                ></input>
                <label htmlFor="Role">{i18n.t("CV_TEAM")}</label>
                <input
                  type="text"
                  name="Role"
                  value={addStaffForm.Role}
                  onChange={onChangeStaffForm}
                ></input>
                <label htmlFor="AccountBank">{i18n.t("TTNH")}</label>
                <input
                  type="text"
                  name="AccountBank"
                  placeholder="Tên ngân hàng - Số ngân hàng"
                  value={addStaffForm.AccountBank}
                  onChange={onChangeStaffForm}
                ></input>
                <label htmlFor="ngayvao">{i18n.t("NV_TEAM")}</label>
                <input
                  type="text"
                  name="ngayvao"
                  placeholder="YYYY/MM/DD"
                  value={addStaffForm.ngayvao}
                  onChange={onChangeStaffForm}
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
                  onClick={addStaff}
                  class="btn btn-primary"
                  data-dismiss="modal"
                >
                  {i18n.t("BTN_XACNHAN")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <h3>{i18n.t("CN")}</h3>
          <select onChange={handle_getAllStaff} id="chinhanh">
            {stateBranch &&
              stateBranch.map((object, index) => (
                <React.Fragment key={index}>
                  {index === 0 ? (
                    <option selected id="target" value={object.branchID}>
                      {object.name}
                    </option>
                  ) : (
                    <option value={object.branchID}>{object.name}</option>
                  )}
                </React.Fragment>
              ))}
          </select>
          <br></br>
          <div style={{ position: "relative", top: "-176%" }}>
            <div className="BoxIMG drop-target">
              {" "}
              {stateViewimg ? (
                <img
                  src={stateViewimg}
                  alt="Image"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                `${i18n.t("clickdouble")}`
              )}
            </div>
          </div>
        </div>
      </div>
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
        <button onClick={handleExportExcel}>Export to Excel</button>

        <DataGrid
          zIndex={10}
          checkboxSelection
          editMode="row"
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={10}
          rows={stateStaff}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Team;
