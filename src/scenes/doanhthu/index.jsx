import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import React from "react";
import { GridToolbar } from "@mui/x-data-grid";
import HandleAccessAccount from "../handleAccess/handleAccess";
import {
  Get_all_Store,
  Get_all_store_By_userid,
} from "../contacts/handlestore";
import {
  Get_all_Phieu_Store_By_StoreID,
  Get_all_Phieu_Store,
  Update_PhieuStore_By_id,
} from "./handlePhieustore";
import { confirmAlert } from "react-confirm-alert";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import CSS của Bootstrap
import { Get_all_Order } from "./handlePhieustore";
import { createBills } from "./handlebills";
import { Get_all_Bill_By_userID } from "./handlebills";
import { Update_PhieuOrder_By_id } from "./handlebills";
import { GET_ALLBILL_BY_NOIMUA, Get_all_Bill } from "./handlebills";
import { GET_ALL_DOANHTHU_By_storeID } from "./handledoanhthu";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { converToName } from "../method";
import { GET_ALL_DOANHTHU_By_storeID_date } from "../debtor/handledoanhthu";
import * as XLSX from "xlsx";
const DOANHTHU = () => {
  const nav = useNavigate();
  useTranslation();
  const theme = useTheme();
  const [stateStore, setStateStore] = useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stateContentModal, setStatecontentModal] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPopupNHAPHANG, setShowPopupNHAPHANG] = useState(false);
  const [stateContentModalNHAPHANG, setStatecontentModalNHAPHANG] = useState(
    []
  );
  const [stateCheckAccess, setstateCheckAccess] = useState(false);
  const [stateHoadon, setStateHoadon] = useState([]);
  const [stateTongtien, setStateTongtien] = useState({
    tongdoanhthu: 0,
    tongtienno: 0,
  });
  const getMonthNameInVietnamese = (month) => {
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    return monthNames[month];
  };
  const handleDecrease = async () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);

    if (newDate.getMonth() === 11) {
      newDate.setFullYear(newDate.getFullYear());
    }
    setCurrentDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${getMonthNameInVietnamese(
      newDate.getMonth()
    )}`;

    await fetchingGetAllDoanhTHu_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
    // await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
  };
  const handleExportExcel = () => {
    const currentDate = new Date();

    // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = currentDate.getDate().toString().padStart(2, "0");

    // Tạo chuỗi datetime
    const datetimeString = `${year}-${month}-${day}`;
    const rows = stateHoadon.map((staff) => {
      return {
        [i18n.t("MADT_DT")]: staff.id,
        [i18n.t("MAKHO_DT")]: converToName[staff.storeID],
        [i18n.t("SOTIENTRATUCONNO")]: staff.sotien,
        [i18n.t("SOTIENDOANHTHU")]: staff.sotienThucte,

        [i18n.t("NGAYLAP_DT")]: staff.thoidiem,

        // Thêm các trường khác nếu cần
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Điều chỉnh chiều rộng của cột (ví dụ: cột 'A' sẽ rộng hơn)
    ws["!cols"] = [
      { width: 15 },

      { width: 40 },
      { width: 20 },
      { width: 30 },
      { width: 30 },
      { width: 20 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Revenues Data");
    XLSX.writeFile(
      wb,
      "Revenues_" + converToName[statechinhanh] + "_" + datetimeString + ".xlsx"
    );
  };
  const formattedDate = `${currentDate.getFullYear()}-${getMonthNameInVietnamese(
    currentDate.getMonth()
  )}`;

  const handleIncrease = async () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate.getMonth() === 0) {
      newDate.setFullYear(newDate.getFullYear());
    }
    setCurrentDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${getMonthNameInVietnamese(
      newDate.getMonth()
    )}`;

    await fetchingGetAllDoanhTHu_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
    // await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
  };
  const handleOpenPopupNHAPHANG = (content) => {
    setShowPopupNHAPHANG(true);
    setStatecontentModalNHAPHANG(content);
  };
  const handleClosePopupNHAPHANG = () => {
    setShowPopupNHAPHANG(false);
    setStatecontentModalNHAPHANG([]);
  };

  const handleOpenPopup = (content) => {
    setShowPopup(true);
    setStatecontentModal(content);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setStatecontentModal([]);
  };

  const [statelenghtID_bill, setstatelenghtID_bill] = useState(0);
  let chinhanhdau = "";
  let checkaccess = false;
  const convertStoreID = (params) => {
    const arrayObject = params.value;

    return (
      <>
        <span>
          {params.value} - {converToName[arrayObject]}
        </span>
      </>
    );
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
        nav("/");
      }
    } else {
      if (check === "true" || check) {
        checkaccess = true;
      } else {
        checkaccess = false;
        nav("/");
      }
    }
  };
  const colors = tokens(theme.palette.mode);
  const getlenghtID_Bill = () => {
    // Tách phần số từ chuỗi 'id' và chuyển đổi thành số nguyên

    const arrayOfNumbers = stateHoadon.map((obj) =>
      parseInt(obj.id.replace(/[^\d]/g, ""), 10)
    );

    // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
    let maxNumber = Math.max(...arrayOfNumbers);
    const result = 1 / 0;

    const negativeInfinity = -1 / 0;

    if (maxNumber === negativeInfinity || maxNumber === result) {
      maxNumber = 0;
    }
    let lenghtState = maxNumber + 1;

    setstatelenghtID_bill(lenghtState);
  };
  function StatusMoney(params) {
    const arrayObject = params.value;

    // Định dạng số thành chuỗi với dấu phân cách
    const formattedNumber = parseInt(arrayObject).toLocaleString("en-US");
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
        {formattedNumber} VND
      </span>
    );
  }
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
  const columns = [
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
      headerName: `${i18n.t("SOTIENTRATUCONNO")}`,
      renderCell: StatusMoney,
      flex: 1,
    },
    {
      field: "sotienThucte",
      headerName: `${i18n.t("SOTIENDOANHTHU")}`,
      renderCell: StatusMoney,
      flex: 1,
    },

    // {
    //   field: "thoidiem",
    //   headerName: `${i18n.t("NGAYLAP_DT")}`,
    //   renderCell: formatDatetime,
    //   flex: 1,
    // },
    {
      field: "Listdebtors",
      headerName: `${i18n.t("DSCONNO_DT")}`,
      renderCell: ArrayObjectCell,
      flex: 1,
    },
    {
      field: "ListOfCreditors",
      headerName: `${i18n.t("DSNOXACNHANNHAPHANG")}`,
      renderCell: ArrayObjectCellNHAPHANG,
      flex: 1,
    },
  ];
  const CustomPopup = ({ show, handleClose, content }) => {
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
  const CustomPopupNHAPHANG = ({ show, handleClose, content }) => {
    const sumSotienNo = content.reduce((acc, debtor) => {
      return acc + parseInt(debtor.sotien, 10);
    }, 0);
    return (
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header style={{ color: "black" }} closeButton>
          <Modal.Title>Tổng số tiền đã trả : {sumSotienNo}</Modal.Title>
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
                  <th>Số tiền trả</th>
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
  function ArrayObjectCell(params) {
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
              onClick={() => handleOpenPopup(arrayObject)}
            >
              {" "}
              {numberOfItems} Items
            </button>
            {showPopup ? (
              <CustomPopup
                show={showPopup}
                handleClose={handleClosePopup}
                content={stateContentModal}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    );
  }

  const handle_getAllDOANHTHU = async (e) => {
    await fetchingGetAllDoanhTHu_by_STOREID_year_month(
      e.target.value,
      formattedDate
    );
    setStatechinhanh(e.target.value);
  };
  const fetchingGetAllDoanhTHu_by_STOREID_year_month = async (x, y) => {
    const fetch = {
      storeID: x,
      thoidiem: y,
    };
    const check = await GET_ALL_DOANHTHU_By_storeID_date(fetch);
    let sotienthucte = 0;
    let sotienNo = 0;
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateHoadon(JSON.parse(resolvedResult));

      resolvedResult.forEach((element) => {
        sotienthucte += parseFloat(element.sotienThucte);
        sotienNo += parseFloat(element.sotien);
      });
      setStateTongtien({
        ...stateTongtien,
        tongdoanhthu: sotienthucte,
        tongtienno: sotienNo,
      });
    } else {
      setStateHoadon(JSON.parse(check));
      JSON.parse(check).forEach((element) => {
        sotienthucte += parseFloat(element.sotienThucte);
        sotienNo += parseFloat(element.sotien);
      });
      setStateTongtien({
        ...stateTongtien,
        tongdoanhthu: sotienthucte,
        tongtienno: sotienNo,
      });
    }
  };

  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    await fetchingGetAllDoanhTHu_by_STOREID_year_month(
      chinhanhdau,
      formattedDate
    );
    setStatechinhanh(chinhanhdau);
  };
  useEffect(() => {
    try {
      fetchingapi();
      getlenghtID_Bill();
    } catch (error) {}
  }, []);

  const handleSelectionModelChange = (newSelectionModel) => {
    if (
      newSelectionModel.some(
        (selectedId) =>
          statePhieuStore.find((row) => row.id === selectedId)?.status ===
          "DONE"
      )
    ) {
      return;
    }
    setSelectionModel(newSelectionModel);
  };
  const fetchingStore = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = Get_all_Store();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;
        setStateStore(JSON.parse(resolvedResult));

        chinhanhdau = JSON.parse(resolvedResult)[0].id;
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức
        setStateStore(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].id;
      }
    } else {
      const objBranch = Get_all_store_By_userid();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        setStateStore(JSON.parse(resolvedResult));
        chinhanhdau = JSON.parse(resolvedResult)[0].id;
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức
        setStateStore(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].id;
      }
    }
  };
  return (
    <Box m="20px">
      <Header
        title={i18n.t("TITLEDOANHTHU")}
        subtitle={i18n.t("DESDOANHTHU")}
      />

      <div style={{ marginLeft: "-1%" }} className="container">
        <h3>{i18n.t("CN")}</h3>
        <select onChange={handle_getAllDOANHTHU} id="chinhanh">
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
      </div>
      <Box mt="40px">
        {" "}
        <h4>{i18n.t("THOIDIEMLAP")} YYYY-MM</h4>
        <div>
          <Button
            onClick={handleDecrease}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            {"<"}
          </Button>
          <label style={{ width: "200px", textAlign: "center" }}>
            {formattedDate}
          </label>

          <Button
            onClick={handleIncrease}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            {">"}
          </Button>
        </div>
      </Box>
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
        <span>
          *Tổng doanh thu :{" "}
          <span style={{ color: "green", fontSize: "1.1rem" }}>
            {" "}
            {parseInt(stateTongtien.tongdoanhthu).toLocaleString("en-US")} VND
          </span>
        </span>
        <br></br>
        <span>
          *Tổng số tiền trả từ con nợ :
          <span style={{ color: "green", fontSize: "1.1rem" }}>
            {" "}
            {parseInt(stateTongtien.tongtienno).toLocaleString("en-US")} VND
          </span>
        </span>
        <br></br>
        <br></br>
        <button onClick={handleExportExcel}>Export Excel</button>
        <DataGrid
          editMode="row"
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={31}
          rows={stateHoadon}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default DOANHTHU;
