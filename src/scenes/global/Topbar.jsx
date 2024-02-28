import { Box, Button, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import Temp from "../../components/Temp";
import { useEffect, useState } from "react";
import "./style.css";
import i18n from "../../i18n/i18n";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { Get_all_Phieu_Store_By_Status } from "../invoices/handlePhieustore";
const Topbar = () => {
  useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [statePhieustore, setStatePhieustore] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [stateaccess, setstateaccess] = useState(false);
  let checkaccess = false;
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
    console.log("check access " + checkaccess);
    setstateaccess(checkaccess);
  };
  const handleDropdownClick = () => {
    // Đóng dropdown bằng cách cập nhật trạng thái
    console.log("đang là " + isDropdownOpen);
    setDropdownOpen(false);
  };
  const CoppyText = (x) => {
    // Lựa chọn và sao chép nội dung của thẻ div
    // Copy the text inside the text field
    navigator.clipboard.writeText(x);
  };
  const changedate = (params) => {
    const arrayObject = params;
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
    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedDateString;
  };
  const GET_ALL_PHIEU_STORE = async () => {
    const getP = await Get_all_Phieu_Store_By_Status("PENDING");
    setStatePhieustore(getP);
  };
  const fetchingapi = async () => {
    await checkAccess();
    await GET_ALL_PHIEU_STORE();
  };
  const Refreshphieu = async () => {
    await GET_ALL_PHIEU_STORE();
  };

  useEffect(() => {
    fetchingapi();
  }, []);
  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box>
          <Temp></Temp>
        </Box>
        {/* ICONS */}

        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          {stateaccess ? (
            <>
              {" "}
              <div
                style={{ paddingTop: "7px" }}
                className={`dropdown ${isDropdownOpen ? "show" : ""}`}
              >
                {statePhieustore.length > 0 ? (
                  <>
                    {" "}
                    <NotificationImportantIcon
                      data-toggle="dropdown"
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => setDropdownOpen(!isDropdownOpen)}
                    />
                  </>
                ) : (
                  <NotificationsOutlinedIcon
                    data-toggle="dropdown"
                    style={{ cursor: "pointer" }}
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                  ></NotificationsOutlinedIcon>
                )}
                <div class="dropdown-menu cssleft">
                  <a class="dropdown-item">
                    {i18n.t("NGAYLAP_PX")} - {i18n.t("TINHTRANG_PX")} -{" "}
                    {i18n.t("MAPN_PX")}
                  </a>
                  <hr></hr>
                  {statePhieustore
                    ? statePhieustore.map((object, index) => (
                        <a
                          onClick={() => {
                            CoppyText(object.id);
                          }}
                          id="liveToastBtn"
                          style={{ cursor: "pointer" }}
                          class="dropdown-item"
                        >
                          <span>{object.id}</span>
                          {" |  "}
                          <span
                            style={{
                              backgroundColor: "orange",
                              borderRadius: "3px",
                              fontSize: ".9rem",
                            }}
                          >
                            {object.status}
                          </span>
                          {"  | "} {changedate(object.createDate)}
                        </a>
                      ))
                    : ""}
                  <hr></hr>
                  <Button onClick={Refreshphieu}>Refresh</Button>
                </div>
              </div>
            </>
          ) : (
            <IconButton>
              <NotificationsOutlinedIcon></NotificationsOutlinedIcon>
            </IconButton>
          )}

          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
      <div
        class="position-fixed bottom-0 right-0 p-3"
        style={{ zIndex: 5, right: 0, bottom: 0 }}
      >
        <div
          id="liveToast"
          class="toast hide"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-delay="2000"
        >
          <div class="toast-header">
            <strong class="mr-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            <button
              type="button"
              class="ml-2 mb-1 close"
              data-dismiss="toast"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="toast-body">Hello, world! This is a toast message.</div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
