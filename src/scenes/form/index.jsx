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
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import "./style.css";
import { useState, useEffect } from "react";
import { Get_all_store_By_userid } from "../contacts/handlestore";
import { createPhieu } from "./handleform";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS
import ReactLoading from "react-loading";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { Get_all_Phieu_Store_By_StoreID } from "../invoices/handlePhieustore";
import { CreateIdMaxValueOfarray } from "../method";
import { Get_all_Product_By_StoreID } from "./handleproduct";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { DataGrid, GridToolbar, GridToolbarExport } from "@mui/x-data-grid";
const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useTranslation();
  const [stateID, setstateID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [stateCheckaccess, setstateCheckaccess] = useState(false);
  const [stateupdatesoluong, setstateupdatesoluong] = useState({
    usoluong: 0,
  });
  const formatDate = (event) => {
    // Kiểm tra định dạng
    // if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
    //   console.log("input inputDate: " + inputDate);
    //   setErrorMessage("Invalid date format. Please use YYYY-MM-DD.");
    // }

    setErrorMessage(false);
    setStatePhieu({
      ...statePhieu,
      [event.target.name]: event.target.value,
    });
  };
  const handleSelectionModelChange = (newSelectionModel) => {
    const hasAcceptedOrCancelled = newSelectionModel.some((selectedId) => {
      const selectedRow = stateProductview.find((row) => row.id === selectedId);
      return (
        selectedRow && selectedRow.soluong === 0
        //Loại phiếu trigger nhập từ kho
        // ||
        //   selectedRow.loaiphieu === "NK"
      );
    });
    if (hasAcceptedOrCancelled) {
      // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
      alert("Sản phẩm này đã hết !!");
      return;
    }
    setSelectionModel(newSelectionModel);
  };
  const Columnsv = [
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
        loading="lazy"
        width={100}
        height={50}
        style={{ cursor: "pointer" }}
      />
    );
  }

  const fetchingGettAllPhieu_by_StoreID = async (x) => {
    const check = await Get_all_Phieu_Store_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      const checkIDMAX = CreateIdMaxValueOfarray(
        "PN",
        JSON.parse(resolvedResult),
        code
      );
      setstateID(checkIDMAX);
    } else {
      const checkIDMAX = CreateIdMaxValueOfarray("PN", JSON.parse(check), code);

      setstateID(checkIDMAX);
    }
  };
  const fetchingGettAllProduct_by_storeID = async (x) => {
    const check = await Get_all_Product_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateProductview(JSON.parse(resolvedResult));
    } else {
      setStateProductview(JSON.parse(check));
    }
  };
  const handleBlurdate = () => {
    const currentDate = new Date();

    // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = currentDate.getDate().toString().padStart(2, "0");

    if (
      parseFloat(statePhieu.thoidiem.split("-")[0]) < parseFloat(year) ||
      parseFloat(statePhieu.thoidiem.split("-")[0]) > parseFloat(year)
    ) {
      // console.log("năm đã nhỏ hơn");
      setisShowerrorDate(true);
      return;
    }
    // console.log("chheck month " + statePhieu.thoidiem.split("-")[1]);
    // console.log("month ht " + parseFloat(month));
    if (parseFloat(statePhieu.thoidiem.split("-")[1]) > parseFloat(month)) {
      // console.log("tháng đã lớn hơn hơn");
      setisShowerrorDate(true);
      return;
    } else {
      if (parseFloat(statePhieu.thoidiem.split("-")[2]) > parseFloat(day)) {
        // console.log("ngày đã lớn hơn");
        setisShowerrorDate(true);
        return;
      }
    }

    // Kiểm tra lỗi khi mất focus (kết thúc nhập)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(statePhieu.thoidiem)) {
      setisShowerrorDate(true);
    } else {
      setisShowerrorDate(false);
    }
  };
  const [stateimage, setStateimg] = useState("");
  const [stateProduct, setStateProduct] = useState([]);
  const [stateProductview, setStateProductview] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  let chinhanhdau = "";
  let code = "";
  const [stateCode, setstateCode] = useState("");
  const [statesotienbandau, setsotienbandau] = useState(0);
  const [statechinhanhdau, setchinhanhdau] = useState("");
  const [isshowError, setisshowError] = useState(false);
  const [isshowErrorTable, setisshowErrorTable] = useState(false);
  const [isShowerrorDate, setisShowerrorDate] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [stateFormProduct, setStateFormProduct] = useState({
    id: "",
    name: "",
    picture: "...",
    loai: "",
    soluong: 0,
    status: "GOOD",
    StoreID: "",
    sotien: 0,
    xuatxu: "",
    behavior: "ADMIN ADD",
  });
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    loai: "",
    soluong: "",

    picture: "",
  });
  const [statePhieu, setStatePhieu] = useState({
    sotien: 0,
    loaiphieu: "",
    thoidiem: "",
  });
  const onhandlechangePhieu = (event) => {
    setisshowError(false);
    setisshowErrorTable(false);
    setisShowerrorDate(false);
    if (event.target.name === "loaiphieu") {
      setsotienbandau(0);
      setStatePhieu({
        ...statePhieu,
        sotien: 0,
        [event.target.name]: event.target.value,
      });
      setStateProduct([]);
    } else {
      setStatePhieu({
        ...statePhieu,
        [event.target.name]: event.target.value,
      });
    }
  };
  const onchangeupdatesoluong = (event) => {
    setstateupdatesoluong({
      ...stateupdatesoluong,
      [event.target.name]: event.target.value,
    });
  };
  const handleEditProduct = (productId) => {
    const checksoluongrow = stateProduct.filter(
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
  const showAlert = async () => {
    try {
      if (!statePhieu.loaiphieu) {
        setisshowError(true);

        return;
      } else {
        setisshowError(false);
      }

      if (!statePhieu.thoidiem) {
        setisShowerrorDate(true);
        return;
      }

      if (isShowerrorDate) {
        return;
      }
      if (stateProduct.length === 0 || stateProduct == []) {
        setisshowErrorTable(true);
        return;
      } else {
        setisshowErrorTable(false);
      }

      confirmAlert({
        title: `${i18n.t("ALERT_TITLE")}`,
        message: `${i18n.t("ALERT_DES")} ${
          statePhieu.loaiphieu === "NK" || statePhieu.loaiphieu === "NN"
            ? `${i18n.t("ALERT_PHIEUNHAP")}`
            : `${i18n.t("ALERT_PHIEUXUAT")}`
        } ${i18n.t("ALERT_CHU")}`,
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              setisloading(true);
              const createphieu = {
                id: stateID,
                status: "PENDING",
                userID: localStorage.getItem("id"),
                loaiphieu: statePhieu.loaiphieu,
                sotien: statePhieu.sotien,
                StoreID: statechinhanhdau,
                arrayProduct: stateProduct,
                ngaylap: statePhieu.thoidiem,
                updateDate: "...",
              };

              const check = await createPhieu(createphieu);

              if (
                JSON.parse(check).success ||
                JSON.parse(check).success === "true"
              ) {
                alert(`${i18n.t("ALERT_GUIYEUCAUSUCCESS")}`);
                setisloading(false);
                setStatePhieu({
                  sotien: 0,
                  thoidiem: "",
                  loaiphieu: "",
                });
                setsotienbandau(0);
                // setStateFormProduct({
                //   id: "",
                //   name: "",
                //   picture: "",
                //   loai: "",
                //   soluong: 0,
                //   status: "GOOD",
                //   StoreID: "",
                //   sotien: 0,
                //   behavior: "ADMIN ADD",
                // });
                setStateProduct([]);
              }
            },
          },
          {
            label: "No",
            onClick: () => alert("You clicked No!"),
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchingStore = async () => {
    const objBranch = Get_all_store_By_userid();

    if (objBranch instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await objBranch;

      chinhanhdau = JSON.parse(resolvedResult)[0].id;
      code = JSON.parse(resolvedResult)[0].code;

      setchinhanhdau(chinhanhdau);
      setstateCode(code);
    } else {
      // Nếu không phải là promise, cập nhật state ngay lập tức

      chinhanhdau = JSON.parse(objBranch)[0].id;
      code = JSON.parse(objBranch)[0].code;

      setchinhanhdau(chinhanhdau);
      setstateCode(code);
    }
  };

  const onChangeAddProductForm = (event) => {
    // Tách phần số từ chuỗi 'id' và chuyển đổi thành số nguyên
    const arrayOfNumbers = stateProduct.map((obj) =>
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
    let temp = stateimage;

    setStateFormProduct({
      ...stateFormProduct,
      [event.target.name]: event.target.value,
      picture: temp,

      StoreID: statechinhanhdau,
      id: "POR" + lenghtState,
    });
    setErrorMessages({
      name: "",
      loai: "",
      soluong: "",

      picture: "",
    });
  };
  const addproduct = async () => {
    const { name, loai, soluong, picture } = stateFormProduct;
    const errors = {};

    if (!name) {
      errors.name = `${i18n.t("ERROR_NAME")}`;
    }
    if (!picture) {
      errors.picture = `*Vui lòng chọn ảnh`;
    }

    if (!loai) {
      errors.loai = `${i18n.t("ERROR_LOAI")}`;
    }

    if (!soluong) {
      errors.soluong = `${i18n.t("ERROR_SOLUONG")}`;
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
    const updatedItem = {
      ...stateFormProduct,
      checkStore: true,
    };
    arry.push(updatedItem);

    setStateProduct(stateProduct.concat(arry));
    setStateFormProduct({
      id: "",
      name: "",
      picture: "...",
      loai: "",
      soluong: "",
      status: "GOOD",
      StoreID: "",
      sotien: 0,
      xuatxu: "",
      behavior: "ADMIN ADD",
    });
  };
  const handleFormSubmit = (values) => {
    console.log(values);
  };
  const handleGetSelectedData = () => {
    const selectedData = selectionModel.map((selectedId) => {
      return stateProductview.find((row) => row.id === selectedId);
    });
    // Đồng thời thay đổi giá trị sotien thành 0 trong selectedData
    const updatedSelectedData = selectedData.map((selectedItem) => {
      // Kiểm tra xem có selectedItem không trả về undefined
      if (selectedItem) {
        // Tạo một bản sao của đối tượng để không ảnh hưởng đến stateProductfetch
        const updatedItem = {
          ...selectedItem,
          behavior: "ADMIN ADD",
          checkStore: stateCheckaccess,
        };
        return updatedItem;
      }
      return selectedItem; // Trả về nguyên bản nếu không tìm thấy đối tượng
    });
    let sotiennew = statePhieu.sotien;

    updatedSelectedData.forEach((element) => {
      sotiennew = sotiennew + element.sotien;
    });
    setStatePhieu({
      ...statePhieu,
      sotien: parseFloat(statesotienbandau) + parseFloat(sotiennew),
    });
    setsotienbandau(parseFloat(statesotienbandau) + parseFloat(sotiennew));

    setStateProduct(updatedSelectedData);
    setSelectionModel([]);
    // selectedData là mảng chứa dữ liệu của các hàng được chọn
  };
  const convertoBase64 = (e) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (!file) {
      setErrorMessages((prev) => ({
        ...prev,
        picture: `${i18n.t("ERROR_HINH")}`,
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
  const checkAccess = async () => {
    try {
      const check = await HandleAccessAccount();
      if (check instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await check;

        setstateCheckaccess(resolvedResult);
        console.log("check " + resolvedResult);
      } else {
        setstateCheckaccess(check);

        console.log("check c " + check);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();

    await fetchingGettAllPhieu_by_StoreID(chinhanhdau);
    await fetchingGettAllProduct_by_storeID("ST00");
  };
  useEffect(() => {
    fetchingapi();
  }, [stateProduct]);

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
    // Cập nhật stateProduct
    setStateProduct(updatedState);
  };
  return (
    <>
      <Box m="20px">
        <Header title={i18n.t("TITLENHAP")} />

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, date, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  variant="filled"
                  disabled
                  type="text"
                  label={i18n.t("TONGSOTIEN_NHAP")}
                  name="sotien"
                  value={stateCheckaccess ? statePhieu.sotien : "#####"}
                  onChange={onhandlechangePhieu}
                  sx={{ gridColumn: "span 2" }}
                />

                <FormControl>
                  <TextField
                    variant="filled"
                    type="text"
                    label={i18n.t("THOIDIEMLAP")}
                    placeholder="yyyy-mm-dd"
                    name="thoidiem"
                    value={statePhieu.thoidiem}
                    onChange={formatDate}
                    onBlur={handleBlurdate}
                    // onChange={onhandlechangePhieu}
                    sx={{ gridColumn: "span 1" }}
                  />
                  {isShowerrorDate ? (
                    <span style={{ color: "red" }}>
                      {i18n.t("ERROR_DATEFORM")}
                    </span>
                  ) : (
                    ""
                  )}
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
                    <MenuItem value={"NK"}>Nhập từ kho</MenuItem>
                    <MenuItem value={"NN"}>Nhập ngoài kho</MenuItem>
                    Create a New User Profile{" "}
                  </Select>
                  {isshowError ? (
                    <span style={{ color: "red" }}>
                      {i18n.t("ERROR_PHIEU")}
                    </span>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Box>
              <div className="table-container">
                <label htmlFor="usoluong">*{i18n.t("SLDC")}</label>
                <br></br>
                <input
                  placeholder="Số lượng"
                  onChange={onchangeupdatesoluong}
                  value={stateupdatesoluong.usoluong}
                  name="usoluong"
                  type="number"
                ></input>
                {isshowErrorTable ? (
                  <span style={{ color: "red" }}>{i18n.t("ERROR_DULIEU")}</span>
                ) : (
                  ""
                )}

                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>{i18n.t("TEN_P")}</th>
                      <th>{i18n.t("LOAI_P")}</th>
                      <th>{i18n.t("SOLUONG_P")}</th>
                      <th>{i18n.t("SOTIEN_NP")}</th>
                      <th>{i18n.t("XUATSU_X")}</th>
                      <th>{i18n.t("HINHANH_P")}</th>

                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stateProduct.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.loai}</td>
                        <td>{item.soluong}</td>
                        <td>
                          {item.checkStore && item.checkStore
                            ? item.sotien
                            : "###"}
                        </td>
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
                            Xóa
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
                </table>
                {statePhieu.loaiphieu && statePhieu.loaiphieu === "NN" ? (
                  <div
                    className="add-button"
                    data-toggle="modal"
                    data-target="#staticBackdrop"
                    onClick={() => {
                      setisshowError(false);
                    }}
                    type="button"
                  >
                    +
                  </div>
                ) : (
                  ""
                )}

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
                        {Object.keys(errorMessages).map((key) => (
                          <p key={key} style={{ color: "red" }}>
                            {errorMessages[key]}
                          </p>
                        ))}
                        <label htmlFor="name">{i18n.t("TEN_P")}</label>
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
                          type="number"
                          name="soluong"
                          value={stateFormProduct.soluong}
                          onChange={onChangeAddProductForm}
                        ></input>
                        <label htmlFor="Role">{i18n.t("SOTIEN_NP")}</label>
                        <input
                          type="number"
                          name="sotien"
                          value={stateFormProduct.sotien}
                          onChange={onChangeAddProductForm}
                        ></input>
                        <label htmlFor="xuatxu">{i18n.t("XUATSU_X")}</label>
                        <input
                          type="text"
                          name="xuatxu"
                          value={stateFormProduct.xuatxu}
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
      </Box>
      {statePhieu.loaiphieu && statePhieu.loaiphieu === "NK" ? (
        <div style={{ padding: "20px" }}>
          <h3>{i18n.t("TKCT")}</h3>
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
              components={{
                Toolbar: GridToolbar,
              }}
              selectionModel={selectionModel}
              onSelectionModelChange={handleSelectionModelChange}
              rows={stateProductview}
              columns={Columnsv}
              pageSize={10}
              // components={{
              //   Toolbar: () => (
              //     <GridToolbar>
              //       <GridToolbarExport onClick={exportToExcel} />
              //     </GridToolbar>
              //   ),
              // }}
            />
          </Box>
        </div>
      ) : (
        ""
      )}
    </>
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
