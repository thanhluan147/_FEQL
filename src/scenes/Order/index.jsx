import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import "./style.css";
import React, { useState, useEffect } from "react";
import { Get_all_store_By_userid } from "../contacts/handlestore";
import { createPhieu } from "./handleform";
import { confirmAlert } from "react-confirm-alert";
import { Modal } from "react-bootstrap";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS
import { createOrder } from "./handleform";
import { Get_all_Store } from "../contacts/handlestore";
import { Get_all_Product_By_StoreID } from "../contacts/handleproduct";
import HandleAccessAccount from "../handleAccess/handleAccess";
import ReactLoading from "react-loading";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Get_all_Phieu_Store_By_StoreID } from "../invoices/handlePhieustore";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { EditProduct } from "../contacts/handleproduct";
import { useNavigate } from "react-router-dom";
import { getAllOrder_BY_storeID } from "./handleform";
import { CreateIdMaxValueOfarray } from "../method";
import { converToName } from "../method";
import { useRef } from "react";
import {
  Update_PhieuStore_By_id,
  Update_PhieuStore_By_id_WATING,
} from "../invoices/handlePhieustore";
const Form = () => {
  useTranslation();
  const nav = useNavigate();
  const targetRef = useRef(null);
  const [stateErrorMp, setstateErrorMp] = useState(false);
  const [stateErrorLP, setstateErrorLP] = useState(false);
  const [stateErrorDL, setstateErrorDL] = useState(false);
  const [stateErrorSL, setstateErrorSL] = useState(false);
  const [stateimage, setStateimg] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectionModelPhieu, setSelectionModelPhieu] = React.useState([]);
  const [stateProductfetch, setStateProductfetch] = useState([]);
  const [stateProduct, setStateProduct] = useState([]);
  const [stateStore, setStateStore] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stateContentModal, setStatecontentModal] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let chinhanhdau = "";
  let code = "";
  const [stateCode, setstateCode] = useState("");
  const [stateID, setstateID] = useState("");
  const [statesotienbandau, setsotienbandau] = useState(0);
  const [statechinhanhnhan, setchinhanhnhan] = useState("");
  const [stateCheckAccess, setstateCheckAccess] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [stateupdatesoluong, setstateupdatesoluong] = useState({
    usoluong: 0,
  });
  const [stateFormProduct, setStateFormProduct] = useState({
    id: "",
    name: "",
    picture: "",
    loai: "",
    soluong: "",
    status: "GOOD",
    diachi: "",
    sotien: 0,
  });
  let checkaccess = false;
  const handleOpenPopup = (content) => {
    setShowPopup(true);
    setStatecontentModal(content);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setStatecontentModal([]);
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
                  <th>Tên sản phẩm</th>
                  <th>Loại sản phẩm</th>
                  <th>Số lượng</th>

                  <th>Hình ảnh</th>
                  <th>Số tiền</th>
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
                    <th>{item.sotien} VND</th>
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
  const columnphieustore = [
    { field: "id", flex: 1, headerName: `${i18n.t("MAPN_PX")}` },
    {
      field: "status",
      headerName: `${i18n.t("TINHTRANG_P")}`,
      flex: 1,
      renderCell: StatusObjectCell,
    },
    {
      field: "loaiphieu",
      headerName: `${i18n.t("LOAIPHIEU_NHAP")}`,
      flex: 1,
      renderCell: StatusObjectCellLoai,
    },

    {
      field: "sotien",
      headerName: `${i18n.t("SOTIEN_NP")}`,
      renderCell: SotienObjectCell,
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
      renderCell: ArrayObjectCell,
    },
  ];
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
      field: "picture",
      headerName: `${i18n.t("HINHANH_P")}`,
      renderCell: ImageCell,
      flex: 1,
      width: 130,

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
      field: "behavior",
      headerAlign: "left",
      headerName: `${i18n.t("HANHVI_P")}`,
      flex: 1,
    },
  ];
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    loai: "",
    soluong: "",
    sotien: "",
    picture: "",
    id: "",
  });
  const [statePhieu, setStatePhieu] = useState({
    sotien: 0,
    loaiphieu: "",
    maphieu: "",
  });

  const onhandlechangePhieu = (event) => {
    setStatePhieu({
      ...statePhieu,
      [event.target.name]: event.target.value,
    });
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
  useEffect(() => {
    fetchingapi();
  }, []);
  const fetchingStore = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = Get_all_Store();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;
        setStateStore(JSON.parse(resolvedResult));

        chinhanhdau = JSON.parse(resolvedResult)[0].id;
        code = JSON.parse(resolvedResult)[0].code;

        setStatechinhanh(chinhanhdau);
        setstateCode(code);
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức

        setStateStore(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].id;
        code = JSON.parse(objBranch)[0].code;

        setStatechinhanh(chinhanhdau);
        setstateCode(code);
      }
    } else {
      const objBranch = Get_all_store_By_userid();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        setStateStore(JSON.parse(resolvedResult));
        chinhanhdau = JSON.parse(resolvedResult)[0].id;
        code = JSON.parse(resolvedResult)[0].code;

        setStatechinhanh(chinhanhdau);
        setstateCode(code);
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức
        setStateStore(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].id;
        code = JSON.parse(objBranch)[0].code;

        setStatechinhanh(chinhanhdau);
        setstateCode(code);
      }
    }
  };

  const fetchingGettAllProduct_by_storeID = async (x) => {
    const check = await Get_all_Product_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateProductfetch(JSON.parse(resolvedResult));
    } else {
      setStateProductfetch(JSON.parse(check));
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
    setstateCheckAccess(checkaccess);
  };
  const fetchgetAllOrder_BY_storeID = async (x, y) => {
    const check = await getAllOrder_BY_storeID(x);
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      const createID = CreateIdMaxValueOfarray(
        "PX",
        JSON.parse(resolvedResult),
        y
      );

      setstateID(createID);
    } else {
      const createID = CreateIdMaxValueOfarray("PX", JSON.parse(check), y);

      setstateID(createID);
    }
  };
  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    await fetchingGettAllProduct_by_storeID(chinhanhdau);
    await fetchingGettAllPhieu_by_StoreID(chinhanhdau);

    await fetchgetAllOrder_BY_storeID(chinhanhdau, code);
    setStatechinhanh(chinhanhdau);
    setchinhanhnhan(chinhanhdau);
  };
  function SotienObjectCell(params) {
    const Object = params.value;
    return <span>{Object} VND</span>;
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
  function StatusObjectCell(params) {
    const arrayObject = params.value;
    if (arrayObject === "CANCEL") {
      return (
        <span
          style={{
            backgroundColor: "red",
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
  function StatusObjectCellLoai(params) {
    const arrayObject = params.value;
    if (arrayObject === "NK") {
      return (
        <span
          style={{
            backgroundColor: "#4CAF50",
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
    if (arrayObject === "NN") {
      return (
        <span
          style={{
            backgroundColor: "#a52a2ad9",
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
  const showAlert = async () => {
    try {
      if (!statePhieu.loaiphieu) {
        setstateErrorLP(true);
        return;
      } else {
        setstateErrorLP(false);
      }
      if (!statePhieu.maphieu) {
        setstateErrorMp(true);
        return;
      } else {
        setstateErrorMp(false);
      }
      if (stateProduct.length === 0 || stateProduct == []) {
        setstateErrorDL(true);
        return;
      } else {
        setstateErrorDL(false);
      }
      if (stateErrorSL) {
        return;
      }
      confirmAlert({
        title: `${i18n.t("ALERT_TITLE")}`,
        message: `${i18n.t("ALERT_DES")} ${
          statePhieu.loaiphieu === "N"
            ? `${i18n.t("ALERT_PHIEUNHAP")}`
            : `${i18n.t("ALERT_PHIEUXUAT")}`
        } ${i18n.t("ALERT_CHU")}`,
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              setisloading(true);
              // Tạo một đối tượng Date hiện tại
              const currentDate = new Date();

              // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
              const year = currentDate.getFullYear();
              const month = (currentDate.getMonth() + 1)
                .toString()
                .padStart(2, "0"); // Tháng bắt đầu từ 0
              const day = currentDate.getDate().toString().padStart(2, "0");
              const hours = currentDate.getHours().toString().padStart(2, "0");
              const minutes = currentDate
                .getMinutes()
                .toString()
                .padStart(2, "0");
              const seconds = currentDate
                .getSeconds()
                .toString()
                .padStart(2, "0");
              const milliseconds = currentDate
                .getMilliseconds()
                .toString()
                .padStart(3, "0");

              // Tạo chuỗi datetime
              const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
              const createphieu = {
                id: stateID,
                tongtien: "0",
                storeID: statechinhanh,
                CreateAt: datetimeString,
                arrayProduct: stateProduct,
                phieustoreID: statePhieu.maphieu,
              };
              const c = await createOrder(createphieu);

              if (JSON.parse(c).success) {
                await updateEditproduct();
                await fetchingGettAllProduct_by_storeID(statechinhanh);
                setisloading(false);
                alert(`${i18n.t("ALERT_ADDPHIEUSUCCESS")}`);
                await Update_PhieuStore_By_id_WATING(selectionModelPhieu);
                await fetchingGettAllPhieu_by_StoreID(statechinhanh);
                await fetchgetAllOrder_BY_storeID(statechinhanh, stateCode);
                setStatePhieu({
                  sotien: 0,
                  loaiphieu: "",
                  maphieu: "",
                });
                setStateFormProduct({
                  id: "",
                  name: "",
                  picture: "",
                  loai: "",
                  soluong: "",
                  status: "GOOD",
                  dia: "",
                  sotien: 0,
                });
                setStateProduct([]);
                setSelectionModel([]);
                setSelectionModelPhieu([]);
              }
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };
  const acceptPhieu = () => {
    // Biến để kiểm tra

    // Sử dụng filter để lọc array1
    const filteredArray = stateProductfetch.filter((obj1) =>
      selectedRow[0].arrayProduct.some(
        (obj2) => obj2.id == obj1.id && obj2.soluong > obj1.soluong
      )
    );

    console.log("filteredArray " + JSON.stringify(filteredArray));
    if (filteredArray.length !== 0) {
      setstateErrorSL(true);
    } else {
      setstateErrorSL(false);
    }
    setStateProduct(selectedRow[0].arrayProduct);
    setStatePhieu({
      ...statePhieu,
      maphieu: selectedRow[0].id,
    });
    targetRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const updateEditproduct = async () => {
    for (const item of stateProduct) {
      const itemsWithIdOne = stateProductfetch.filter(
        (itemx) => itemx.id === item.id
      );
      item.soluong = parseInt(
        parseFloat(itemsWithIdOne[0].soluong) - parseFloat(item.soluong)
      );

      await EditProduct(item); // Gọi hàm bất đồng bộ trong vòng lặp
    }
  };
  const onChangeAddProductForm = (event) => {
    // // Tách phần số từ chuỗi 'id' và chuyển đổi thành số nguyên
    // const arrayOfNumbers = stateProduct.map((obj) =>
    //   parseInt(obj.id.replace(/[^\d]/g, ""), 10)
    // );

    // // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
    // let maxNumber = Math.max(...arrayOfNumbers);
    // const result = 1 / 0;

    // const negativeInfinity = -1 / 0;

    // if (maxNumber === negativeInfinity || maxNumber === result) {
    //   maxNumber = 0;
    // }
    // let lenghtState = maxNumber + 1;
    let temp = stateimage;

    setStateFormProduct({
      ...stateFormProduct,
      [event.target.name]: event.target.value,
      picture: temp,
    });
    setErrorMessages({
      name: "",
      loai: "",
      soluong: "",
      sotien: "",
      picture: "",
      id: "",
    });
  };
  const isIdInstate = (idToCheck) => {
    for (const column of stateProduct) {
      if (column.field === "id" && column.value === idToCheck) {
        return true;
      }
    }
    return false;
  };
  const addproduct = async () => {
    const { name, loai, soluong, sotien, id } = stateFormProduct;
    // console.log("id " + stateFormProduct.id);
    const errors = {};
    // if (isIdInstate(id)) {
    //   errors.id = "ID này đã tồn tại trong mãng";
    // }
    if (!name) {
      errors.name = "Vui lòng nhập Tên sản phẩm.";
    }

    if (!loai) {
      errors.loai = "Vui lòng nhập Loại.";
    }

    if (!soluong) {
      errors.soluong = "Vui lòng nhập Số lượng.";
    }

    if (!sotien) {
      errors.sotien = "Vui lòng nhập Giá tiền.";
    }

    // If there are errors, update the state to show error messages
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }
    setsotienbandau(
      parseFloat(statesotienbandau) + parseFloat(stateFormProduct.sotien)
    );

    setStatePhieu({
      ...statePhieu,
      sotien:
        parseFloat(statesotienbandau) + parseFloat(stateFormProduct.sotien),
    });

    const arry = [];
    arry.push(stateFormProduct);
    setStateProduct(stateProduct.concat(arry));
    setStateFormProduct({
      id: "",
      name: "",
      picture: "",
      loai: "",
      soluong: "",
      status: "GOOD",
      diachi: "",
      sotien: 0,
    });
  };
  const handleFormSubmit = (values) => {
    console.log(values);
  };
  const convertoBase64 = (e) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (!file) {
      setErrorMessages((prev) => ({
        ...prev,
        picture: "Vui lòng chọn một hình ảnh.",
      }));
      return;
    }
    setErrorMessages({
      ...errorMessages,
      picture: "",
    });

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setStateFormProduct((prev) => ({ ...prev, picture: reader.result }));
      setStateimg(reader.result);
    };

    reader.onerror = (error) => {
      console.error("Error reading the file: ", error);
    };
  };

  const handleDelete = (productId) => {
    const updatedState = stateProduct.filter((item) => item.id !== productId);

    // Cập nhật stateProduct
    const updateMoney = stateProduct.filter((item) => item.id === productId);

    setsotienbandau(
      parseFloat(statesotienbandau) - parseFloat(updateMoney[0].sotien)
    );

    setStatePhieu({
      ...statePhieu,
      sotien: parseFloat(statesotienbandau) - parseFloat(updateMoney[0].sotien),
    });
    setStateProduct(updatedState);
  };
  const handleEditProduct = (productId) => {
    const checksoluongrow = stateProductfetch.filter(
      (item) => item.id === productId
    );
    if (
      checksoluongrow[0].soluong < stateupdatesoluong.usoluong ||
      stateupdatesoluong.usoluong < 0
    ) {
      alert("Số lượng nhập có giá trị lớn hơn số lượng đang có hoặc nhỏ hơn 0");
      return;
    }
    const updatedRows = stateProduct.map((row) =>
      row.id === productId
        ? { ...row, soluong: stateupdatesoluong.usoluong }
        : row
    );
    setstateupdatesoluong({
      usoluong: 0,
    });
    setStateProduct(updatedRows);
  };
  const handle_getAllProduct = async (e) => {
    await fetchingGettAllProduct_by_storeID(e.target.value);
    const selectedId = e.target.options[e.target.selectedIndex].id;
    await fetchgetAllOrder_BY_storeID(e.target.value, selectedId);
    setstateCode(selectedId);
    setStatechinhanh(e.target.value);
  };
  const handle_changechinhanhnhan = async (e) => {
    await fetchingGettAllPhieu_by_StoreID(e.target.value);
  };
  const handleSelectionModelChange = (newSelectionModel) => {
    const hasAcceptedOrCancelled = newSelectionModel.some((selectedId) => {
      const selectedRow = stateProductfetch.find(
        (row) => row.id === selectedId
      );
      return selectedRow && selectedRow.soluong === 0;
    });
    if (hasAcceptedOrCancelled) {
      // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
      alert("Không thể chọn sản phẩm với số lượng là 0!!!");
      return;
    }
    setSelectionModel(newSelectionModel);
  };

  const handleSelectionModelChangePhieu = (newSelectionModel) => {
    const selectedRows = newSelectionModel.map((selectedId) =>
      statePhieuStore.find((row) => row.id === selectedId)
    );
    setstateErrorSL(false);
    setSelectedRow(selectedRows);

    const hasAcceptedOrCancelled = newSelectionModel.some((selectedId) => {
      const selectedRow = statePhieuStore.find((row) => row.id === selectedId);
      return (
        selectedRow &&
        (selectedRow.status === "ACCEPT" ||
          selectedRow.status === "CANCEL" ||
          selectedRow.status === "WAITING" ||
          selectedRow.loaiphieu === "NN")
      );
    });
    if (hasAcceptedOrCancelled) {
      // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
      return;
    }
    setSelectionModelPhieu(newSelectionModel);
  };
  const onchangeupdatesoluong = (event) => {
    setstateupdatesoluong({
      ...stateupdatesoluong,
      [event.target.name]: event.target.value,
    });
  };
  const handleGetSelectedData = () => {
    const selectedData = selectionModel.map((selectedId) => {
      return stateProductfetch.find((row) => row.id === selectedId);
    });
    // Đồng thời thay đổi giá trị sotien thành 0 trong selectedData
    const updatedSelectedData = selectedData.map((selectedItem) => {
      // Kiểm tra xem có selectedItem không trả về undefined
      if (selectedItem) {
        // Tạo một bản sao của đối tượng để không ảnh hưởng đến stateProductfetch
        const updatedItem = { ...selectedItem, behavior: "ADMIN ADD" };
        return updatedItem;
      }
      return selectedItem; // Trả về nguyên bản nếu không tìm thấy đối tượng
    });
    setStateProduct(updatedSelectedData);
    setSelectionModel([]);
    // selectedData là mảng chứa dữ liệu của các hàng được chọn
  };
  function ImageCell(params) {
    return (
      <img
        src={params.value}
        alt="Image"
        loading="lazy"
        width={100}
        height={50}
        style={{ cursor: "pointer" }}
      />
    );
  }
  return (
    <Box ref={targetRef} m="20px">
      <Header title={i18n.t("TITLEPHIEUXUAT")} />
      <div
        style={{
          marginLeft: "-.75%",
          marginBottom: "2%",
          display: "flex",
          width: "50%",
        }}
      >
        <div className="container">
          <h3>{i18n.t("CN_XUAT")}</h3>
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

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* <TextField
                variant="filled"
                disabled
                type="number"
                label={i18n.t("TONGSOTIEN_NHAP")}
                name="sotien"
                value={statePhieu.sotien}
                onChange={onhandlechangePhieu}
                sx={{ gridColumn: "span 2" }}
              /> */}
              <FormControl>
                <TextField
                  variant="filled"
                  type="text"
                  label={i18n.t("MAPHIEU_XUAT")}
                  name="maphieu"
                  value={statePhieu.maphieu}
                  onChange={onhandlechangePhieu}
                  sx={{ gridColumn: "span 2" }}
                />
                <label htmlFor="maphieu">
                  {" "}
                  {stateErrorMp ? (
                    <span style={{ color: "red" }}>
                      *Lỗi không được để trống
                    </span>
                  ) : (
                    ""
                  )}
                </label>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="age-filter">
                  {i18n.t("LOAIPHIEU_NHAP")}
                </InputLabel>
                <Select
                  label={i18n.t("LOAIPHIEU_NHAP")}
                  inputProps={{
                    id: "age-filter",
                  }}
                  variant="outlined"
                  name="loaiphieu"
                  value={statePhieu.loaiphieu}
                  onChange={onhandlechangePhieu}
                >
                  <MenuItem value={"X"}>{i18n.t("LABLE_XUAT")}</MenuItem>
                </Select>
                {stateErrorLP ? (
                  <span style={{ color: "red" }}>*Lỗi không được để trống</span>
                ) : (
                  ""
                )}
              </FormControl>
            </Box>
            <div className="table-container">
              <label htmlFor="usoluong">*{i18n.t("SLDC")}</label>
              <br></br>
              {stateErrorSL ? (
                <label style={{ color: "red" }} htmlFor="usoluong">
                  * Số lượng đã vượt quá giới hạn trong kho !
                </label>
              ) : (
                ""
              )}

              <br></br>
              <input
                placeholder="Số lượng"
                onChange={onchangeupdatesoluong}
                value={stateupdatesoluong.usoluong}
                name="usoluong"
                type="number"
              ></input>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>{i18n.t("TEN_P")}</th>
                    <th>{i18n.t("LOAI_P")}</th>
                    <th>{i18n.t("SOLUONG_P")}</th>
                    <th>{i18n.t("XUATSU_X")}</th>
                    <th>{i18n.t("HINHANH_P")}</th>

                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {stateProduct.map((item) => (
                    <tr>
                      <th>{item.id}</th>
                      <td>{item.name}</td>
                      <td>{item.loai}</td>
                      <td>{item.soluong}</td>

                      <td>{item.xuatxu}</td>
                      <td>
                        {item.picture ? (
                          <img
                            width={200}
                            height={100}
                            src={item.picture}
                          ></img>
                        ) : (
                          ""
                        )}
                      </td>

                      <th>
                        <button
                          onClick={() => handleDelete(item.id)}
                          class="bn632-hover bn28"
                        >
                          {i18n.t("BTN_XOA")}
                        </button>

                        <button
                          style={{ backgroundColor: "green" }}
                          class="bn632-hover bn2"
                          onClick={() => handleEditProduct(item.id)}
                        >
                          Điều chỉnh
                        </button>
                      </th>
                    </tr>
                  ))}
                </tbody>
                {stateErrorDL ? (
                  <span style={{ color: "red" }}>*Lỗi chưa có dử liệu</span>
                ) : (
                  ""
                )}
              </table>

              {/*
                add stateformproduct
              <div
                className="add-button"
                data-toggle="modal"
                data-target="#staticBackdrop"
                type="button"
              >
                +
              </div> */}

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
                        {i18n.t("TITLEPHIEUXUAT")}
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
                      {Object.keys(errorMessages).map((key) => (
                        <p key={key} style={{ color: "red" }}>
                          {errorMessages[key]}
                        </p>
                      ))}
                      <label htmlFor="masp"> Mã sản phẩm</label>
                      <input
                        type="text"
                        name="id"
                        value={stateFormProduct.id}
                        onChange={onChangeAddProductForm}
                      ></input>
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
                        type="text"
                        name="soluong"
                        value={stateFormProduct.soluong}
                        onChange={onChangeAddProductForm}
                      ></input>

                      <label htmlFor="Role">{i18n.t("SOTIEN_NP")}</label>
                      <input
                        type="text"
                        name="sotien"
                        value={stateFormProduct.sotien}
                        onChange={onChangeAddProductForm}
                      ></input>
                      <label htmlFor="Role">{i18n.t("XUATSU_X")}</label>
                      <input
                        type="text"
                        name="diachi"
                        value={stateFormProduct.diachi}
                        onChange={onChangeAddProductForm}
                      ></input>

                      <label htmlFor="picture">{i18n.t("HINHANH_P")}</label>
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
                      >
                        {i18n.t("BTN_XACNHAN")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Box display="flex" justifyContent="end" mt="80px">
              {isloading ? (
                <ReactLoading
                  type={"balls"}
                  color={"#f5ffff"}
                  height={75}
                  width={75}
                />
              ) : (
                <Button type="submit" color="secondary" onClick={showAlert}>
                  {i18n.t("BTN_GUIYEUCAU")}
                </Button>
              )}
            </Box>
          </form>
        )}
      </Formik>
      <div>
        <h3>
          {i18n.t("TITLEKHO")} - {converToName[statechinhanh]}
        </h3>
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
          <button onClick={handleGetSelectedData}>Get Selected Data</button>

          <DataGrid
            checkboxSelection
            editMode="row"
            selectionModel={selectionModel}
            onSelectionModelChange={handleSelectionModelChange}
            rows={stateProductfetch}
            columns={Columns}
            pageSize={10}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </div>
      {stateCheckAccess ? (
        <div style={{ marginTop: "3%" }}>
          <div style={{ marginLeft: "0%" }} className="container">
            <h3>{i18n.t("ALERT_PHIEUNHAP")}</h3>

            <select onChange={handle_changechinhanhnhan} id="chinhanh">
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
            <div style={{ marginLeft: "0%" }} className="container">
              <button
                disabled={selectionModelPhieu.length !== 1}
                className="btn btn-info"
                onClick={acceptPhieu}
              >
                Xác nhận
              </button>
            </div>
            <DataGrid
              editMode="row"
              checkboxSelection
              selectionModel={selectionModelPhieu}
              onSelectionModelChange={handleSelectionModelChangePhieu}
              components={{
                Toolbar: GridToolbar,
              }}
              pageSize={10}
              rows={statePhieuStore}
              columns={columnphieustore}
            />
          </Box>
        </div>
      ) : (
        ""
      )}
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default Form;
