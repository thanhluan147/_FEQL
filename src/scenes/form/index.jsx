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
import { useState, useEffect } from "react";
import { Get_all_store_By_userid } from "../contacts/handlestore";
import { createPhieu } from "./handleform";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS
import ReactLoading from "react-loading";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
const Form = () => {
  useTranslation();
  const [stateimage, setStateimg] = useState("");
  const [stateProduct, setStateProduct] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  let chinhanhdau = "";
  const [statesotienbandau, setsotienbandau] = useState(0);
  const [statechinhanhdau, setchinhanhdau] = useState("");
  const [isshowError, setisshowError] = useState(false);
  const [isshowErrorTable, setisshowErrorTable] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [stateFormProduct, setStateFormProduct] = useState({
    id: "",
    name: "",
    picture: "",
    loai: "",
    soluong: 0,
    status: "GOOD",
    StoreID: "",
    sotien: 0,
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
  });
  const onhandlechangePhieu = (event) => {
    setisshowError(false);
    setisshowErrorTable(false);
    setStatePhieu({
      ...statePhieu,
      [event.target.name]: event.target.value,
    });
  };
  const showAlert = async () => {
    try {
      if (!statePhieu.loaiphieu) {
        setisshowError(true);

        return;
      } else {
        setisshowError(false);
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
          statePhieu.loaiphieu === "N"
            ? `${i18n.t("ALERT_PHIEUNHAP")}`
            : `${i18n.t("ALERT_PHIEUXUAT")}`
        } ${i18n.t("ALERT_CHU")}`,
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              setisloading(true);
              const createphieu = {
                status: "PENDING",
                userID: localStorage.getItem("id"),
                loaiphieu: statePhieu.loaiphieu,
                sotien: "0",
                StoreID: statechinhanhdau,
                arrayProduct: stateProduct,
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
                  loaiphieu: "",
                });
                setStateFormProduct({
                  id: "",
                  name: "",
                  picture: "",
                  loai: "",
                  soluong: 0,
                  status: "GOOD",
                  StoreID: "",
                  sotien: 0,
                  behavior: "ADMIN ADD",
                });
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
      setchinhanhdau(chinhanhdau);
    } else {
      // Nếu không phải là promise, cập nhật state ngay lập tức

      chinhanhdau = JSON.parse(objBranch)[0].id;
      setchinhanhdau(chinhanhdau);
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
    const { name, loai, soluong, sotien } = stateFormProduct;
    const errors = {};

    if (!name) {
      errors.name = `${i18n.t("ERROR_NAME")}`;
    }

    if (!loai) {
      errors.loai = `${i18n.t("ERROR_LOAI")}`;
    }

    if (!soluong) {
      errors.soluong = `${i18n.t("ERROR_SOLUONG")}`;
    }

    setStateFormProduct({
      id: "",
      name: "",
      picture: "",
      loai: "",
      soluong: "",
      status: "GOOD",
      StoreID: "",
      sotien: 0,
      behavior: "ADMIN ADD",
    });
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
  const fetchingapi = async () => {
    await fetchingStore();
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
    <Box m="20px">
      <Header title={i18n.t("TITLENHAP")} />

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
              <TextField
                variant="filled"
                disabled
                type="number"
                label={i18n.t("TONGSOTIEN_NHAP")}
                name="sotien"
                value={statePhieu.sotien}
                onChange={onhandlechangePhieu}
                sx={{ gridColumn: "span 2" }}
              />
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
                  <MenuItem value={"N"}>{i18n.t("LABLE_NHAP")}</MenuItem>
                  Create a New User Profile{" "}
                </Select>
                {isshowError ? (
                  <span style={{ color: "red" }}>
                    *Vui lòng chọn loại phiếu
                  </span>
                ) : (
                  ""
                )}
              </FormControl>
            </Box>
            <div className="table-container">
              {isshowErrorTable ? (
                <span style={{ color: "red" }}>
                  *chưa có dử liệu, không thể gửi
                </span>
              ) : (
                ""
              )}
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>{i18n.t("TEN_P")}</th>
                    <th>{i18n.t("Loại")}</th>
                    <th>{i18n.t("SOLUONG_P")}</th>

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
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
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
