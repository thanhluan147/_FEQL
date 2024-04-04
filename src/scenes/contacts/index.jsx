import { Box } from "@mui/material";
import { DataGrid, GridToolbar, GridToolbarExport } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Get_all_store_By_userid, Get_all_Store } from "./handlestore";
import axios from "axios";
import {
  Get_all_Product_By_StoreID,
  createProduct,
  Get_all_LENGHT_Product_By_StoreID,
} from "./handleproduct";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { Columns } from "./data";
import { Form, Button } from "react-bootstrap";
import ExcelJS from "exceljs";
import { converIDloaiTONAME, converToName } from "../method";
import { useState, useEffect } from "react";
import { DeleteProduct, EditProduct } from "./handleproduct";
import React from "react";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { HandleUpload, CheckFileName } from "../sendfileFTP/sendfileFTP";
import Url_BackEnd from "../../URL";
import URL_IMG from "../../URL_GETIMG";
import "./style.css";
import { createProductp, Get_all_ProductB_By_StoreID } from "./handleproduct";
const Contacts = () => {
  useTranslation();
  const [stateStore, setStateStore] = useState([]);
  const [stateProduct, setStateProduct] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [stateimage, setStateimg] = useState("");
  const [stateimageFileName, setStateimgFileName] = useState("");
  const [stateimageFileNameEdit, setStateimgFileNameEdit] = useState("");
  const [stateimageEdit, setStateimgEdit] = useState("");
  const [stateaccess, setstateaccess] = useState(false);
  const [stateViewimg, setstateViewimg] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [ischeckloai, setIscheckloai] = useState(false);
  const [stateSizeProduct, setStateSizeProduct] = useState(15);
  const [stateLength, setStateLength] = useState(0);
  const [stateBaocao, setStateBaocao] = useState(false);
  const [stateProductB, setStateProductB] = useState([]);
  const [stateFormBaocao, setStateFormBaocao] = useState({
    tinhtrang: "",
    soluong: 0,
  });
  const [stateFormProduct, setStateFormProduct] = useState({
    id: "",
    name: "...",
    picture: "...",
    loai: "",
    soluong: 0,
    sotien: 0,
    status: "GOOD",
    StoreID: "",
    xuatxu: "",
    behavior: "SELF ADD",
  });

  const [EditProductForm, setEditProductForm] = useState({
    id: "",
    name: "",
    picture: "",
    loai: "",
    soluong: 0,
    sotien: 0,
    status: "",
    xuatxu: "",
    StoreID: "",
  });
  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };
  const Columns = [
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
      field: "soluong",
      headerAlign: "left",
      headerName: `${i18n.t("SOLUONG_P")}`,
      flex: 1,
    },

    {
      field: "sotien",
      headerName: `${i18n.t("SOTIEN_NP")}`,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: StatusMoney,
    },
    {
      field: "behavior",
      headerName: `${i18n.t("HV")}`,
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
  ];
  const ColumnsSPADMIN = [
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
      field: "soluong",
      headerAlign: "left",
      headerName: `${i18n.t("SOLUONG_P")}`,
      flex: 1,
    },

    {
      field: "sotien",
      headerName: `${i18n.t("SOTIEN_NP")}`,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: StatusMoney,
    },
  ];
  const ColumnsB = [
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
      headerName: `${i18n.t("XUATSU_X")}`,
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
      headerName: `${i18n.t("SOTIEN_NP")}`,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: StatusMoney,
    },
    {
      field: "date",
      headerAlign: "left",
      headerName: `Thời điểm cập nhật`,
      flex: 1,
    },
  ];
  function ImageCell(params) {
    return (
      <img
        src={params.value}
        onDoubleClick={clickdoublegetimg}
        alt="Image"
        loading="lazy"
        width={100}
        height={50}
        style={{ cursor: "pointer" }}
      />
    );
  }
  function StatusMoney(params) {
    const arrayObject = params.value;
    // Định dạng số thành chuỗi với dấu phân cách
    const formattedNumber = parseInt(arrayObject).toLocaleString("en-US");
    return (
      <>
        {stateaccess ? (
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
        ) : (
          <span>#####</span>
        )}
      </>
    );
  }
  const clickdoublegetimg = (e) => {
    setstateViewimg(e.target.src);
  };
  const onChangeAddProductForm = (event) => {
    setStateFormProduct({
      ...stateFormProduct,
      [event.target.name]: event.target.value,

      StoreID: statechinhanh,
      behavior: "SELF ADD",
    });
  };

  const convertoBase64 = async (e) => {
    const check = await CheckFileName(
      e.target.files[0].name,
      "STORE",
      statechinhanh
    );
    setStateimgFileName(check);
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setStateFormProduct({
        ...stateFormProduct,
        picture: URL_IMG + `STORE/${statechinhanh}/` + check,
      });
      setStateimg(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
  };

  const convertoBase64Edit = async (e) => {
    const check = await CheckFileName(
      e.target.files[0].name,
      "STORE",
      statechinhanh
    );
    setStateimgFileNameEdit(check);
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setEditProductForm({
        ...EditProductForm,
        picture: URL_IMG + `STORE/${statechinhanh}/` + check,
      });
      setStateimgEdit(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let checkaccess = false;
  let chinhanhdau = "";
  let soluongLength = 0;
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
    setstateaccess(checkaccess);
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

  // Hàm để gọi API và lấy dữ liệu theo đợt
  // const fetchDataProduct = async (x, length) => {
  //   const totalBatches = Math.ceil(
  //     parseInt(length) / parseInt(stateSizeProduct)
  //   );

  //   let stateSize = stateSizeProduct;
  //   let slength = length;

  //   const allProducts = [];

  //   for (let i = 0; i < totalBatches; i++) {
  //     const startIndexx = i * stateSize;
  //     const endIndexx = Math.min((i + 1) * stateSize - 1, slength - 1);

  //     // // const endIndexx = startIndexx + stateSizeProduct;
  //     // console.log("startIndexx " + startIndexx);

  //     // console.log("endIndexx " + endIndexx);
  //     try {
  //       let formFetching = {
  //         StoreID: x,
  //         startIndex: startIndexx,
  //         endIndex: endIndexx,
  //       };

  //       const response = await Get_all_Product_By_StoreID(formFetching);

  //       const productsInBatch = response;
  //       setStateProduct(JSON.parse(productsInBatch));

  //       console.log("log status " + JSON.stringify(productsInBatch));
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  // };

  const fetchingGettAllProduct_by_storeID = async (x) => {
    let formFetching = {
      StoreID: x,
      startIndex: 15,
      endIndex: 20,
    };
    const check = await Get_all_Product_By_StoreID(formFetching);

    if (check instanceof Promise) {
      console.log("check 1");
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      let arraySort = [];
      const resolvedResult = await check;
      let arrtemp = resolvedResult;

      const filteredDataMK = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("MK")
      );
      const filteredDataLK = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("LK")
      );
      const filteredDataCM = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("CM")
      );
      const filteredDataCT = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("CT")
      );
      const filteredDataGL = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("GL")
      );
      const filteredDataGN = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("GN")
      );
      const filteredDataOPPN = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("OPPN")
      );
      const filteredDataOPPL = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("OPPL")
      );

      const filteredDataPOR = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("POR")
      );
      arraySort = arraySort
        .concat(filteredDataMK)
        .concat(filteredDataLK)
        .concat(filteredDataCM)
        .concat(filteredDataCT)

        .concat(filteredDataGN)
        .concat(filteredDataGL)
        .concat(filteredDataOPPN)
        .concat(filteredDataOPPL)

        .concat(filteredDataPOR);
      setStateProduct(arraySort);
    } else {
      let arraySort = [];
      let arrtemp = check;
      const filteredDataMK = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("MK")
      );

      const filteredDataLK = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("LK")
      );
      const filteredDataCM = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("CM")
      );

      const filteredDataCT = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("CT")
      );

      const filteredDataGL = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("GL")
      );
      const filteredDataGN = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("GN")
      );
      const filteredDataOPPN = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("OPPN")
      );
      const filteredDataOPPL = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("OPPL")
      );
      const filteredDataPOR = JSON.parse(arrtemp).filter((item) =>
        item.id.startsWith("POR")
      );

      arraySort = arraySort
        .concat(filteredDataMK)
        .concat(filteredDataLK)
        .concat(filteredDataCM)
        .concat(filteredDataCT)
        .concat(filteredDataGN)
        .concat(filteredDataGL)
        .concat(filteredDataOPPN)
        .concat(filteredDataOPPL)
        .concat(filteredDataPOR);
      setStateProduct(arraySort);
      // Lặp qua từng đợt và gọi API
    }
  };

  const fetchingGettAllProductB_by_storeID = async (x) => {
    const check = await Get_all_ProductB_By_StoreID(x);

    if (check instanceof Promise) {
      const resolvedResult = await check;
      let arrtemp = resolvedResult;

      const newArrayObjects = JSON.parse(arrtemp).map((item, index) => ({
        ...item,
        id: item.id + "(" + index + ")",
      }));

      let arraySort = [];
      const filteredDataMK = newArrayObjects.filter((item) =>
        item.id.includes("MK")
      );
      const filteredDataLK = newArrayObjects.filter((item) =>
        item.id.includes("LK")
      );
      const filteredDataCM = newArrayObjects.filter((item) =>
        item.id.includes("CM")
      );
      const filteredDataCT = newArrayObjects.filter((item) =>
        item.id.includes("CT")
      );
      const filteredDataPOR = newArrayObjects.filter((item) =>
        item.id.includes("POR")
      );
      arraySort = arraySort
        .concat(filteredDataMK)
        .concat(filteredDataLK)
        .concat(filteredDataCM)
        .concat(filteredDataCT)
        .concat(filteredDataPOR);

      setStateProductB(arraySort);
    } else {
      let arrtemp = check;
      const newArrayObjects = JSON.parse(arrtemp).map((item, index) => ({
        ...item,
        id: item.id + "(" + index + ")",
      }));

      let arraySort = [];
      const filteredDataMK = newArrayObjects.filter((item) =>
        item.id.includes("MK")
      );
      const filteredDataLK = newArrayObjects.filter((item) =>
        item.id.includes("LK")
      );
      const filteredDataCM = newArrayObjects.filter((item) =>
        item.id.includes("CM")
      );
      const filteredDataCT = newArrayObjects.filter((item) =>
        item.id.includes("CT")
      );
      const filteredDataPOR = newArrayObjects.filter((item) =>
        item.id.includes("POR")
      );
      arraySort = arraySort
        .concat(filteredDataMK)
        .concat(filteredDataLK)
        .concat(filteredDataCM)
        .concat(filteredDataCT)
        .concat(filteredDataPOR);
      setStateProductB(arraySort);
    }
  };
  const fetchingGettAll_Length_Product_by_storeID = async (x) => {
    const check = await Get_all_LENGHT_Product_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;
      soluongLength = parseInt(JSON.stringify(resolvedResult));
      setStateLength(parseInt(JSON.stringify(resolvedResult)));
    } else {
      soluongLength = parseInt(JSON.stringify(check));
      setStateLength(parseInt(JSON.stringify(check)));
    }
  };
  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    // await fetchingGettAll_Length_Product_by_storeID(chinhanhdau);

    await fetchingGettAllProduct_by_storeID(chinhanhdau);
    // await fetchDataProduct("ST08", 183);
    await fetchingGettAllProductB_by_storeID(chinhanhdau);
    setStatechinhanh(chinhanhdau);
  };
  const handle_getAllProduct = async (e) => {
    // await fetchingGettAll_Length_Product_by_storeID(e.target.value);
    // await fetchDataProduct(e.target.value, stateLength);
    await fetchingGettAllProduct_by_storeID(e.target.value);
    await fetchingGettAllProductB_by_storeID(e.target.value);
    setStatechinhanh(e.target.value);
  };

  const addproduct = async () => {
    let countdozens = 1;
    let checkNum = 0;
    if (stateFormProduct.sotien / 1000 < 1) {
      alert("This money Invalid!!");

      return;
    }
    if ((String(stateFormProduct.sotien).length - 1) % 3 == 0) {
      let n = (String(stateFormProduct.sotien).length - 1) / 3;
      if (n >= 2) {
        for (let index = 2; index <= n; index++) {
          countdozens = countdozens * 10;
        }
      }
    }

    let addproductFormTemp = {
      id: "",
      name: stateFormProduct.name,
      picture: stateFormProduct.picture,
      loai: "",
      soluong: stateFormProduct.soluong,
      status: stateFormProduct.status,
      //conver so tiền 51.000 -> 60.000, 71->80
      sotien:
        Math.ceil(stateFormProduct.sotien / (1000 * countdozens) / 10) *
        10 *
        countdozens *
        1000,

      StoreID: stateFormProduct.StoreID,
      xuatxu: stateFormProduct.xuatxu,
      behavior: stateFormProduct.behavior,
    };
    if (
      stateFormProduct.loai === "CT" ||
      stateFormProduct.loai === "CM" ||
      stateFormProduct.loai === "LK" ||
      stateFormProduct.loai === "MK" ||
      stateFormProduct.loai === "GN" ||
      stateFormProduct.loai === "GL" ||
      stateFormProduct.loai === "OPPL" ||
      stateFormProduct.loai === "OPPN"
    ) {
      // Lọc dữ liệu với id chứa "CT"
      let valueNum =
        Math.ceil(stateFormProduct.sotien / (1000 * countdozens) / 10) *
        countdozens *
        10;
      const filteredData = stateProduct.filter((item) =>
        item.id.includes(stateFormProduct.loai + valueNum + "-")
      );
      // Tách phần số từ chuỗi 'id' và chuyển đổi thành số nguyên
      let arrayOfNumbers = [];
      if (filteredData.length > 0) {
        arrayOfNumbers = filteredData.map((obj) =>
          parseInt(obj.id.split("-")[1])
        );
      }
      console.log("check arrayOfNumbers " + arrayOfNumbers);
      // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
      let maxNumber = Math.max(...arrayOfNumbers);
      const result = 1 / 0;

      const negativeInfinity = -1 / 0;

      if (maxNumber === negativeInfinity || maxNumber === result) {
        maxNumber = 0;
      }
      let lenghtState = maxNumber + 1;
      addproductFormTemp.id =
        stateFormProduct.loai + valueNum + "-" + lenghtState;
      addproductFormTemp.loai = converIDloaiTONAME[stateFormProduct.loai];
    } else {
      addproductFormTemp.loai = stateFormProduct.loai;
      // Tách phần số từ chuỗi 'id' và chuyển đổi thành số nguyên
      // Lọc dữ liệu với id chứa "CT"
      const filteredData = stateProduct.filter((item) =>
        item.id.includes("POR")
      );
      const arrayOfNumbers = filteredData.map((obj) =>
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
      addproductFormTemp.id = "POR" + lenghtState;
    }

    const check = await createProduct(addproductFormTemp);

    await fetchingGettAllProduct_by_storeID(statechinhanh);
    await fetchingGettAllProductB_by_storeID(statechinhanh);
    if (JSON.parse(check).success || JSON.parse(check).success === "true") {
      alert(`${i18n.t("ALERT_THEMSANPHAM_P")}`);
      await HandleUpload(
        "STORE",
        stateimage,
        statechinhanh,
        stateimageFileName
      );
    }

    setStateFormProduct({
      id: "",
      name: "",
      picture: "",
      loai: "",
      soluong: 0,
      status: "",
      sotien: "",
      StoreID: "",
      xuatxu: "",
      behavior: "SELF ADD",
    });
    setStateimgEdit("");
    setStateimg("");
  };
  const addproduct_admin = async () => {
    let addproductFormTemp = {
      id: "",
      name: stateFormProduct.name,
      picture: stateFormProduct.picture,
      loai: stateFormProduct.loai,
      soluong: stateFormProduct.soluong,
      status: stateFormProduct.status,
      sotien: stateFormProduct.sotien,
      StoreID: stateFormProduct.StoreID,
      xuatxu: stateFormProduct.xuatxu,
      behavior: stateFormProduct.behavior,
    };
    // Lọc dữ liệu với id chứa "CT"
    const filteredData = stateProduct.filter((item) => item.id.includes("POR"));
    const arrayOfNumbers = filteredData.map((obj) =>
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
    addproductFormTemp.id = "POR" + lenghtState;
    const check = await createProduct(addproductFormTemp);

    await fetchingGettAllProduct_by_storeID(statechinhanh);
    await fetchingGettAllProductB_by_storeID(statechinhanh);
    if (JSON.parse(check).success || JSON.parse(check).success === "true") {
      alert(`${i18n.t("ALERT_THEMSANPHAM_P")}`);
      await HandleUpload(
        "STORE",
        stateimage,
        statechinhanh,
        stateimageFileName
      );
    }
    setStateFormProduct({
      id: "",
      name: "",
      picture: "...",
      loai: "",
      soluong: 0,
      status: "",
      sotien: "",
      StoreID: "",
      xuatxu: "",
      behavior: "SELF ADD",
    });
    setStateimgEdit("");
    setStateimg("");
  };

  const handleExportExcel = async () => {
    // Mảng JSON chứa dữ liệu
    let data = [];
    stateProduct.forEach((element) => {
      let object = {
        [i18n.t("MASP_P").toUpperCase()]: element.id,

        [i18n.t("LOAI_P").toUpperCase()]: element.loai.toUpperCase(),

        [i18n.t("SOLUONG_P").toUpperCase()]: parseFloat(element.soluong),

        [i18n.t("SOTIEN_NP").toUpperCase()]: parseFloat(element.sotien),
      };
      data.push(object);
    });
    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Tạo dòng header tùy chỉnh
    const headerRow = worksheet.addRow([
      i18n.t("MASP_P").toUpperCase(),
      i18n.t("LOAI_P").toUpperCase(),

      i18n.t("SOLUONG_P").toUpperCase(),

      i18n.t("SOTIEN_NP").toUpperCase(),
    ]);
    // headerRow.font = { bold: true, color: { argb: "FF000000" } };
    // headerRow.fill = {
    //   type: "pattern",
    //   pattern: "solid",
    //   fgColor: { argb: "FFFF00" },
    // };

    // Đặt dữ liệu
    data.forEach((row) => {
      const rowData = Object.keys(row).map((key) => row[key]);
      worksheet.addRow(rowData);
    });
    const columnE1 = worksheet.getCell("A1");
    columnE1.font = { bold: true, color: { argb: "FF000000" } };
    columnE1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    const columnE2 = worksheet.getCell("D1");
    columnE2.font = { bold: true, color: { argb: "FF000000" } };
    columnE2.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    const columnE3 = worksheet.getCell("B1");
    columnE3.font = { bold: true, color: { argb: "FF000000" } };
    columnE3.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    const columnE4 = worksheet.getCell("C1");
    columnE4.font = { bold: true, color: { argb: "FF000000" } };
    columnE4.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };

    worksheet.columns = [
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
    ];

    const columnD = worksheet.getColumn("D");
    columnD.alignment = { horizontal: "center", vertical: "middle" };
    columnD.numFmt = "#,##";

    // Định dạng cột B
    const columnE = worksheet.getColumn("C");
    columnE.alignment = { horizontal: "center", vertical: "middle" };
    columnE.numFmt = "#,##";

    // Xuất workbook vào tệp Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `"Product"-${converToName[statechinhanh]}.xlsx`;
    link.click();
  };

  const handleExportExcel_B = () => {
    const rows = stateProductB.map((staff) => {
      if (stateaccess) {
        return {
          [i18n.t("MASP_P")]: staff.id,
          [i18n.t("TEN_P")]: staff.name,
          [i18n.t("LOAI_P")]: staff.loai,
          [i18n.t("TINHTRANG_P")]: staff.status,
          [i18n.t("SOLUONG_P")]: staff.soluong,
          [i18n.t("SOTIEN_NP")]: staff.sotien,

          [i18n.t("XUATSU_X")]: staff.xuatxu,
          // Thêm các trường khác nếu cần
        };
      }
      if (stateaccess) {
        return {
          [i18n.t("MASP_P")]: staff.id,
          [i18n.t("TEN_P")]: staff.name,
          [i18n.t("LOAI_P")]: staff.loai,
          [i18n.t("TINHTRANG_P")]: staff.status,
          [i18n.t("SOLUONG_P")]: staff.soluong,

          [i18n.t("XUATSU_X")]: staff.xuatxu,
          // Thêm các trường khác nếu cần
        };
      }
    });

    const wb = XLSX.utils.book_new();
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
    const convert = converToName[statechinhanh];
    XLSX.utils.book_append_sheet(wb, ws, "Product Data");
    XLSX.writeFile(wb, `Product_BROKEN_Data_${convert}.xlsx`);
  };
  const handleSaveClick = async () => {
    try {
      setIsloading(true);
      const selectedRows = stateProduct.filter((row) =>
        selectionModel.includes(row.id)
      );
      const check = await DeleteProduct(selectedRows);

      if (JSON.parse(check).success) {
        alert("Deleted success");
        setIsloading(false);
        fetchingGettAllProduct_by_storeID(statechinhanh);
        fetchingGettAllProductB_by_storeID(statechinhanh);
      }
    } catch (error) {
      console.log(error);
    }

    // Thực hiện xử lý theo nhu cầu của bạn
  };
  const handleEdit = () => {
    const selectedRows = stateProduct.filter((row) =>
      selectionModel.includes(row.id)
    );

    fetchingGettAllProduct_by_storeID(statechinhanh);
    fetchingGettAllProductB_by_storeID(statechinhanh);
    setEditProductForm({
      ...EditProductForm,
      id: selectedRows[0].id,
      name: selectedRows[0].name,
      picture: selectedRows[0].picture,
      loai: selectedRows[0].loai,
      soluong: selectedRows[0].soluong,
      status: selectedRows[0].status,
      StoreID: selectedRows[0].StoreID,
      xuatxu: selectedRows[0].xuatxu,
      sotien: selectedRows[0].sotien,
    });
    setStateimgEdit(selectedRows[0].picture);

    // Thực hiện xử lý theo nhu cầu của bạn
  };
  const onChangeEditProductForm = (event) => {
    setEditProductForm({
      ...EditProductForm,
      [event.target.name]: event.target.value,
    });
  };

  const onChangeBaocaoProductForm = (event) => {
    if (
      event.target.name === "soluong" &&
      event.target.value > EditProductForm.soluong
    ) {
      alert("Số lượng báo không được vược quá trong kho!!!!");
      setStateFormBaocao({
        ...stateFormBaocao,
        soluong: EditProductForm.soluong,
      });
      return;
    }
    setStateFormBaocao({
      ...stateFormBaocao,
      [event.target.name]: event.target.value,
    });
  };
  const editproduct = async () => {
    let formEdit = {
      id: EditProductForm.id,
      name: EditProductForm.name,
      picture: EditProductForm.picture,
      loai: EditProductForm.loai,
      soluong: parseInt(EditProductForm.soluong),
      status: EditProductForm.status,
      StoreID: EditProductForm.StoreID,
      xuatxu: EditProductForm.xuatxu,
      sotien: EditProductForm.sotien,
    };
    if (stateBaocao) {
      // Tạo một đối tượng Date hiện tại
      const currentDate = new Date();

      // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
      const day = currentDate.getDate().toString().padStart(2, "0");

      // Tạo chuỗi datetime
      const datetimeString = `${year}-${month}-${day}`;

      let formCreateP = {
        id: EditProductForm.id,
        name: EditProductForm.name,
        picture: EditProductForm.picture,
        loai: EditProductForm.loai,
        soluong: stateFormBaocao.soluong,
        status: stateFormBaocao.tinhtrang,
        StoreID: EditProductForm.StoreID,
        date: datetimeString,
        xuatxu: EditProductForm.xuatxu,
        sotien: EditProductForm.sotien,
      };
      const check = await createProductp(formCreateP);
      if (JSON.parse(check).success || JSON.parse(check) === "true") {
        formEdit.soluong =
          parseFloat(formEdit.soluong) - parseFloat(formCreateP.soluong);
      }
    }

    const check = await EditProduct(formEdit);
    await fetchingGettAllProduct_by_storeID(statechinhanh);
    await fetchingGettAllProductB_by_storeID(statechinhanh);
    if (JSON.parse(check).success || JSON.parse(check).success === "true") {
      alert("Update success");
      await HandleUpload(
        "STORE",
        stateimageEdit,
        statechinhanh,
        stateimageFileNameEdit
      );
      setSelectionModel([]);
      setStateBaocao(false);
      setStateFormBaocao({});
    }
  };
  useEffect(() => {
    try {
      fetchingapi();
    } catch (error) {}
  }, []);

  return (
    <Box m="20px">
      <Header title={i18n.t("TITLEKHO")} subtitle={i18n.t("DESKHO")} />
      <div style={{ width: "100%", display: "flex" }}>
        <button
          type="button"
          class="button-86"
          data-toggle="modal"
          data-target="#staticBackdrop"
        >
          {i18n.t("THEMSP_P")}
        </button>
        {!isloading ? (
          <button
            type="button"
            class="button-86xoa"
            style={{ marginLeft: "1%" }}
            onClick={handleSaveClick}
          >
            {i18n.t("XOASP_P")}
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
          {i18n.t("DIEUCHINHSP_P")}
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
                  Điều chỉnh thông tin
                  {/* <br></br>
                  <label htmlFor="baocao">*Báo cáo sự cố sản phẩm </label>
                  <input
                    checked={stateBaocao}
                    onClick={() => {
                      setStateBaocao(!stateBaocao);
                    }}
                    name="baocao"
                    type="checkbox"
                  ></input> */}
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>{" "}
              {stateaccess ? (
                <>
                  {" "}
                  <div class="modal-body" style={{ color: "black" }}>
                    {" "}
                    <label htmlFor="Role">{i18n.t("SOLUONG_P")}</label>
                    <input
                      type="number"
                      value={EditProductForm.soluong}
                      onChange={onChangeEditProductForm}
                      name="soluong"
                    ></input>
                    <label htmlFor="Role">{i18n.t("SOTIEN_NP")}</label>
                    <input
                      type="number"
                      value={EditProductForm.sotien}
                      onChange={onChangeEditProductForm}
                      name="sotien"
                    ></input>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  <div class="modal-body" style={{ color: "black" }}>
                    {stateBaocao ? (
                      <>
                        {" "}
                        <label htmlFor="tinhtrang" name="tinhtrang">
                          Tình trạng
                        </label>
                        <input
                          type="text"
                          name="tinhtrang"
                          value={stateFormBaocao.tinhtrang}
                          onChange={onChangeBaocaoProductForm}
                        ></input>{" "}
                        <label htmlFor="soluong" name="soluong">
                          Số lượng
                        </label>
                        <input
                          type="text"
                          name="soluong"
                          value={stateFormBaocao.soluong}
                          onChange={onChangeBaocaoProductForm}
                        ></input>
                        <hr></hr>
                      </>
                    ) : (
                      ""
                    )}

                    <label htmlFor="name" name="name">
                      {i18n.t("TEN_P")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={EditProductForm.name}
                      onChange={onChangeEditProductForm}
                    ></input>
                    <label htmlFor="phone"> {i18n.t("LOAI_P")}</label>
                    <input
                      type="text"
                      name="loai"
                      value={EditProductForm.loai}
                      onChange={onChangeEditProductForm}
                    ></input>

                    {stateBaocao ? (
                      ""
                    ) : (
                      <>
                        {" "}
                        <label htmlFor="Role">{i18n.t("SOLUONG_P")}</label>
                        <input
                          type="number"
                          value={EditProductForm.soluong}
                          onChange={onChangeEditProductForm}
                          name="soluong"
                        ></input>
                      </>
                    )}

                    {/* <label htmlFor="picture">{i18n.t("HINHANH_P")}</label>
                    <input
                      accept="image/png, image/jpeg"
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
                    )} */}
                  </div>
                </>
              )}
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
                  onClick={editproduct}
                  data-dismiss="modal"
                  class="btn btn-primary"
                >
                  {i18n.t("BTN_XACNHAN")}
                </button>
              </div>
            </div>
          </div>
        </div>
        {stateaccess ? (
          <>
            {" "}
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
                      {i18n.t("THEMSP_P")}
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
                    {/* <label htmlFor="name"> {i18n.t("TEN_P")}</label>
                    <input
                      type="text"
                      name="name"
                      value={stateFormProduct.name}
                      onChange={onChangeAddProductForm}
                    ></input> */}
                    <div>
                      <label for="loaip">Chọn loại khác</label>
                      <input
                        type="checkbox"
                        id="loai"
                        name="loai"
                        onClick={() => {
                          setIscheckloai(!ischeckloai);
                          setStateFormProduct({
                            ...stateFormProduct,
                            loai: "",
                          });
                        }}
                        value={"Khác"}
                      />
                    </div>
                    {/* //true */}
                    {!ischeckloai ? (
                      <>
                        {" "}
                        <label for="loai">Loại</label>
                        <select
                          onChange={onChangeAddProductForm}
                          name="loai"
                          value={stateFormProduct.loai}
                        >
                          <option value="">-------------------</option>
                          <option value={"CT"}>Cài tóc</option>
                          <option value={"CM"}>Mũ</option>
                          <option value={"MK"}>Mắt kính</option>
                          <option value={"LK"}>Linh kiện</option>
                          <option value={"GN"}>Giấy in nhỏ</option>
                          <option value={"GL"}>Giấy in lớn</option>
                          <option value={"OPPL"}>Túi OPP lớn</option>
                          <option value={"OPPN"}>Túi OPP nhỏ</option>
                        </select>
                      </>
                    ) : (
                      <>
                        {" "}
                        <label htmlFor="loai">{i18n.t("LOAI_P")}</label>
                        <input
                          type="text"
                          name="loai"
                          value={stateFormProduct.loai}
                          onChange={onChangeAddProductForm}
                        ></input>
                      </>
                    )}
                    {ischeckloai ? (
                      <>
                        {" "}
                        <label htmlFor="name"> {i18n.t("TEN_P")}</label>
                        <input
                          type="text"
                          name="name"
                          value={stateFormProduct.name}
                          onChange={onChangeAddProductForm}
                        ></input>{" "}
                      </>
                    ) : (
                      ""
                    )}
                    {stateFormProduct.loai === "LK" ? (
                      <>
                        {" "}
                        <label htmlFor="name"> {i18n.t("TEN_P")}</label>
                        <input
                          type="text"
                          name="name"
                          value={stateFormProduct.name}
                          onChange={onChangeAddProductForm}
                        ></input>{" "}
                      </>
                    ) : (
                      ""
                    )}
                    <label htmlFor="Role">{i18n.t("SOLUONG_P")}</label>
                    <input
                      type="Number"
                      name="soluong"
                      value={stateFormProduct.soluong}
                      onChange={onChangeAddProductForm}
                    ></input>
                    {stateaccess ? (
                      <>
                        <label htmlFor="sotien">{i18n.t("SOTIEN_NP")}</label>
                        <input
                          type="Number"
                          name="sotien"
                          value={stateFormProduct.sotien}
                          onChange={onChangeAddProductForm}
                        ></input>
                      </>
                    ) : (
                      ""
                    )}

                    {/* <label htmlFor="xuatxu">{i18n.t("XUATSU_X")}</label>
                    <input
                      type="text"
                      name="xuatxu"
                      value={stateFormProduct.xuatxu}
                      onChange={onChangeAddProductForm}
                    ></input>
                    <label htmlFor="picture">{i18n.t("HINHANH_P")}</label>
                    <input
                      accept="image/png, image/jpeg"
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
                    )} */}
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
                      onClick={addproduct}
                      class="btn btn-primary"
                      data-dismiss="modal"
                    >
                      {i18n.t("BTN_XACNHAN")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {" "}
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
                      {i18n.t("THEMSP_P")}
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
                    <label htmlFor="name"> {i18n.t("TEN_P")}</label>
                    <input
                      type="text"
                      name="name"
                      value={stateFormProduct.name}
                      onChange={onChangeAddProductForm}
                    ></input>
                    <label htmlFor="phone">{i18n.t("LOAI_P")}</label>
                    <input
                      type="text"
                      name="loai"
                      value={stateFormProduct.loai}
                      onChange={onChangeAddProductForm}
                    ></input>
                    <label htmlFor="Role">{i18n.t("SOLUONG_P")}</label>
                    <input
                      type="Number"
                      name="soluong"
                      value={stateFormProduct.soluong}
                      onChange={onChangeAddProductForm}
                    ></input>
                    {stateaccess ? (
                      <>
                        {" "}
                        <label htmlFor="sotien">{i18n.t("SOTIEN_NP")}</label>
                        <input
                          type="Number"
                          name="sotien"
                          value={stateFormProduct.sotien}
                          onChange={onChangeAddProductForm}
                        ></input>
                      </>
                    ) : (
                      ""
                    )}

                    <label htmlFor="xuatxu">{i18n.t("XUATSU_X")}</label>
                    <input
                      type="text"
                      name="xuatxu"
                      value={stateFormProduct.xuatxu}
                      onChange={onChangeAddProductForm}
                    ></input>
                    <label htmlFor="picture">{i18n.t("HINHANH_P")}</label>
                    <input
                      accept="image/png, image/jpeg"
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
                      onClick={addproduct_admin}
                      class="btn btn-primary"
                      data-dismiss="modal"
                    >
                      {i18n.t("BTN_XACNHAN")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="container">
          <h3>{i18n.t("CN")}</h3>
          <select onChange={handle_getAllProduct} id="chinhanh">
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
        <br></br>
        {stateaccess ? (
          ""
        ) : (
          <>
            {" "}
            <div style={{ position: "relative", top: "-176%", left: "-49%" }}>
              <div style={{ top: "-160%" }} className="BoxIMG drop-target">
                {" "}
                {stateViewimg ? (
                  <img
                    src={stateViewimg}
                    alt="Image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  `${i18n.t("clickdouble")}`
                )}
              </div>
            </div>
          </>
        )}
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
        {stateaccess ? (
          <>
            {" "}
            <button onClick={handleExportExcel}>Export Excel</button>
          </>
        ) : (
          ""
        )}

        <DataGrid
          checkboxSelection
          editMode="row"
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          rows={stateProduct}
          columns={stateaccess ? ColumnsSPADMIN : Columns}
          pageSize={stateSizeProduct}
          components={{
            Toolbar: () => (
              <GridToolbar>
                <GridToolbarExport />
              </GridToolbar>
            ),
          }}
        />
      </Box>

      {/* Row kho broken */}
      {/* <Box
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
        <h3>{i18n.t("SANPHAMHONG")}</h3>
        <button onClick={handleExportExcel_B}>Export Excel</button>

        <DataGrid
          rows={stateProductB}
          columns={ColumnsB}
          pageSize={stateSizeProduct}
          components={{
            Toolbar: () => (
              <GridToolbar>
                <GridToolbarExport />
              </GridToolbar>
            ),
          }}
        />
      </Box> */}
    </Box>
  );
};

export default Contacts;
