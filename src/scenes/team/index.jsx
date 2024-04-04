import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";

import * as XLSX from "xlsx";
import { tokens } from "../../theme";
import ExcelJS from "exceljs";
import Header from "../../components/Header";
import AddAlarmIcon from "@mui/icons-material/AddAlarm";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { GridToolbar } from "@mui/x-data-grid";
import React from "react";
import { converBranchIDTOStoreID } from "../method";
import { HandleUpload, CheckFileName } from "../sendfileFTP/sendfileFTP";
import { Get_all_TIMEKEEPING_By_DateF_DateT_branchID } from "./handleTimekeeps";
import {
  Get_all_branch_By_userid,
  Get_all_User_By_branchID,
  Get_all_STAFFOFF_By_branchID,
  Get_all_branch,
} from "./handlebranch";
import "./style.css";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { HandleCreateTimekeeps } from "./handleTimekeeps";
import {
  HandleCreateStaff,
  HandleDeletedStaff,
  HandleEditStaff,
  HandleCreateStaffOff,
} from "./handlestaff";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import URL_IMG from "../../URL_GETIMG";
import { HandleEditTimekeeps } from "./handleTimekeeps";
import { converToName, Check_CCCD_To_Count_TimeKeep } from "../method";
import { HandleDeletedTime } from "./handleTimekeeps";
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
  const [stateTimekeep, setStateTimekeep] = useState([]);
  const today = new Date();

  // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = today.getDate().toString().padStart(2, "0");

  // Tạo chuỗi datetime
  const datetimeToday = `${year}-${month}-${day}`;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date(datetimeToday));
  const [endDate, setEndDate] = useState(new Date(datetimeToday));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [totalTimeCheck, setTotalTimeCheck] = useState("");

  const handleCheckButtonClick = async () => {
    const start = new Date(`${datetimeToday}T${startTime}`);
    const end = new Date(`${datetimeToday}T${endTime}`);
    const diffMilliseconds = end - start;

    const totalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );

    setTotalTime(`${totalHours} giờ ${totalMinutes} phút`);

    try {
      const promises = selectedRowTimekeeps.map(async (item) => {
        let objUpdate = {
          id: item.id,
          branchID: statechinhanh,
          reason: "...",
          startCheck: startTime,
          endCheck: endTime,
          Total: diffMilliseconds,
        };

        await HandleEditTimekeeps(objUpdate);
      });

      await Promise.all(promises);
      alert("Cập nhật, chấm công thành công ");
      await fetchingTimekeep(statechinhanh, startDate, endDate);
      setSelectRowTimekeeps([]);
      setSelectionModelTimeKeep([]);
      setStartTime("");
      setEndTime("");
      setTotalTime("");
      setTotalTimeCheck("");
    } catch (error) {
      console.log("Có gì đó không đúng, không được để trống thời gian!!!!");
    }
  };

  const handleCheckButtonClickTwo = async () => {
    if (stateTimekeep.length === 0) {
      alert("Chưa có dữ liệu chốt công !!");
      return;
    }
    try {
      const promises = stateTimekeep.map(async (item) => {
        const start = new Date(`${datetimeToday}T${item.startCheck}`);
        const end = new Date(`${datetimeToday}T${item.endCheck}`);
        let diffMilliseconds = end - start;

        if (Check_CCCD_To_Count_TimeKeep[`${item.staffid}`] === 1) {
          // Quy đổi thành số giờ và trừ đi 1 giờ
          const totalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

          if (totalHours >= 10) {
            // Quy đổi số giờ thành milliseconds
            // Chuyển đổi thành dạng giờ:phút
            const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
            const minutes = Math.floor(
              (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
            );

            // Giảm đi 1 giờ
            const adjustedHours = hours - 1;

            // Chuyển lại thành milliseconds
            const newMilliseconds = (adjustedHours * 60 + minutes) * 60 * 1000;

            diffMilliseconds = newMilliseconds;
          }
        }
        let objUpdate = {
          id: item.id,
          branchID: statechinhanh,
          reason: "...",
          startCheck: item.startCheck,
          endCheck: item.endCheck,
          Total: diffMilliseconds,
        };

        await HandleEditTimekeeps(objUpdate);
      });
      await Promise.all(promises);
      alert("Cập nhật, chấm công thành công ");
      await fetchingTimekeep(statechinhanh, startDate, endDate);
      setSelectRowTimekeeps([]);
      setSelectionModelTimeKeep([]);
      setStartTime("");
      setEndTime("");
      setTotalTime("");
      setTotalTimeCheck("");
    } catch (error) {
      console.log("Có gì đó không đúng, không được để trống thời gian!!!!");
    }
  };
  const checkHour = () => {
    let getHour = 0;
    selectedRowTimekeeps.forEach((item) => {
      getHour += item.Total ? item.Total : 0;
    });

    const totalHours = Math.floor(getHour / (1000 * 60 * 60));
    const totalMinutes = Math.floor((getHour % (1000 * 60 * 60)) / (1000 * 60));
    setTotalTimeCheck(`${totalHours} giờ ${totalMinutes} phút`);
  };
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
  };
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

  const columnsTime = [
    { field: "staffid", flex: 1, headerName: `CCCD`, editable: true },
    // {
    //   field: "OT",
    //   headerName: `TĂNG CA`,
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    //   editable: true,
    // },
    {
      field: "staffName",
      headerName: `TÊN NHÂN VIÊN`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "startCheck",
      headerName: `GIỜ VÀO`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "endCheck",
      headerName: `GIỜ RA`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "Total",
      headerName: `TỔNG SỐ GIỜ`,
      flex: 1,
      renderCell: converToHHandMM,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "createDate",
      headerName: `NGÀY CHẤM CÔNG`,
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: ChamCong,
      editable: true,
    },
  ];
  const [stateBranch, setStateBranch] = useState([]);
  const [stateStaff, setStateStaff] = useState([]);
  const [stateStaffOff, setStateStaffOff] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectionModelTimeKeep, setSelectionModelTimeKeep] = React.useState(
    []
  );
  const [stateStaffImport, setStateStaffImport] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState([]);
  const [selectedRowTimekeeps, setSelectRowTimekeeps] = React.useState([]);
  const handleSelectionModelChange = (newSelectionModel) => {
    const selectedRows = newSelectionModel.map((selectedId) =>
      stateStaff.find((row) => row.id === selectedId)
    );

    setSelectedRow(selectedRows);
    setSelectionModel(newSelectionModel);
  };

  const handleSelectionModelChangeTimekeep = (newSelectionModel) => {
    const selectedRows = newSelectionModel.map((selectedId) =>
      stateTimekeep.find((row) => row.id === selectedId)
    );

    setSelectRowTimekeeps(selectedRows);
    setSelectionModelTimeKeep(newSelectionModel);
  };
  const handleEditCellChange = (params) => {
    const keys = Object.keys(params);
    const allValues = Object.values(params);
    let updatedArray = stateTimekeep.filter((item) => item.id === keys[0])[0];
    if (
      allValues[0].startCheck &&
      allValues[0].startCheck !== updatedArray.startCheck
    ) {
      updatedArray = {
        ...updatedArray,
        startCheck: allValues[0].startCheck.value,
      };
    }
    if (
      allValues[0].endCheck &&
      allValues[0].endCheck !== updatedArray.endCheck
    ) {
      updatedArray = {
        ...updatedArray,
        endCheck: allValues[0].endCheck.value,
      };
    }
    const index = stateTimekeep.findIndex((item) => item.id === keys[0]);
    if (index === -1) {
      return stateTimekeep;
    }
    // Cập nhật phần tử tại index bằng newData
    const newArray = [...stateTimekeep];

    newArray[index] = { ...newArray[index], ...updatedArray };
    setStateTimekeep(newArray);
  };
  const getDataFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const dataWithoutHeader = data.slice(1);
      // Chuyển đổi mảng con thành đối tượng JSON

      const formattedData = dataWithoutHeader.map((row) => {
        if (row) {
          const obj = {};

          row.forEach((cell, index) => {
            obj[`Column${index + 1}`] = cell || "...";
          });

          return obj;
        }
      });
      setStateStaffImport(formattedData);
    };

    reader.readAsBinaryString(file);
  };
  const savechange = async () => {
    try {
      await Promise.all(
        stateStaffImport.map(async (element) => {
          const temp = {
            id: element.Column1,
            name: element.Column4,
            phone: element.Column5,
            Role: element.Column6,
            branchID: statechinhanh,
            ngayvao: element.Column8,
            AccountBank: element.Column7,
            picture: element.Column2,
            pictureTwo: element.Column3,
          };
          await HandleCreateStaff(temp);
        })
      );
      alert("Tất cả nhân viên đã được lưu thành công");

      await fetchingGettAllStaft_by_branchID(statechinhanh);
    } catch (error) {
      alert(
        "Dữ liệu nhập có gì đó không đúng, hoặc dữ liệu CCCD đã tồn tại !!!!"
      );
    }
  };
  function converToHHandMM(params) {
    const arrayObject = params.value;
    const totalHours = Math.floor(arrayObject / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (arrayObject % (1000 * 60 * 60)) / (1000 * 60)
    );
    return <span>{`${totalHours} giờ ${totalMinutes} phút`}</span>;
  }
  function ChamCong(params) {
    const arrayObject = params.value;
    const originalDateString = arrayObject;
    const originalDate = new Date(originalDateString);

    // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây từ đối tượng Date
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = originalDate.getDate().toString().padStart(2, "0");
    const hours = originalDate.getHours().toString().padStart(2, "0");
    const minutes = originalDate.getMinutes().toString().padStart(2, "0");

    // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}`;
    return <span>{formattedDateString}</span>;
  }
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
          loading="lazy"
          width={100}
          height={50}
          style={{ cursor: "pointer" }}
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

      //create Staff off

      const handledelted = await HandleDeletedStaff(selectedRows);

      if (handledelted.success) {
        setIsloading(false);
        alert("Deleted Successfully !!!");
        const promises = selectedRow.map(async (item) => {
          await HandleCreateStaffOff(item);
        });
        await Promise.all(promises);
      }
      setSelectionModel([]);

      setSelectedRow([]);
      await fetchingGettAllStaft_by_branchID(statechinhanh);
      await fetchingGettAllStaftOff_by_branchID(statechinhanh);
    } catch (error) {
      console.log(error);
    }

    // Thực hiện xử lý theo nhu cầu của bạn
  };
  // Hàm để chuyển đổi URL hình ảnh sang base64
  const loadImageAsBase64 = async (url) => {
    const response = await fetch(url, { mode: "no-cors" });
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    // console.log("base64 " + base64);
    return base64;
  };
  // Hàm chuyển đổi Blob sang base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      console.log("blob " + blob);
      reader.onloadend = () => resolve(reader.result); // Lấy phần base64 sau dấu phẩy
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const handleExportExcel = async () => {
    // Chuẩn bị dữ liệu để xuất
    const rows = stateStaff.map((staff) => {
      // Chỉ lấy các trường dữ liệu bạn muốn xuất
      return {
        CCCD: staff.id,
        [i18n.t("HINHANHTRC") + "CCCD"]: staff.picture,
        [i18n.t("HINHANHSAU") + "CCCD"]: staff.pictureTwo,
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
      { width: 20 },
      { width: 20 },
    ];

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Staff_Data");

    // Tạo tệp Excel từ workbook
    XLSX.writeFile(wb, "Staff_Data.xlsx");
  };
  const HuyCong = async () => {
    try {
      const promises = selectionModelTimeKeep.map(async (item) => {
        await HandleDeletedTime(item);
      });

      // Sử dụng Promise.all để đợi cho tất cả các promise hoàn thành
      await Promise.all(promises);

      alert("Đã hủy bảng chấm công, thành công !!!");
      await fetchingTimekeep(statechinhanh, startDate, endDate);
      setSelectRowTimekeeps([]);
      setSelectionModelTimeKeep([]);
    } catch (error) {
      console.log("error " + error);
    }
  };
  const handleExportExcelTimeK = async () => {
    // Mảng JSON chứa dữ liệu
    let data = [];
    //Lọc các phần tử trùng
    let output = stateTimekeep.filter((obj, index, arr) => {
      return (
        arr.findIndex((o) => {
          return (
            o.staffid === obj.staffid &&
            o.createDate.split("T")[0] === obj.createDate.split("T")[0]
          );
        }) === index
      );
    });
    let maxRow = 0;
    output.forEach((element) => {
      const filterCheckElement = stateTimekeep.filter(
        (obj) =>
          obj.staffid === element.staffid &&
          obj.createDate.split("T")[0] === element.createDate.split("T")[0]
      );

      let object = {};
      if (filterCheckElement.length > maxRow) {
        maxRow = filterCheckElement.length;
      }
      if (filterCheckElement.length > 1) {
        object = {
          CCCD: element.staffid,
          TENNV: element.staffName,
          UPDATEDATE: element.createDate.split("T")[0],
        };
        for (let i = 0; i < filterCheckElement.length; i++) {
          const arrayObject = filterCheckElement[i].Total;
          let totalHours = Math.floor(arrayObject / (1000 * 60 * 60));
          const totalMinutes = Math.floor(
            (arrayObject % (1000 * 60 * 60)) / (1000 * 60)
          );

          object = {
            ...object,
            [`CHECKINT${i + 1}`]: filterCheckElement[i].startCheck,
            [`CHECKOUT${i + 1}`]: filterCheckElement[i].endCheck,
            [`TOTAL${i + 1}`]: parseFloat(totalHours + "." + totalMinutes),
          };
        }
        data.push(object);
      } else {
        const arrayObject = element.Total;
        const totalHours = Math.floor(arrayObject / (1000 * 60 * 60));
        const totalMinutes = Math.floor(
          (arrayObject % (1000 * 60 * 60)) / (1000 * 60)
        );

        object = {
          CCCD: element.staffid,
          TENNV: element.staffName,
          UPDATEDATE: element.createDate.split("T")[0],
          CHECKIN: element.startCheck,
          CHECKOUT: element.endCheck,
          TONG: parseFloat(totalHours + "." + totalMinutes),
        };
        data.push(object);
      }
    });
    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Tạo dòng header tùy chỉnh
    let addrow = [
      "CCCD",
      i18n.t("TNV_TEAM").toUpperCase(),
      i18n.t("TDT_TEAM").toUpperCase(),
    ];
    for (let index = 1; index <= maxRow; index++) {
      addrow.push(`CHECK IN ${index}`);
      addrow.push(`CHECK OUT ${index}`);
      addrow.push(`TOTAL ${index}`);
    }
    const headerRow = worksheet.addRow(addrow);
    headerRow.font = { bold: true, color: { argb: "FF000000" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "AFC4ED" },
    };

    // Đặt dữ liệu
    data.forEach((row) => {
      const rowData = Object.keys(row).map((key) => row[key]);
      worksheet.addRow(rowData);
    });

    worksheet.columns = [
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    var columnleter = "CDEFGHIJKLMNO";

    // Định dạng cột B
    for (let index = 0; index < columnleter.length; index++) {
      const column = worksheet.getColumn(`${columnleter.charAt(index)}`);
      column.alignment = { horizontal: "center", vertical: "middle" };
      column.numFmt = "0.0";
      if (
        columnleter.charAt(index) === "F" ||
        columnleter.charAt(index) === "I" ||
        columnleter.charAt(index) === "L" ||
        columnleter.charAt(index) === "O"
      ) {
        column.font = {
          color: { argb: "008f00" },
          family: 4,
          size: 14,
          bold: true,
        };
      }
    }

    // Xuất workbook vào tệp Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${i18n.t("ALERT_PHIEUNHAP")}-${
      converToName[converBranchIDTOStoreID[statechinhanh]]
    }.xlsx`;
    link.click();
  };

  const handleCheck = () => {
    console.log("state " + JSON.stringify(stateTimekeep, null, 2));
    // Mảng JSON chứa dữ liệu
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
  const fetchingTimekeep = async (branchId, createF, createT) => {
    const jsonfetch = {
      branchID: branchId,
      createDateF: createF,
      createDateT: createT,
    };
    const objBranch = await Get_all_TIMEKEEPING_By_DateF_DateT_branchID(
      jsonfetch
    );

    if (objBranch instanceof Promise) {
      const resolvedResult = await objBranch;

      setStateTimekeep(JSON.parse(resolvedResult));
    } else {
      setStateTimekeep(JSON.parse(objBranch));
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

  const fetchingGettAllStaftOff_by_branchID = async (x) => {
    const check = await Get_all_STAFFOFF_By_branchID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateStaffOff(JSON.parse(resolvedResult));
    } else {
      setStateStaffOff(JSON.parse(check));
    }
  };
  const handle_getAllStaff = async (e) => {
    await fetchingGettAllStaft_by_branchID(e.target.value);
    await fetchingGettAllStaftOff_by_branchID(e.target.value);
    await fetchingTimekeep(e.target.value, startDate, endDate);
    setStartDate(datetimeToday);
    setEndDate(datetimeToday);

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
        await Promise.all([
          fetchingGettAllStaft_by_branchID(chinhanhdau),
          fetchingGettAllStaftOff_by_branchID(chinhanhdau),
        ]);
        // Tiếp tục xử lý sau khi tất cả các hàm đã hoàn thành
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    await fetchingTimekeep(chinhanhdau, datetimeToday, datetimeToday);
    setStatechinhanh(chinhanhdau);
  };
  const getTimekeeeping = async () => {
    await fetchingTimekeep(statechinhanh, startDate, endDate);
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
        picture: URL_IMG + `STAFF/${statechinhanh}/` + check,
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

        pictureTwo: URL_IMG + `STAFF/${statechinhanh}/` + check,
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

        picture: URL_IMG + `STAFF/${statechinhanh}/` + check,
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
        pictureTwo: URL_IMG + `STAFF/${statechinhanh}/` + check,
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
    ngayvao: "",
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
      ngayvao: selectedRows[0].ngayvao,
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
  const createTimekeepings = async () => {
    // Sử dụng map thay vì forEach để tạo một mảng promise
    try {
      const promises = selectedRow.map(async (item) => {
        const filteredObjects = stateTimekeep.filter(
          (obj) => obj.staffid === item.id
        );

        let objtemp = {
          staffid: item.id,
          staffName: item.name,
          branchID: statechinhanh,
          reason: "...",
          startCheck: "...",
          endCheck: "...",
          createDate: endDate,
          OT: 0,
        };
        if (filteredObjects.length > 0) {
          objtemp.OT += filteredObjects.length;
        }
        await HandleCreateTimekeeps(objtemp);
      });

      // Sử dụng Promise.all để đợi cho tất cả các promise hoàn thành
      await Promise.all(promises);

      alert("Đã khởi tạo bảng chấm công, thành công !!!");
      await fetchingTimekeep(statechinhanh, startDate, endDate);
      setSelectionModel([]);
    } catch (error) {
      console.log("error " + error);
    }
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
          class="button-86"
          data-toggle="modal"
          data-target="#staticBackdrop"
        >
          {i18n.t("THEMNV")} <PersonAddAltIcon></PersonAddAltIcon>
        </button>
        {!isloading ? (
          <button
            type="button"
            class="button-86xoa"
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
          class="button-86dc"
          data-toggle="modal"
          onClick={handleEdit}
          data-target="#staticBackdropEdit"
          disabled={selectionModel.length !== 1}
        >
          {i18n.t("SUANV")}
        </button>
        <button
          type="button"
          style={{ marginLeft: "1%" }}
          class="btn btn-success"
          onClick={createTimekeepings}
        >
          Tạo bảng chấm công
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
                <label htmlFor="ngayvao">Ngày vào</label>
                <input
                  type="text"
                  value={EditStaffForm.ngayvao}
                  onChange={onChangeEditStaffForm}
                  name="ngayvao"
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
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Modal title
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
              <div class="modal-body">
                <label htmlFor="startCheck">Thời gian vào</label>
                <input
                  name="startCheck"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  type="time"
                />

                <label htmlFor="endCheck">Thời gian ra</label>
                <input
                  name="endCheck"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  type="time"
                />

                <label htmlFor="Total">Tổng thời gian</label>
                <input name="Total" type="text" value={totalTime} disabled />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleCheckButtonClick}
                  class="btn btn-primary"
                >
                  Save changes
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
        {/* MODAL CHAM CONG */}

        <div style={{ marginLeft: "2%" }} className="container">
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
          <div style={{ position: "relative", top: "-257%" }}>
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
        <br></br>
        <div style={{ display: "flex" }} className="">
          <div style={{ paddingTop: "10px" }}>
            <input onChange={getDataFile} type="file" />
          </div>
          <button className="btn btn-success" onClick={savechange}>
            save
          </button>
        </div>
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
      {/* Nhân viên đã nghĩ */}

      <Box ml="50px" mt="100px">
        <Header title="BẢNG CHẤM CÔNG" subtitle={i18n.t("DESTEAM")} />
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="100px"
          gap="20px"
        >
          <Box>
            <div className="date-picker-container">
              <label className="date-picker-label" htmlFor="dateF">
                Ngày bắt đầu:
              </label>
              <DatePicker
                id="dateF"
                name="dateF"
                dateFormat="yyyy-MM-dd"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="custom-date-picker" // Thêm lớp CSS tùy chỉnh cho DatePicker
              />
            </div>
          </Box>
          <Box>
            <div className="date-picker-container">
              <label className="date-picker-label" htmlFor="dateT">
                Ngày kết thúc :
              </label>
              <DatePicker
                id="dateT"
                name="dateT"
                dateFormat="yyyy-MM-dd"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="custom-date-picker" // Thêm lớp CSS tùy chỉnh cho DatePicker
              />
            </div>
          </Box>
          <Box display="flex">
            <span
              style={{ margin: "auto", color: "white" }}
              onClick={getTimekeeeping}
              className="btn btn-info"
            >
              <SearchIcon fontSize="large"></SearchIcon>
            </span>
          </Box>
          <Box display="flex">
            <button
              style={{
                margin: "auto",
                width: "126px",
                backgroundColor: "black",
              }}
              className="btn btn-success"
              onClick={handleCheckButtonClickTwo}
            >
              {" "}
              <AddAlarmIcon></AddAlarmIcon>Chốt công
            </button>

            <button
              data-toggle="modal"
              style={{
                margin: "auto",
                marginLeft: "5%",
                width: "126px",
              }}
              disabled={selectionModelTimeKeep.length == 0}
              className="btn btn-danger"
              onClick={HuyCong}
            >
              {" "}
              Hủy công
            </button>
          </Box>
          <Box display="flex">
            <button
              style={{ margin: "auto", width: "126px" }}
              className="btn btn-success"
              onClick={handleExportExcelTimeK}
            >
              Export to Excel
            </button>
          </Box>
          {/* <Box display="flex">
            <button
              style={{ margin: "auto", width: "126px" }}
              onClick={handleCheckButtonClickTwo}
            >
              CHECK EDIT
            </button>
          </Box> */}
        </Box>
        <Box>
          <label htmlFor="checkG">
            *Chọn số lượng dử liệu sau đó bấm check
          </label>
          <br></br>
          <input
            type="text"
            name="checkG"
            value={totalTimeCheck}
            placeholder="Kiểm tra số giờ làm"
          ></input>
          <button onClick={checkHour}>Check</button>
        </Box>
      </Box>
      {/* <Box>
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
      </Box> */}

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },

          "& .MuiDataGrid-cell": {
            borderBottom: "1px black solid",
          },
          "& .name-column--cell": {
            color: "white",
            fontSize: ".8rem",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#c0743e",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#907655",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#c0743e",
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
          zIndex={10}
          checkboxSelection
          selectionModel={selectionModelTimeKeep}
          onSelectionModelChange={handleSelectionModelChangeTimekeep}
          onEditRowsModelChange={handleEditCellChange}
          onedit
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={20}
          rows={stateTimekeep}
          columns={columnsTime}
        />
      </Box>
      <hr></hr>
      <Box
        m="80px 0 0 0"
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
        <Header title="NHÂN VIÊN ĐÃ RỜI KHỎI TỔ CHỨC"></Header>
        <DataGrid
          components={{
            Toolbar: GridToolbar,
          }}
          pageSize={10}
          rows={stateStaffOff}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Team;
