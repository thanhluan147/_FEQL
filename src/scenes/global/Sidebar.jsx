import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import HandleAccessAccount from "../handleAccess/handleAccess";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { useNavigate } from "react-router-dom";
import InputIcon from "@mui/icons-material/Input";
import OutputIcon from "@mui/icons-material/Output";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  let checkaccess = false;
  let nav = useNavigate();
  const [check, setcheck] = useState(false);
  useTranslation();
  const [open, setOpen] = useState(true);
  const [openInfo, setOpenInfo] = useState(true);
  const [openpage, setOpenpage] = useState(true);
  const [openchart, setOpenchart] = useState(true);
  const [openchitieu, setOpenchitieu] = useState(true);
  const checkAccess = async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }

    setcheck(checkaccess);
  };

  const fetchingapi = async () => {
    await checkAccess();
  };
  useEffect(() => {
    fetchingapi();
  }, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <>
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    ADMINIS
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`../../assets/Logo.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    ADMIN
                  </Typography>
                  <Typography
                    icon={<LogoutIcon></LogoutIcon>}
                    variant="h5"
                    color={colors.greenAccent[500]}
                    onClick={logout}
                    style={{ cursor: "pointer" }}
                  >
                    <LogoutIcon></LogoutIcon> LOG OUT
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              style={{ display: "grid" }}
              paddingLeft={isCollapsed ? undefined : "10%"}
            >
              <Item
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                onClick={() => setOpenInfo(!openInfo)}
                aria-controls="example-collapse-Info  dropdown-toggle"
                aria-expanded={openInfo}
                aria-haspopup="true"
                style={{ backgroundColor: "#1f2a40", marginRight: "13%" }}
              >
                {i18n.t("TT")} <span class="caret"></span>
              </button>
              <Collapse in={openInfo}>
                <div id="example-collapse-Info">
                  <Item
                    title={i18n.t("QLNV")}
                    to="/team"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />

                  {check ? (
                    <Item
                      title={i18n.t("QLCNHANH")}
                      to="/branch"
                      icon={<StorefrontIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </Collapse>

              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text  dropdown-toggle"
                aria-expanded={open}
                aria-haspopup="true"
                style={{ backgroundColor: "#1f2a40", marginRight: "13%" }}
              >
                {i18n.t("BDTK")} <span class="caret"></span>
              </button>
              <Collapse in={open}>
                <div id="example-collapse-text">
                  <Item
                    title={i18n.t("QLK")}
                    to="/contacts"
                    icon={<StorefrontIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title={i18n.t("QLNK")}
                    to="/invoices"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  {check ? (
                    <Item
                      title={i18n.t("QLXK")}
                      to="/xuatkho"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </Collapse>

              {check ? (
                <>
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    onClick={() => setOpenchitieu(!openchitieu)}
                    aria-controls="example-collapse-text  dropdown-toggle"
                    aria-expanded={openchitieu}
                    aria-haspopup="true"
                    style={{ backgroundColor: "#1f2a40", marginRight: "13%" }}
                  >
                    {i18n.t("DT")} <span class="caret"></span>
                  </button>
                  <Collapse in={openchitieu}>
                    <div id="example-collapse-text">
                      <Item
                        title={i18n.t("QLHD")}
                        to="/bills"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />

                      <Item
                        title={i18n.t("QLDT")}
                        to="/doanhthu"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />

                      <Item
                        title={i18n.t("QLCN")}
                        to="/debtors"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </Collapse>
                </>
              ) : (
                ""
              )}

              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                onClick={() => setOpenpage(!openpage)}
                aria-controls="example-collapse-text-page  dropdown-toggle"
                aria-expanded={openpage}
                style={{
                  marginTop: "5%",
                  backgroundColor: "#1f2a40",
                  marginRight: "13%",
                }}
                aria-haspopup="true"
              >
                {i18n.t("HV")} <span class="caret"></span>
              </button>
              <Collapse in={openpage}>
                <div id="example-collapse-text-page">
                  <Item
                    title={i18n.t("NK")}
                    to="/form"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />

                  <Item
                    title={i18n.t("XK")}
                    to="/orders"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />

                  {/* <Item
                    title="Calendar"
                    to="/calendar"
                    icon={<CalendarTodayOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  /> */}
                </div>
              </Collapse>

              {/* <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              onClick={() => setOpenchart(!openchart)}
              aria-controls="example-collapse-text-chart  dropdown-toggle"
              aria-expanded={open}
              aria-haspopup="true"
              style={{
                marginTop: "5%",
                backgroundColor: "#1f2a40",
                marginRight: "13%",
              }}
            >
              Charts <span class="caret"></span>
            </button>
            <Collapse in={openchart}>
              <div id="example-collapse-text-chart">
                <Item
                  title="Bar Chart"
                  to="/bar"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Pie Chart"
                  to="/pie"
                  icon={<PieChartOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Line Chart"
                  to="/line"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Geography Chart"
                  to="/geography"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            </Collapse> */}
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </>
  );
};

export default Sidebar;
