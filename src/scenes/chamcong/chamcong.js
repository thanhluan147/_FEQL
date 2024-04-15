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
import moment from "moment";
import Input from "@mui/material";
import { HandleUpload, CheckFileName } from "../sendfileFTP/sendfileFTP";
import { Get_all_TIMEKEEPING_By_DateF_DateT_branchID } from "../team/handleTimekeeps";
// import {
//   Get_all_branch_By_userid,
//   Get_all_User_By_branchID,
//   Get_all_STAFFOFF_By_branchID,
//   Get_all_branch,
// } from "../branch/handlebranch";

import {
  Get_all_User_By_branchID,
  Get_all_STAFFOFF_By_branchID,
  Get_all_branch_By_userid,
  Get_all_branch,
} from "../team/handlebranch";
import {
  GET_ALL_TIMEKEEP_FROM_API,
  GET_ALL_TIMEKEEP_FROM_API_SEARCH,
} from "../team/handleTimekeeps";
import "./style.css";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { HandleCreateTimekeeps } from "../team/handleTimekeeps";
import {
  HandleCreateStaff,
  HandleDeletedStaff,
  HandleEditStaff,
  HandleCreateStaffOff,
} from "../team/handlestaff";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import URL_IMG from "../../URL_GETIMG";
import { HandleEditTimekeeps } from "../team/handleTimekeeps";
import { converToName, Check_CCCD_To_Count_TimeKeep } from "../method";
import { HandleDeletedTime } from "../team/handleTimekeeps";
const ChamCong = () => {
  useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [statecheckIn, setStatecheckIn] = useState("");
  const [statecheckOut, setStatecheckOut] = useState("");
  const [stateHour, setstateHour] = useState("");
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
        let checkRole = stateStaff.some((obj) => {
          return obj.id === item.staffid && obj.Role !== "NV";
        });

        if (checkRole) {
          // Quy đổi thành số giờ và trừ đi 1 giờ
          const totalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));

          if (statechinhanh === "BT00") {
            if (totalHours >= 9) {
              // Quy đổi số giờ thành milliseconds
              // Chuyển đổi thành dạng giờ:phút
              const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
              const minutes = Math.floor(
                (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
              );

              // Giảm đi 1 giờ
              const adjustedHours = hours - 1;

              // Chuyển lại thành milliseconds
              const newMilliseconds =
                (adjustedHours * 60 + minutes) * 60 * 1000;

              diffMilliseconds = newMilliseconds;
            }
          } else {
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
              const newMilliseconds =
                (adjustedHours * 60 + minutes) * 60 * 1000;
              console.log("yo 10");
              diffMilliseconds = newMilliseconds;
            }
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
    const start = new Date(`${datetimeToday}T${statecheckIn}`);
    const end = new Date(`${datetimeToday}T${statecheckOut}`);
    let diffMilliseconds = end - start;

    const totalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    setstateHour(`${totalHours} giờ ${totalMinutes} phút`);
  };

  function timeStringToMilliseconds(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return (hours * 60 + minutes) * 60000;
  }
  const checkHourTotal = () => {
    let diffMilliseconds = 0;
    selectedRowTimekeeps.forEach((item) => {
      const timeVietnam = moment(item.TimeStr)
        .utcOffset("-00:00")
        .format("HH:mm");
      diffMilliseconds += timeStringToMilliseconds(timeVietnam);
    });
    const totalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );

    // const totalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    // const totalMinutes = Math.floor(
    //   (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    // );
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
      renderCell: ImageRole,
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
    {
      field: "UserEnrollNumber",
      flex: 1,
      headerName: `MÃ CHẤM CÔNG`,
      editable: true,
    },

    {
      field: "UserEnrollName",
      headerName: `TÊN NHÂN VIÊN`,
      flex: 1,
      cellClassName: "name-column--cell",
      editable: true,
    },
    {
      field: "TimeStr",
      headerName: `THỜI ĐIỂM CHẤM CÔNG`,
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ChamCong,
      editable: true,
    },

    {
      field: "TimeDate",
      headerName: `NGÀY CHẤM CÔNG`,
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: ChamCongOnlyDay,
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
    const dateTimeUTC = params.value;

    // Chuyển đổi sang múi giờ Việt Nam và chỉ lấy giờ và phút
    const timeVietnam = moment(dateTimeUTC).utcOffset("-00:00").format("HH:mm");

    return <span>{timeVietnam}</span>;
  }
  function ChamCongOnlyDay(params) {
    const arrayObject = params.value;
    const originalDateString = arrayObject;
    const originalDate = new Date(originalDateString);

    // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây từ đối tượng Date
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = originalDate.getDate().toString().padStart(2, "0");

    // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
    const formattedDateString = `${year}-${month}-${day}`;
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
  function ImageRole(params) {
    let getvalue = params.value;
    if (getvalue === "QL") {
      getvalue = "QUẢN LÝ TRƯỞNG";
    } else if (getvalue === "PQL") {
      getvalue = "PHÓ QUẢN LÝ";
    } else if (getvalue === "NV") {
      getvalue = "NHÂN VIÊN";
    }
    return (
      <>
        <span>{getvalue}</span>
      </>
    );
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

      setSelectRowTimekeeps([]);
      setSelectionModelTimeKeep([]);
    } catch (error) {
      console.log("error " + error);
    }
  };
  const handleExportExcelTimeK = async () => {
    // Mảng JSON chứa dữ liệu
    let data = [];
    let dataForeach;
    let checkrow = 1;
    if (selectedRowTimekeeps.length > 0) {
      dataForeach = selectedRowTimekeeps;
    } else {
      dataForeach = stateTimekeep;
      checkrow = 2;
    }
    let dataaa = dataForeach.filter((obj, index, arr) => {
      return (
        arr.findIndex((o) => {
          return (
            o.UserEnrollNumber === obj.UserEnrollNumber &&
            o.TimeDate.split("T")[0] === obj.TimeDate.split("T")[0]
          );
        }) === index
      );
    });

    let maxRow = 0;
    dataaa.forEach((element) => {
      let filterCheckElement;
      if (checkrow === 1) {
        filterCheckElement = selectedRowTimekeeps.filter(
          (obj) =>
            obj.UserEnrollNumber === element.UserEnrollNumber &&
            obj.TimeDate.split("T")[0] === element.TimeDate.split("T")[0]
        );
      } else {
        filterCheckElement = stateTimekeep.filter(
          (obj) =>
            obj.UserEnrollNumber === element.UserEnrollNumber &&
            obj.TimeDate.split("T")[0] === element.TimeDate.split("T")[0]
        );
      }
      let object = {};
      if (filterCheckElement.length > maxRow) {
        maxRow = filterCheckElement.length;
      }
      if (filterCheckElement.length > 1) {
        const originalDateString = element.TimeDate;
        const originalDate = new Date(originalDateString);

        // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây từ đối tượng Date
        const year = originalDate.getFullYear();
        const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
        const day = originalDate.getDate().toString().padStart(2, "0");

        // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
        const formattedDateStringT = `${year}-${month}-${day}`;
        object = {
          NGAYCHAMCONG: formattedDateStringT,
          MASP: element.UserEnrollNumber,
          NAME: element.UserEnrollName,
        };
        for (let i = 0; i < filterCheckElement.length; i++) {
          const timeVietnam = moment(filterCheckElement[i].TimeStr)
            .utcOffset("-00:00")
            .format("HH:mm");
          object = {
            ...object,
            [`CHECKINT${i + 1}`]: timeVietnam,
          };
        }
        data.push(object);
      } else {
        const timeVietnam = moment(element.TimeStr)
          .utcOffset("-00:00")
          .format("HH:mm");
        const originalDateString = element.TimeDate;
        const originalDate = new Date(originalDateString);

        // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây từ đối tượng Date
        const year = originalDate.getFullYear();
        const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
        const day = originalDate.getDate().toString().padStart(2, "0");

        // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
        const formattedDateString = `${year}-${month}-${day}`;
        object = {
          NGAYCHAMCONG: formattedDateString,
          MASP: element.UserEnrollNumber,
          NAME: element.UserEnrollName,
          CHECKINOUT: timeVietnam,
        };
        data.push(object);
      }
    });
    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Tạo dòng header tùy chỉnh
    let addrow = ["NGÀY CHẤM CÔNG", "MÃ CHẤM CÔNG", "TÊN NHÂN VIÊN"];

    for (let index = 1; index <= maxRow; index++) {
      addrow.push(`LẦN ${index}`);
    }
    const headerRow = worksheet.addRow(addrow);
    headerRow.font = { bold: true, color: { argb: "FF000000" } };

    for (let index = 1; index <= addrow.length; index++) {
      headerRow.getCell(index).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
    }

    // headerRow.fill = {
    //   type: "pattern",
    //   pattern: "solid",
    //   fgColor: { argb: "FFFF00" },
    // };
    data.sort((a, b) => {
      return new Date(a.NGAYCHAMCONG) - new Date(b.NGAYCHAMCONG);
    });
    // Đặt dữ liệu
    data.forEach((row) => {
      const rowData = Object.keys(row).map((key) => row[key]);
      worksheet.addRow(rowData);
    });
    let addarrayheader = [{ width: 30 }, { width: 30 }, { width: 30 }];
    for (let index = 1; index <= maxRow; index++) {
      addarrayheader.push({ width: 16 });
    }
    worksheet.columns = addarrayheader;
    // Định dạng cột B
    var columnleter = "DEFGHIJKLMNO";

    // Định dạng cột B
    for (let index = 0; index < columnleter.length; index++) {
      const column = worksheet.getColumn(`${columnleter.charAt(index)}`);
      column.alignment = { horizontal: "center", vertical: "middle" };
    }
    // Xuất workbook vào tệp Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);

    link.download = `DỮ LIỆU MÁY CHẤM CÔNG-${
      converToName[converBranchIDTOStoreID[statechinhanh]]
    }
    }.xlsx`;
    link.click();
  };
  const handlecheckIN = async () => {
    if (selectedRowTimekeeps.length === 0) {
      setStatecheckIn("");
      return;
    }
    const timeVietnam = moment(selectedRowTimekeeps[0].TimeStr)
      .utcOffset("-00:00")
      .format("HH:mm");
    setStatecheckIn(timeVietnam);
  };
  const handlecheckOUT = async () => {
    if (selectedRowTimekeeps.length === 0) {
      setStatecheckOut("");
      return;
    }
    const timeVietnam = moment(selectedRowTimekeeps[1].TimeStr)
      .utcOffset("-00:00")
      .format("HH:mm");
    setStatecheckOut(timeVietnam);
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

    setStartDate(datetimeToday);
    setEndDate(datetimeToday);

    setStatechinhanh(e.target.value);
  };
  const fetchData = async () => {
    await Promise.all([
      fetchingGettAllStaft_by_branchID(chinhanhdau),

      fetchingapiTimekeeps(today, today),
    ]);
    // Tiếp tục xử lý sau khi tất cả các hàm đã hoàn thành
  };
  const fetchingapi = async () => {
    // await checkAccess();
    try {
      await checkAccess();
      await fetchingBranch();
      await fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setStatechinhanh(chinhanhdau);
  };
  const fetchingapiTimekeeps = async (x, y) => {
    try {
      // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây từ đối tượng Date
      const yearF = x.getFullYear();
      const monthF = (x.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
      const dayF = x.getDate().toString().padStart(2, "0");

      const yearT = y.getFullYear();
      const monthT = (y.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
      const dayT = y.getDate().toString().padStart(2, "0");

      // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
      const formattedDateStringF = `${yearF}-${monthF}-${dayF}`;
      const formattedDateStingTo = `${yearT}-${monthT}-${dayT}`;

      let formsearch = {
        dateF: formattedDateStringF,
        dateT: formattedDateStingTo,
      };
      let check = GET_ALL_TIMEKEEP_FROM_API_SEARCH(formsearch);

      if (check instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        let resolvedResult = await check;
        let idCounter = 1;
        // Duyệt qua từng object trong mảng và thêm thuộc tính id
        resolvedResult.forEach((obj) => {
          obj.id = idCounter++;
        });

        setStateTimekeep(resolvedResult);
      } else {
        let idCounter = 1;
        // Duyệt qua từng object trong mảng và thêm thuộc tính id
        check.forEach((obj) => {
          obj.id = idCounter++;
        });

        setStateTimekeep(check);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTimekeeeping = async (startDate, endDate) => {
    await fetchingapiTimekeeps(startDate, endDate);
  };
  useEffect(() => {
    try {
      fetchingapi();
    } catch (error) {}
  }, []);

  return (
    <Box m="20px">
      <Box>
        <Header title={i18n.t("QLMCC")} subtitle={i18n.t("DESTEAM")} />
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="100px"
          gap="20px"
        >
          <Box>
            <div style={{ width: "100%", display: "flex" }}>
              {/* MODAL CHAM CONG */}

              <div style={{ marginLeft: "-3.5%" }} className="container">
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
              </div>
            </div>
          </Box>
          <Box>
            <div className="date-picker-container">
              <label className="date-picker-label" htmlFor="dateF">
                {i18n.t("NGAYBD")}
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
              <label
                style={{ width: "200px" }}
                className="date-picker-label"
                htmlFor="dateT"
              >
                {i18n.t("NGAYKT")}
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
              onClick={() => fetchingapiTimekeeps(startDate, endDate)}
              className="btn btn-info"
            >
              <SearchIcon fontSize="large"></SearchIcon>
            </span>
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
        </Box>
        {/* <Box>
          <label htmlFor="checkG">*{i18n.t("TONGSOGIOLAM")}</label>
          <br></br>
          <input
            type="text"
            name="checkG"
            value={totalTimeCheck}
            placeholder="Kiểm tra số giờ làm"
          ></input>
          <button onClick={checkHourTotal}>Check</button>
        </Box> */}
        <hr></hr>
        <label htmlFor="checkG">*{i18n.t("KIEMTRASOGIOLAM")} </label>
        <Box display="flex">
          <br></br>
          <div>
            {" "}
            <input
              type="text"
              name="checkG"
              value={statecheckIn}
              placeholder="Số giờ bắt đầu chấm công"
            ></input>
            <button onClick={handlecheckIN}>Nhận</button>
          </div>
          <div style={{ marginLeft: "4%" }}>
            <input
              value={statecheckOut}
              type="text"
              placeholder="Số giờ bắt đầu ra công"
            ></input>
            <button onClick={handlecheckOUT}>Nhận</button>
          </div>
          <div style={{ marginLeft: "4%" }}>
            <input
              type="text"
              name="checkG"
              value={stateHour}
              placeholder="Kiểm tra số giờ làm"
            ></input>
            <button onClick={checkHour}>Check</button>
          </div>
        </Box>
      </Box>

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
          components={{
            Toolbar: GridToolbar,
          }}
          rows={stateTimekeep}
          columns={columnsTime}
        />
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
    </Box>
  );
};

export default ChamCong;
