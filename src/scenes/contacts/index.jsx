import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Get_all_store_By_userid, Get_all_Store } from "./handlestore";

import { Get_all_Product_By_StoreID, createProduct } from "./handleproduct";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { Columns } from "./data";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { DeleteProduct, EditProduct } from "./handleproduct";
import React from "react";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
const Contacts = () => {
  useTranslation();
  const [stateStore, setStateStore] = useState([]);
  const [stateProduct, setStateProduct] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [stateimage, setStateimg] = useState("");
  const [stateFormProduct, setStateFormProduct] = useState({
    id: "",
    name: "",
    picture: "",
    loai: "",
    soluong: 0,
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
      StoreID: statechinhanh,
      behavior: "SELF ADD",
      id: "POR" + lenghtState,
    });
  };

  const convertoBase64 = (e) => {
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setStateFormProduct({
        ...stateFormProduct,

        picture: render.result,
      });
      setEditProductForm({
        ...EditProductForm,
        picture: render.result,
      });
      setStateimg(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let checkaccess = false;
  let chinhanhdau = "";

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
  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    await fetchingGettAllProduct_by_storeID(chinhanhdau);
    setStatechinhanh(chinhanhdau);
  };
  const handle_getAllProduct = async (e) => {
    await fetchingGettAllProduct_by_storeID(e.target.value);
    setStatechinhanh(e.target.value);
  };
  const addproduct = async () => {
    const check = await createProduct(stateFormProduct);

    await fetchingGettAllProduct_by_storeID(statechinhanh);
    if (JSON.parse(check).success || JSON.parse(check).success === "true") {
      alert(`${i18n.t("ALERT_THEMSANPHAM_P")}`);
    }
    setStateFormProduct({
      id: "",
      name: "",
      picture: "",
      loai: "",
      soluong: 0,
      status: "",
      StoreID: "",
      xuatxu: "",
      behavior: "SELF ADD",
    });

    setStateimg("");
  };

  const handleSaveClick = async () => {
    const selectedRows = stateProduct.filter((row) =>
      selectionModel.includes(row.id)
    );
    await DeleteProduct(selectedRows);
    fetchingGettAllProduct_by_storeID(statechinhanh);

    // Thực hiện xử lý theo nhu cầu của bạn
  };
  const handleEdit = () => {
    const selectedRows = stateProduct.filter((row) =>
      selectionModel.includes(row.id)
    );

    fetchingGettAllProduct_by_storeID(statechinhanh);

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
    });

    setStateimg(selectedRows[0].picture);
    // Thực hiện xử lý theo nhu cầu của bạn
  };
  const onChangeEditProductForm = (event) => {
    setEditProductForm({
      ...EditProductForm,
      [event.target.name]: event.target.value,
    });
  };
  const editproduct = async () => {
    await EditProduct(EditProductForm);
    await fetchingGettAllProduct_by_storeID(statechinhanh);
  };
  useEffect(() => {
    fetchingapi();
  }, []);

  return (
    <Box m="20px">
      <Header title={i18n.t("TITLEKHO")} subtitle={i18n.t("DESKHO")} />
      <div style={{ width: "100%", display: "flex" }}>
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#staticBackdrop"
        >
          {i18n.t("THEMSP_P")}
        </button>
        <button
          type="button"
          class="btn btn-primary"
          style={{ marginLeft: "1%" }}
          onClick={handleSaveClick}
        >
          {i18n.t("XOASP_P")}
        </button>
        <button
          type="button"
          style={{ marginLeft: "1%" }}
          class="btn btn-primary"
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
                  Điều chỉnh thông tin nhân viên
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
                <label htmlFor="Role">{i18n.t("SOLUONG_P")}</label>
                <input
                  type="number"
                  value={EditProductForm.soluong}
                  onChange={onChangeEditProductForm}
                  name="soluong"
                ></input>
                <label htmlFor="Role">{i18n.t("TINHTRANG_P")}</label>
                <input
                  type="text"
                  value={EditProductForm.status}
                  onChange={onChangeEditProductForm}
                  name="status"
                ></input>

                <label htmlFor="xuatxu">Xuất xứ</label>
                <input
                  type="text"
                  name="xuatxu"
                  value={EditProductForm.xuatxu}
                  onChange={onChangeEditProductForm}
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
                <label htmlFor="xuatxu">Xuất xứ</label>
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
        <DataGrid
          checkboxSelection
          editMode="row"
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          rows={stateProduct}
          columns={Columns}
          pageSize={10}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
