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

import { confirmAlert } from "react-confirm-alert";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import CSS của Bootstrap
import { Get_all_Order } from "./handlePhieustore";
import {
  createBills,
  Get_all_Bill_By_userID,
  Update_PhieuOrder_By_id,
} from "./handlebills";
import { Update_ListOfCreditors_Listdebtors_By_id } from "../doanhthu/handledoanhthu";
import { createDebtor, Get_all_DEBTOR } from "./handleCreateDebtor";
import { Update_DOANHTHU_BY_storeID_thoidiem } from "./handleCreateDebtor";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { EditProduct } from "../contacts/handleproduct";
import { DeletePhieuOrder } from "./handlePhieustore";
import { useNavigate } from "react-router-dom";
import { getAllOrder_BY_storeID } from "../Order/handleform";
import { CreateIdMaxValueOfarray } from "../method";
import {
  UPdateProductStatusOrder,
  Get_all_Order_By_StoreID_Year_Month,
} from "./handlePhieustore";

const Invoices = () => {
  useTranslation();
  const theme = useTheme();
  const [stateStore, setStateStore] = useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stateContentModal, setStatecontentModal] = useState([]);
  const [stateCheckAccess, setstateCheckAccess] = useState(false);
  const [stateHoadon, setStateHoadon] = useState([]);
  const [selectedRow, setSelectedRow] = React.useState([]);
  const [isloading, setisloading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stateFormBills, setStateFormbills] = useState({
    id: "",
    OrderID: "",
    sotien: "",
    userID: "",
    noiban: "",
    noimua: "",
    giaban: 0,
    giamua: 0,
    phieuxuatID: "",
  });
  let chinhanhdau = "";
  let code = "";
  const [stateCode, setstateCode] = useState("");
  const [statelenghtID_bill, setstatelenghtID_bill] = useState(0);

  // Sử dụng state để lưu trạng thái của checkbox
  const [isCheckedNoiban, setIsCheckedNoiban] = useState(false);
  const [isCheckedNoimua, setIsCheckedNoimua] = useState(false);

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
    await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
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
    await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
  };

  // Hàm xử lý sự kiện khi checkbox thay đổi trạng thái
  const handleCheckboxNoibanChange = () => {
    setIsCheckedNoiban(!isCheckedNoiban); // Đảo ngược trạng thái hiện tại
    // Bạn có thể thực hiện các hành động khác ở đây nếu cần thiết
  };
  const [selectedOptionnoiban, setSelectedOptionnoiban] = useState("");
  const handleSelectChangeNoiban = (event) => {
    const selectedValue = event.target.value;
    setSelectedOptionnoiban(selectedValue);
  };

  const [selectedOptionnoimua, setSelectedOptionnoimua] = useState("");
  const handleSelectChangeNoimua = (event) => {
    const selectedValue = event.target.value;
    setSelectedOptionnoimua(selectedValue);
  };

  const handleCheckboxNoiMuaChange = () => {
    setIsCheckedNoimua(!isCheckedNoimua); // Đảo ngược trạng thái hiện tại
    // Bạn có thể thực hiện các hành động khác ở đây nếu cần thiết
  };
  const nav = useNavigate();
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
  const handleOpenPopup = (content) => {
    setShowPopup(true);
    setStatecontentModal(content);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setStatecontentModal([]);
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
  const onChangeFormBills = (event) => {
    getlenghtID_Bill();

    setStateFormbills({
      ...stateFormBills,
      id: "HD" + statelenghtID_bill,
      OrderID: selectionModel[0],

      userID: localStorage.getItem("id"),
      [event.target.name]: event.target.value,
    });
  };
  const caculategiaban = () => {
    setStateFormbills({
      ...stateFormBills,
      giaban:
        parseFloat(stateFormBills.giamua) +
        parseFloat(stateFormBills.giamua) * 0.15,
    });
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

  const columns = [
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
      renderCell: ArrayObjectCell,
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
  function StatusObjectCell(params) {
    const arrayObject = params.value;
    if (arrayObject === "PENDING") {
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
    } else {
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
  }
  const deletedphieu = async () => {
    setisloading(true);
    try {
      const checkde = await DeletePhieuOrder(selectedRow);

      if (JSON.parse(checkde).success) {
        alert("Đã xóa thành công");
        setisloading(false);
      }

      await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
    } catch (error) {
      console.log(error);
    }
  };
  const AcceptRequest = async () => {
    try {
      const checkde = await UPdateProductStatusOrder(selectedRow);

      if (JSON.parse(checkde).success) {
        alert("Đã update thành công");
        setSelectionModel([]);
      }

      await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
    } catch (error) {
      console.log(error);
    }
  };
  function ArrayObjectCell(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;

    return (
      <>
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
      </>
    );
  }

  const fetchingGettAllPhieuXuat = async () => {
    const check = await Get_all_Order();

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStatePhieuStore(JSON.parse(resolvedResult));
    } else {
      setStatePhieuStore(JSON.parse(check));
    }
  };
  const fetchingGetAllHoaDon = async () => {
    const check = await Get_all_Bill_By_userID();
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateHoadon(JSON.parse(resolvedResult));
    } else {
      setStateHoadon(JSON.parse(check));
    }
  };

  const fetchingapi = async () => {
    //  await fetchingOrderBy_storeID(statc);
    await fetchingStore();
    await fetchingGetAllHoaDon();
    await fetchingOrderBy_storeID_By_year_month(chinhanhdau, formattedDate);
  };
  useEffect(() => {
    checkAccess();
    fetchingapi();
    getlenghtID_Bill();
  }, []);
  const createBill = async () => {
    const currentDate2 = new Date();

    // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
    const year2 = currentDate2.getFullYear();
    const month2 = (currentDate2.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day2 = currentDate2.getDate().toString().padStart(2, "0");
    const hours2 = currentDate2.getHours().toString().padStart(2, "0");
    const minutes2 = currentDate2.getMinutes().toString().padStart(2, "0");
    const seconds2 = currentDate2.getSeconds().toString().padStart(2, "0");
    const milliseconds2 = currentDate2
      .getMilliseconds()
      .toString()
      .padStart(3, "0");

    // Tạo chuỗi datetime
    const datetimeString = `${year2}-${month2}-${day2} ${hours2}:${minutes2}:${seconds2}.${milliseconds2}`;

    const addformbill = {
      id: stateFormBills.id,
      OrderID: stateFormBills.OrderID,
      createbill: datetimeString,
      userID: stateFormBills.userID,
      noiban: stateFormBills.noiban,
      noimua: stateFormBills.noimua,
      giaban: stateFormBills.giaban,
      giamua: stateFormBills.giamua,
      phieuxuatID: selectionModel[0],
    };
    if (!isCheckedNoiban) {
      addformbill.noiban = selectedOptionnoiban;
    }
    if (!isCheckedNoimua) {
      addformbill.noimua = selectedOptionnoimua;
    }

    const check = await createBills(addformbill);
    const originalDate = JSON.parse(check).newBills.CreateAt;
    const formattedDate = new Date(originalDate);

    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");

    const convertedDate = `${year}-${month}-${day}`;

    await createDEBTOR(convertedDate, addformbill);
    if (JSON.parse(check).success) {
      await Update_PhieuOrder_By_id(selectionModel);

      await fetchingOrderBy_storeID_By_year_month(statechinhanh, formattedDate);
      setstatelenghtID_bill(statelenghtID_bill + 1);
      alert(`${i18n.t("ALERT_LAPHOADONSUCCESS")}`);

      setStateFormbills({
        id: "",
        OrderID: "",
        sotien: "",
        userID: "",
        noiban: "",
        noimua: "",
        giaban: 0,
        giamua: 0,
        phieuxuatID: "",
      });
      setSelectionModel([]);
    }
  };

  const createDEBTOR = async (x, addformbill) => {
    const check = await Get_all_DEBTOR();
    // Tạo một đối tượng Date hiện tại
    const currentDate = new Date();

    // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const milliseconds = currentDate
      .getMilliseconds()
      .toString()
      .padStart(3, "0");

    // Tạo chuỗi datetime
    const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    let lenghtState = 0;

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      const arrayOfNumbers = resolvedResult.map((obj) =>
        parseInt(obj.id.split("-")[2])
      );
      if (arrayOfNumbers) {
        // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
        let maxNumber = Math.max(...arrayOfNumbers);
        const result = 1 / 0;

        const negativeInfinity = -1 / 0;

        if (maxNumber === negativeInfinity || maxNumber === result) {
          maxNumber = 0;
        }
        lenghtState = maxNumber + 1;
      }

      const FormcreateDebTor = {
        id: "DEB" + "-" + stateCode + "-" + lenghtState,
        Debtor_BranchID: stateFormBills.noimua,
        Owner_BranchID: stateFormBills.noiban,
        sotienNo: stateFormBills.giaban,
        ThoiDiemNo: datetimeString,
        LastPaymentDate: "...",
      };
      if (!isCheckedNoiban) {
        FormcreateDebTor.Owner_BranchID = selectedOptionnoiban;
      }
      if (!isCheckedNoimua) {
        FormcreateDebTor.Debtor_BranchID = selectedOptionnoimua;
      }

      const updateDoanhThu = {
        storeID: addformbill.noiban,
        thoidiem: x,
        ListOfCreditors: [],
        Listdebtors: FormcreateDebTor,
      };
      const updatesotiennoiban = {
        storeID: addformbill.noiban,
        thoidiem: x,
      };
      const updatesotiennoimua = {
        storeID: addformbill.noimua,
        thoidiem: x,
      };
      await createDebtor(FormcreateDebTor);
      await Update_DOANHTHU_BY_storeID_thoidiem(updatesotiennoiban);
      await Update_DOANHTHU_BY_storeID_thoidiem(updatesotiennoimua);
      await Update_ListOfCreditors_Listdebtors_By_id(updateDoanhThu);
    } else {
      const arrayOfNumbers = JSON.parse(check).map((obj) =>
        parseInt(obj.id.split("-")[2])
      );
      if (arrayOfNumbers) {
        let maxNumber = Math.max(...arrayOfNumbers);
        const result = 1 / 0;

        const negativeInfinity = -1 / 0;

        if (maxNumber === negativeInfinity || maxNumber === result) {
          maxNumber = 0;
        }
        lenghtState = maxNumber + 1;
      }

      const FormcreateDebTor = {
        id: "DEB" + "-" + stateCode + "-" + lenghtState,
        Debtor_BranchID: stateFormBills.noimua,
        Owner_BranchID: stateFormBills.noiban,
        sotienNo: stateFormBills.giaban,
        ThoiDiemNo: datetimeString,
        LastPaymentDate: "...",
      };

      if (!isCheckedNoiban) {
        FormcreateDebTor.Owner_BranchID = selectedOptionnoiban;
      }
      if (!isCheckedNoimua) {
        FormcreateDebTor.Debtor_BranchID = selectedOptionnoimua;
      }

      const updateDoanhThu = {
        storeID: addformbill.noiban,
        thoidiem: x,
        ListOfCreditors: [],
        Listdebtors: FormcreateDebTor,
      };
      const updatesotiennoiban = {
        storeID: addformbill.noiban,
        thoidiem: x,
      };
      const updatesotiennoimua = {
        storeID: addformbill.noimua,
        thoidiem: x,
      };
      await createDebtor(FormcreateDebTor);
      await Update_DOANHTHU_BY_storeID_thoidiem(updatesotiennoiban);
      await Update_DOANHTHU_BY_storeID_thoidiem(updatesotiennoimua);
      await Update_ListOfCreditors_Listdebtors_By_id(updateDoanhThu);
    }
  };
  const fetchingOrderBy_storeID_By_year_month = async (x, y) => {
    const request = {
      storeID: x,
      thoidiem: y,
    };
    const check = await Get_all_Order_By_StoreID_Year_Month(request);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStatePhieuStore(JSON.parse(resolvedResult));
    } else {
      setStatePhieuStore(JSON.parse(check));
    }
  };
  const handle_getAllProduct = async (e) => {
    await fetchingOrderBy_storeID_By_year_month(e.target.value, formattedDate);
    const selectedId = e.target.options[e.target.selectedIndex].id;
    setstateCode(selectedId);
    setStatechinhanh(e.target.value);
  };
  const handleSelectionModelChange = (newSelectionModel) => {
    // Lấy thông tin của các hàng được chọn
    const selectedRows = newSelectionModel.map((selectedId) =>
      statePhieuStore.find((row) => row.id === selectedId)
    );
    if (selectedRows) {
      setSelectedRow(selectedRows);
    }

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
    const objBranch = Get_all_Store();

    if (objBranch instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await objBranch;
      setStateStore(JSON.parse(resolvedResult));

      chinhanhdau = JSON.parse(resolvedResult)[0].id;
      setStatechinhanh(chinhanhdau);
      code = JSON.parse(resolvedResult)[0].code;

      setstateCode(code);
    } else {
      // Nếu không phải là promise, cập nhật state ngay lập tức
      setStateStore(JSON.parse(objBranch));

      chinhanhdau = JSON.parse(objBranch)[0].id;
      setStatechinhanh(chinhanhdau);
      code = JSON.parse(objBranch)[0].code;

      setstateCode(code);
    }
  };
  return (
    <Box m="20px">
      <Header
        title={`${i18n.t("TITLEXUATKHO")}`}
        subtitle={`${i18n.t("DESXUATKHO")}`}
      />
      <div style={{ width: "100%", display: "flex" }}>
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#staticBackdropEdit"
          disabled={selectionModel.length !== 1}
        >
          {i18n.t("BTN_LAPHOADON")}
        </button>
        {isloading ? (
          <a class="inline-flex rounded-md shadow-sm bg-purple-700">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-rose-600 hover:bg-rose-500 focus:border-rose-700 active:bg-rose-700 transition ease-in-out duration-150 cursor-not-allowed"
            >
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </button>
          </a>
        ) : (
          <button
            style={{ marginLeft: "1%" }}
            type="button"
            class="btn btn-danger"
            disabled={selectionModel.length !== 1}
            onClick={deletedphieu}
          >
            {i18n.t("XOAPHIEUXUATKHO")}
          </button>
        )}
        <button
          type="button"
          style={{ marginLeft: "1%" }}
          class="btn btn-info"
          disabled={selectionModel.length === 0}
          onClick={AcceptRequest}
        >
          {i18n.t("XACNHANYEUCAU")}
        </button>
        <div className="container">
          <h3>{i18n.t("CN")}</h3>
          <select onChange={handle_getAllProduct} id="chinhanh">
            {stateStore &&
              stateStore.map((object, index) => (
                <React.Fragment key={index}>
                  <option id={object.code} value={object.id}>
                    {object.name}
                  </option>
                </React.Fragment>
              ))}
          </select>
        </div>
      </div>
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
                {i18n.t("BTN_LAPHOADON")}
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
              <div
                style={{
                  display: "flex",

                  justifyContent: "space-between",
                }}
              >
                <label htmlFor="noiban">{i18n.t("MODAL_NOIBAN")}</label>
                {/* <div style={{ display: "flex" }}>
                  <label
                    htmlFor="Nnoiban"
                    style={{ display: "flex", width: "100%" }}
                  >
                    {" "}
                    {i18n.t("MODAL_NHAPNOIBAN")}{" "}
                  </label>
                  <input
                    id="Nnoiban"
                    checked={isCheckedNoiban}
                    onChange={handleCheckboxNoibanChange}
                    style={{ width: "15%" }}
                    type="checkbox"
                  ></input>
                </div> */}
              </div>
              {isCheckedNoiban ? (
                <input
                  type="text"
                  onChange={onChangeFormBills}
                  value={stateFormBills.noiban}
                  name="noiban"
                ></input>
              ) : (
                <select
                  onChange={handleSelectChangeNoiban}
                  value={selectedOptionnoiban}
                  id="noiban"
                >
                  <option value={"0"}>
                    --------------------------------------------------
                  </option>
                  {stateStore &&
                    stateStore.map((object, index) => (
                      <React.Fragment key={index}>
                        <option value={object.id}>{object.name}</option>
                      </React.Fragment>
                    ))}
                </select>
              )}
              <label htmlFor="giaban">{i18n.t("MODAL_GIAMUA")}</label>
              <input
                type="number"
                onChange={onChangeFormBills}
                value={stateFormBills.giamua}
                name="giamua"
              ></input>

              <div
                style={{
                  display: "flex",

                  justifyContent: "space-between",
                }}
              >
                <label htmlFor="noimua">{i18n.t("MODAL_NOIMUA")}</label>
                {/* <div style={{ display: "flex" }}>
                  <label
                    htmlFor="Nnoimua"
                    style={{ display: "flex", width: "100%" }}
                  >
                    {" "}
                    {i18n.t("MODAL_NHAPNOIMUA")}{" "}
                  </label>
                  <input
                    id="Nnoimua"
                    value={isCheckedNoimua}
                    onChange={handleCheckboxNoiMuaChange}
                    style={{ width: "15%" }}
                    type="checkbox"
                  ></input>
                </div> */}
              </div>
              {isCheckedNoimua ? (
                <input
                  type="text"
                  onChange={onChangeFormBills}
                  value={stateFormBills.noimua}
                  name="noimua"
                ></input>
              ) : (
                <select
                  onChange={handleSelectChangeNoimua}
                  value={selectedOptionnoimua}
                  id="noimua"
                >
                  <option value={"0"}>
                    --------------------------------------------------
                  </option>
                  {stateStore &&
                    stateStore.map((object, index) => (
                      <React.Fragment key={index}>
                        <option value={object.id}>{object.name}</option>
                      </React.Fragment>
                    ))}
                </select>
              )}
              <button onClick={caculategiaban}>x15%</button>
              <label htmlFor="giaban"> {i18n.t("MODAL_GIABAN")}</label>
              <input
                type="number"
                onChange={onChangeFormBills}
                value={stateFormBills.giaban}
                name="giaban"
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
                data-dismiss="modal"
                class="btn btn-primary"
                onClick={createBill}
              >
                {i18n.t("BTN_XACNHAN")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Box mt="40px">
        {" "}
        <h4>{i18n.t("LANCUOICAPNHATYYY")}</h4>
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
        <DataGrid
          editMode="row"
          checkboxSelection
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={10}
          rows={statePhieuStore}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
