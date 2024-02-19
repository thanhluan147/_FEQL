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
import { Modal } from "react-bootstrap";
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
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { converBranchIDTOStoreID, converToName } from "../method";
import { Get_all_Product_By_StoreID } from "../contacts/handleproduct";
import { Get_all_Phieu_Store_By_StoreID } from "../invoices/handlePhieustore";
import { getAllOrder_BY_storeID } from "../Order/handleform";
import { GET_ALLBILL_BY_NOIMUA } from "../bill/handlebills";
import { GET_ALL_DOANHTHU_By_storeID } from "../doanhthu/handledoanhthu";
import { GET_ALLDEBTOR_BY_Debtor_BranchID } from "../debtor/handleDebtor";
const DETAILS = () => {
  const [showPopupNK, setShowPopupNK] = useState(false);
  const [stateContentModalNK, setStatecontentModalNK] = useState([]);

  const [showPopupXK, setShowPopupXK] = useState(false);
  const [stateContentModalXK, setStatecontentModalXK] = useState([]);

  const [showPopupDT, setShowPopupDT] = useState(false);
  const [stateContentModalDT, setStatecontentModalDT] = useState([]);

  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [statePhieuStoreXK, setStatePhieuStoreXK] = useState([]);
  const [stateHoadon, setStateHoadon] = useState([]);
  const [stateDOANHTHU, setstateDOANHTHU] = useState([]);
  const [stateDebtor, setstateDebtor] = useState([]);

  const [state1, setState1] = useState(false);
  const [state2, setState2] = useState(false);
  const [state3, setState3] = useState(false);
  const [state4, setState4] = useState(false);
  const [state5, setState5] = useState(false);
  const [state6, setState6] = useState(false);
  const [state7, setState7] = useState(false);
  const [showPopupNHAPHANG, setShowPopupNHAPHANG] = useState(false);
  const [stateContentModalNHAPHANG, setStatecontentModalNHAPHANG] = useState(
    []
  );

  const handleOpenPopupNHAPHANG = (content) => {
    setShowPopupNHAPHANG(true);
    setStatecontentModalNHAPHANG(content);
  };
  const handleClosePopupNHAPHANG = () => {
    setShowPopupNHAPHANG(false);
    setStatecontentModalNHAPHANG([]);
  };

  // Hàm xử lý khi nhấn vào nút
  const handleButtonClick = (stateNumber) => {
    // Đặt trạng thái tương ứng thành true và tất cả các trạng thái khác thành false
    setState1(stateNumber === 1);
    setState2(stateNumber === 2);
    setState3(stateNumber === 3);
    setState4(stateNumber === 4);
    setState5(stateNumber === 5);
    setState6(stateNumber === 6);
    setState7(stateNumber === 7);
  };
  const convertStoreID = (params) => {
    const arrayObject = params.value;

    return (
      <>
        <span>
          {" "}
          {arrayObject} - {converToName[arrayObject]}
        </span>
      </>
    );
  };
  const formatDatetime = (params) => {
    const arrayObject = params.value.toString();

    const isoString = arrayObject;

    // Tạo một đối tượng Date từ chuỗi ISO 8601
    const dateObject = new Date(isoString);

    // Định dạng ngày giờ theo định dạng mong muốn (năm-tháng-ngày giờ:phút:giây)
    const formattedDateTime = `${dateObject.getFullYear()}-${(
      dateObject.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateObject
      .getDate()
      .toString()
      .padStart(2, "0")} ${dateObject
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateObject
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${dateObject
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    return (
      <>
        <span>{formattedDateTime}</span>
      </>
    );
  };
  const handleOpenPopupNK = (content) => {
    setShowPopupNK(true);
    setStatecontentModalNK(content);
  };
  const handleClosePopupNK = () => {
    setShowPopupNK(false);
    setStatecontentModalNK([]);
  };

  const handleOpenPopupXK = (content) => {
    setShowPopupXK(true);
    setStatecontentModalXK(content);
  };
  const handleClosePopupXK = () => {
    setShowPopupXK(false);
    setStatecontentModalXK([]);
  };

  const handleOpenPopupDT = (content) => {
    setShowPopupDT(true);
    setStatecontentModalDT(content);
  };
  const handleClosePopupDT = () => {
    setShowPopupDT(false);
    setStatecontentModalDT([]);
  };
  const fetchingGettAllPhieu_by_StoreID = async (x) => {
    const check = await Get_all_Phieu_Store_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStatePhieuStore(JSON.parse(resolvedResult));
    } else {
      setStatePhieuStore(JSON.parse(check));
    }
  };
  const CustomPopup = ({ show, handleClose, content }) => {
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Popup Title</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxWidth: "100%", overflow: "scroll", maxHeight: "500px" }}
        >
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{i18n.t("TEN_P")}</th>
                  <th>{i18n.t("LOAI_P")}</th>
                  <th>{i18n.t("SOLUONG_P")}</th>

                  <th>{i18n.t("HINHANH_P")}</th>
                  <th>{i18n.t("SOTIEN_P")}</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.loai}</td>
                    <td>{item.soluong}</td>

                    <td>
                      {item.picture ? (
                        <img width={200} height={100} src={item.picture}></img>
                      ) : (
                        ""
                      )}
                    </td>
                    <th>{item.sotien}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  const CustomPopupNK = ({ show, handleClose, content }) => {
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Popup Title</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxWidth: "100%", overflow: "scroll", maxHeight: "500px" }}
        >
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{i18n.t("TEN_P")}</th>
                  <th>{i18n.t("LOAI_P")}</th>
                  <th>{i18n.t("SOLUONG_P")}</th>

                  <th>{i18n.t("HINHANH_P")}</th>
                  <th>{i18n.t("SOTIEN_P")}</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.loai}</td>
                    <td>{item.soluong}</td>

                    <td>
                      {item.picture ? (
                        <img width={200} height={100} src={item.picture}></img>
                      ) : (
                        ""
                      )}
                    </td>
                    <th>{item.sotien}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  const columnsTeam = [
    { field: "id", headerName: `${i18n.t("MNV_TEAM")}`, editable: true },
    {
      field: "name",
      headerName: `${i18n.t("TNV_TEAM")}`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
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
  const ColumnsStore = [
    { field: "id", headerName: `${i18n.t("MASP_P")}`, flex: 0.5 },

    {
      field: "name",
      headerName: `${i18n.t("TEN_P")}`,
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "loai",
      headerName: `${i18n.t("LOAI_P")}`,
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "picture",
      headerName: `${i18n.t("HINHANH_P")}`,
      flex: 1,
      width: 130,
      renderCell: ImageCell,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "soluong",
      headerAlign: "left",
      headerName: `${i18n.t("SOLUONG_P")}`,
      flex: 1,
    },
    {
      field: "xuatxu",
      headerName: `Xuất xứ`,
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "status",
      headerAlign: "left",
      headerName: `${i18n.t("TINHTRANG_P")}`,
      flex: 1,
    },
    {
      field: "sotien",
      headerName: `Số tiền`,
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "behavior",
      headerAlign: "left",
      headerName: `${i18n.t("HANHVI_P")}`,
      flex: 1,
    },
  ];
  function ImageCell(params) {
    return (
      <img
        src={params.value}
        alt="Image"
        style={{
          width: "60%",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    );
  }
  const columnHD = [
    { field: "id", flex: 1, headerName: `${i18n.t("MAHD_HD")}` },
    {
      field: "phieuxuatID",
      headerName: `Phiếu xuất`,
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "noiban",
      headerName: `${i18n.t("NOIBAN_HD")}`,
      renderCell: convertStoreID,
      flex: 1,
    },

    {
      field: "giaban",
      headerName: `${i18n.t("GIABAN_HD")}`,

      flex: 1,
    },
    {
      field: "giamua",
      headerName: `${i18n.t("GIAMUA_HD")}`,

      flex: 1,
    },

    {
      field: "CreateAt",
      headerName: `${i18n.t("NGAYLAP_HD")}`,
      renderCell: formatDatetime,
      flex: 1,
    },
  ];
  const columns = [
    { field: "id", flex: 1, headerName: `${i18n.t("MAKHO_NP")}` },
    // {
    //   field: "userID",
    //   headerName: `${i18n.t("MTK_NP")}`,
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },

    {
      field: "status",
      headerName: `${i18n.t("TINHTRANG_NP")}`,
      flex: 1,
      renderCell: StatusObjectCell,
    },
    {
      field: "sotien",
      headerName: `${i18n.t("SOTIEN_NP")}`,
      renderCell: StatusMoney,
      flex: 1,
    },
    {
      field: "ngaylap",
      headerName: `Thời điểm tạo phiếu`,

      flex: 1,
    },
    {
      field: "createDate",
      headerName: `${i18n.t("NGAYLAPPHIEU_NP")}`,
      renderCell: UpdatedateObjectCell,
      flex: 1,
    },
    {
      field: "updateDate",
      headerName: `${i18n.t("NGAYCAPNHAT_NP")}`,

      flex: 1,
    },
    {
      field: "arrayProduct",
      headerName: `${i18n.t("SOLUONGSP_NP")}`,
      flex: 1,
      renderCell: ArrayObjectCellNK,
    },
  ];
  const columnDebtor = [
    { field: "id", flex: 1, headerName: `${i18n.t("MA_CN")}` },
    {
      field: "Owner_BranchID",
      headerName: `${i18n.t("CHUNO_CN")}`,
      flex: 1,
      renderCell: convertStoreID,
      cellClassName: "name-column--cell",
    },

    {
      field: "ThoiDiemNo",
      headerName: `${i18n.t("THOIDIEMNO_CN")}`,
      flex: 1,
    },
    {
      field: "sotienNo",
      headerName: `${i18n.t("SOTIENNO_CN")}`,
      flex: 1,
    },
    {
      field: "LastPaymentDate",
      headerName: `${i18n.t("LANCUOICAPNHAT")}`,
      flex: 1,
    },
  ];
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

  function StatusMoney(params) {
    const arrayObject = params.value;

    return (
      <span
        style={{
          backgroundColor: "green",
          width: "100%",
          textAlign: "center",
          borderRadius: "5%",
          fontSize: "1.1rem",
        }}
      >
        {arrayObject} VND
      </span>
    );
  }
  function StatusObjectCell(params) {
    const arrayObject = params.value;
    if (arrayObject === "ACCEPT") {
      return (
        <span
          style={{
            backgroundColor: "green",
            width: "100%",
            textAlign: "center",
            borderRadius: "5%",
            fontSize: "1.1rem",
          }}
        >
          {arrayObject}
        </span>
      );
    }
    if (arrayObject === "CANCEL") {
      return (
        <span
          style={{
            backgroundColor: "#ed3333",
            width: "100%",
            textAlign: "center",
            borderRadius: "5%",
            fontSize: "1.1rem",
          }}
        >
          {arrayObject}
        </span>
      );
    } else {
      return (
        <span
          style={{
            backgroundColor: "orange",
            width: "100%",
            textAlign: "center",
            borderRadius: "5%",
            fontSize: "1.1rem",
          }}
        >
          {arrayObject}
        </span>
      );
    }
  }

  function ArrayObjectCellNK(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;

    return (
      <>
        <div>
          <button
            class="btn41-43 btn-43"
            onClick={() => handleOpenPopupNK(arrayObject)}
          >
            {" "}
            {numberOfItems} Items
          </button>

          {showPopupNK ? (
            <CustomPopupNK
              show={showPopupNK}
              handleClose={handleClosePopupNK}
              content={stateContentModalNK}
            />
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
  const CustomPopupXK = ({ show, handleClose, content }) => {
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Popup Title</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxWidth: "100%", overflow: "scroll", maxHeight: "500px" }}
        >
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại sản phẩm</th>
                  <th>Số lượng</th>

                  <th>Hình ảnh</th>
                  <th>Hành vi</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.loai}</td>
                    <td>{item.soluong}</td>

                    <td>
                      {item.picture ? (
                        <img width={200} height={100} src={item.picture}></img>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>{item.behavior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  function ArrayObjectCellXK(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;

    return (
      <>
        <div>
          <button
            class="btn41-43 btn-43"
            onClick={() => handleOpenPopupXK(arrayObject)}
          >
            {" "}
            {numberOfItems} Items
          </button>

          {showPopupXK ? (
            <CustomPopupXK
              show={showPopupXK}
              handleClose={handleClosePopupXK}
              content={stateContentModalXK}
            />
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
  const columnXuatkho = [
    { field: "id", flex: 1, headerName: `${i18n.t("MAPX_PX")}` },
    {
      field: "phieustoreID",
      headerName: `${i18n.t("MAPN_PX")}`,
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "status",
      headerName: `${i18n.t("TINHTRANG_PX")}`,
      renderCell: StatusObjectCell,
      flex: 1,
    },

    {
      field: "CreateAt",
      headerName: `${i18n.t("NGAYLAP_PX")}`,
      renderCell: UpdatedateObjectCell,
      flex: 1,
    },
    {
      field: "updateDate",
      headerName: `${i18n.t("NGAYCAPNHAT_PX")}`,
      flex: 1,
    },
    {
      field: "arrayProduct",
      headerName: `${i18n.t("SOLUONGSP_PX")}`,
      flex: 1,
      renderCell: ArrayObjectCellXK,
    },
  ];
  const columnHOADON = [
    { field: "id", flex: 1, headerName: `${i18n.t("MAHD_HD")}` },
    {
      field: "phieuxuatID",
      headerName: `Phiếu xuất`,
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "noiban",
      headerName: `${i18n.t("NOIBAN_HD")}`,
      renderCell: convertStoreID,
      flex: 1,
    },

    {
      field: "giaban",
      headerName: `${i18n.t("GIABAN_HD")}`,

      flex: 1,
    },
    {
      field: "giamua",
      headerName: `${i18n.t("GIAMUA_HD")}`,

      flex: 1,
    },

    {
      field: "CreateAt",
      headerName: `${i18n.t("NGAYLAP_HD")}`,
      renderCell: formatDatetime,
      flex: 1,
    },
  ];
  const CustomPopupDT = ({ show, handleClose, content }) => {
    const sumSotienNo = content.reduce((acc, debtor) => {
      return acc + parseInt(debtor.sotienNo, 10);
    }, 0);
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header style={{ color: "black" }} closeButton>
          <Modal.Title>Tổng số tiền nợ : {sumSotienNo}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxWidth: "100%", overflow: "scroll", maxHeight: "500px" }}
        >
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã phiếu nợ</th>
                  <th>Chi nhánh nợ</th>
                  <th>Số tiền nợ</th>

                  <th>Thời điểm nợ</th>
                  <th>Lần cuối cập nhật số tiền</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.Debtor_BranchID} -{" "}
                      {converToName[item.Debtor_BranchID]}
                    </td>

                    <td>{item.sotienNo}</td>
                    <td>{item.ThoiDiemNo}</td>

                    <td>{item.LastPaymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  const columnDOANHTHU = [
    { field: "id", flex: 1, headerName: `${i18n.t("MADT_DT")}` },
    {
      field: "storeID",
      headerName: `${i18n.t("MAKHO_DT")}`,
      flex: 1,
      renderCell: convertStoreID,
      cellClassName: "name-column--cell",
    },

    {
      field: "sotien",
      headerName: `Số tiền đã trả từ con nợ`,
      flex: 1,
    },
    {
      field: "sotienThucte",
      headerName: `Số tiền doanh thu`,
      flex: 1,
    },

    {
      field: "thoidiem",
      headerName: `${i18n.t("NGAYLAP_DT")}`,
      renderCell: formatDatetime,
      flex: 1,
    },
    {
      field: "Listdebtors",
      headerName: `${i18n.t("DSCONNO_DT")}`,
      renderCell: ArrayObjectCellDT,
      flex: 1,
    },
    {
      field: "ListOfCreditors",
      headerName: `${i18n.t("DSNOXACNHANNHAPHANG")}`,
      renderCell: ArrayObjectCellNHAPHANG,
      flex: 1,
    },
  ];
  const CustomPopupNHAPHANG = ({ show, handleClose, content }) => {
    const sumSotienNo = content.reduce((acc, debtor) => {
      return acc + parseInt(debtor.sotien, 10);
    }, 0);
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header style={{ color: "black" }} closeButton>
          <Modal.Title>Tổng số tiền nợ : {sumSotienNo}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxWidth: "100%", overflow: "scroll", maxHeight: "500px" }}
        >
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã phiếu nhập</th>
                  <th>Mã chi nhánh</th>
                  <th>Số tiền nợ</th>

                  <th>Ngày lập phiếu</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.StoreID} - {converToName[item.StoreID]}
                    </td>

                    <td>{item.sotien}</td>
                    <td>{item.ngaylap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  function ArrayObjectCellNHAPHANG(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;

    return (
      <>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <button
              class="btn41-43 btn-43"
              onClick={() => handleOpenPopupNHAPHANG(arrayObject)}
            >
              {" "}
              {numberOfItems} Items
            </button>
            {showPopupNHAPHANG ? (
              <CustomPopupNHAPHANG
                show={showPopupNHAPHANG}
                handleClose={handleClosePopupNHAPHANG}
                content={stateContentModalNHAPHANG}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }
  function ArrayObjectCellDT(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;

    return (
      <>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <button
              class="btn41-43 btn-43"
              onClick={() => handleOpenPopupDT(arrayObject)}
            >
              {" "}
              {numberOfItems} Items
            </button>
            {showPopupDT ? (
              <CustomPopupDT
                show={showPopupDT}
                handleClose={handleClosePopupDT}
                content={stateContentModalDT}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }
  const fetchingGetAllDoanhTHu_by_STOREID = async (x) => {
    const check = await GET_ALL_DOANHTHU_By_storeID(x);
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setstateDOANHTHU(JSON.parse(resolvedResult));
    } else {
      setstateDOANHTHU(JSON.parse(check));
    }
  };
  const fetchingGetAllHoaDon_by_STOREID = async (x) => {
    const check = await GET_ALLBILL_BY_NOIMUA(x);
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateHoadon(JSON.parse(resolvedResult));
    } else {
      setStateHoadon(JSON.parse(check));
    }
  };
  const fetchingOrderBy_storeID = async (x) => {
    const check = await getAllOrder_BY_storeID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStatePhieuStoreXK(JSON.parse(resolvedResult));
    } else {
      setStatePhieuStoreXK(JSON.parse(check));
    }
  };

  const nav = useNavigate();
  const location = useLocation();
  const { state } = location;

  // Truy cập giá trị từ state
  const storeID = state?.storeID;
  useTranslation();
  const [stateStaff, setStateStaff] = useState([]);
  const [stateBranchID, setstateBranchID] = useState(storeID);
  const [stateProduct, setStateProduct] = useState([]);
  const [stateStoreID, setstoreID] = useState(
    `${converBranchIDTOStoreID[storeID]}`
  );
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

  const [stateBranch, setStateBranch] = useState([]);
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
  const fetchingGettAllProduct_by_storeID = async (x) => {
    const check = await Get_all_Product_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateProduct(JSON.parse(resolvedResult));
    } else {
      setStateProduct(JSON.parse(check));
    }
  };
  const fetchingGetAllDEBTOR_by_STOREID = async (x) => {
    const check = await GET_ALLDEBTOR_BY_Debtor_BranchID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setstateDebtor(JSON.parse(resolvedResult));
    } else {
      setstateDebtor(JSON.parse(check));
    }
  };
  const fetchingapi = async () => {
    await fetchingGettAllStaft_by_branchID(stateBranchID);
    await fetchingGettAllProduct_by_storeID(stateStoreID);
    await fetchingGettAllPhieu_by_StoreID(stateStoreID);
    await fetchingOrderBy_storeID(stateStoreID);
    await fetchingGetAllHoaDon_by_STOREID(stateStoreID);
    await fetchingGetAllDoanhTHu_by_STOREID(stateStoreID);
    await fetchingGetAllDEBTOR_by_STOREID(stateStoreID);
  };
  useEffect(() => {
    checkAccess();
    fetchingapi();
  }, []);
  const rowsWithId = stateBranch.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  return (
    <>
      <Box m="20px">
        <Header title={i18n.t("CTTONGQUAN")} subtitle={i18n.t("DESBRANCH")} />
        <h5>
          *{i18n.t("MA_B")} : {storeID}
        </h5>
        <h5>
          *{i18n.t("MA_KHO")} : {converBranchIDTOStoreID[storeID]}
        </h5>
        <h5>
          *{i18n.t("TEN_B")} : {converToName[converBranchIDTOStoreID[storeID]]}
        </h5>
        <div className="Top">
          <button onClick={() => handleButtonClick(1)} class="bn30">
            {i18n.t("CT_NV")}
          </button>

          <button onClick={() => handleButtonClick(2)} class="bn30">
            {i18n.t("CT_KHO")}
          </button>

          <button onClick={() => handleButtonClick(3)} class="bn30">
            {i18n.t("CT_NK")}
          </button>

          <button onClick={() => handleButtonClick(4)} class="bn30">
            {i18n.t("CT_XK")}
          </button>
          <button onClick={() => handleButtonClick(5)} class="bn30">
            {i18n.t("CT_HD")}
          </button>
          <button onClick={() => handleButtonClick(6)} class="bn30">
            {i18n.t("CT_DOANHTHU")}
          </button>
          <button onClick={() => handleButtonClick(7)} class="bn30">
            {i18n.t("CT_CONNO")}
          </button>
        </div>
      </Box>

      {state1 ? (
        <div style={{ marginTop: "2%" }}>
          <h3 style={{ textAlign: "center" }}> {i18n.t("CT_NV")}</h3>
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
              editMode="row"
              components={{
                Toolbar: GridToolbar,
              }}
              pageSize={10}
              rows={stateStaff}
              columns={columnsTeam}
            />
          </Box>
        </div>
      ) : (
        ""
      )}

      {state2 ? (
        <div style={{ marginTop: "2%" }}>
          <h3 style={{ textAlign: "center" }}> {i18n.t("CT_KHO")}</h3>
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
              editMode="row"
              rows={stateProduct}
              columns={ColumnsStore}
              pageSize={10}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
        </div>
      ) : (
        ""
      )}

      {state3 ? (
        <div style={{ marginTop: "2%" }}>
          <h3 style={{ textAlign: "center" }}>{i18n.t("CT_NK")}</h3>
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
              editMode="row"
              checkboxSelection
              components={{
                Toolbar: GridToolbar,
              }}
              pageSize={10}
              rows={statePhieuStore}
              columns={columns}
            />
          </Box>
        </div>
      ) : (
        ""
      )}

      {state4 ? (
        <div style={{ marginTop: "2%" }}>
          <h3 style={{ textAlign: "center" }}>{i18n.t("CT_XK")}</h3>
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
              editMode="row"
              components={{
                Toolbar: GridToolbar,
              }}
              pageSize={10}
              rows={statePhieuStoreXK}
              columns={columnXuatkho}
            />
          </Box>
        </div>
      ) : (
        ""
      )}

      {state5 ? (
        <div style={{ marginTop: "2%" }}>
          <h3 style={{ textAlign: "center" }}>{i18n.t("CT_HD")}</h3>
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
              editMode="row"
              components={{
                Toolbar: GridToolbar,
              }}
              pageSize={10}
              rows={stateHoadon}
              columns={columnHD}
            />
          </Box>
        </div>
      ) : (
        ""
      )}

      {state6 ? (
        <div style={{ marginTop: "2%" }}>
          <h3 style={{ textAlign: "center" }}>{i18n.t("CT_DOANHTHU")}</h3>
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
              editMode="row"
              components={{
                Toolbar: GridToolbar,
              }}
              pageSize={31}
              rows={stateDOANHTHU}
              columns={columnDOANHTHU}
            />
          </Box>
        </div>
      ) : (
        ""
      )}

      {state7 ? (
        <div style={{ marginTop: "2%" }}>
          <h3 style={{ textAlign: "center" }}>{i18n.t("CT_CONNO")}</h3>
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
              editMode="row"
              components={{
                Toolbar: GridToolbar,
              }}
              pageSize={10}
              rows={stateDebtor}
              columns={columnDebtor}
            />
          </Box>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default DETAILS;
