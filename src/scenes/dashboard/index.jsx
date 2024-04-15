import {
  Box,
  Button,
  IconButton,
  Textarea,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChatIcon from "@mui/icons-material/Chat";
import Header from "../../components/Header";
import SendIcon from "@mui/icons-material/Send";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import "./style.css";
import ProgressCircle from "../../components/ProgressCircle";
import { GET_ALLDEBTOR_CONNO } from "../debtor/handleDebtor";
import { useEffect, useState, useRef } from "react";
import React from "react";
import HandleAccessAccount from "../handleAccess/handleAccess";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Get_all_Store } from "../contacts/handlestore";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { GET_ALL_DOANHTHU_By_storeID_date } from "../debtor/handledoanhthu";
import { Get_all_COST_Phieu_Store_By_Year_Month } from "../invoices/handlePhieustore";
import io from "socket.io-client";
import { GET_Notifi_BY_ID, Update_Notifi_By_id } from "./handlenotifi";
import Url_realtime from "../../URL_REALTIME";
import { converToName } from "../method";
import { GET_ALLDEBTOR_BY_Debtor_Year_month } from "../debtor/handleDebtor";

var socket = io(`${Url_realtime}`, {
  transports: ["websocket", "polling", "flashsocket"],
});

const Dashboard = () => {
  useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [stateDebtor, setStateDebtor] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stateStore, setStateStore] = useState([]);
  const [stateDoanhthu, setstateDoanhthu] = useState([]);
  const [statetongdoanhthu, setstatetongdoanhthu] = useState(0);
  const [statetCostBuy, setstateCostBuy] = useState(0);
  const [statetCostBuyThucTe, setstateCostBuyThucTe] = useState(0);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isOpenChat, setIsOpenchat] = useState(false);
  const [stateCheckaccess, setstateCheckaccess] = useState(false);
  const [min, setmin] = useState(0);
  const [max, setmax] = useState(0);
  const [statesotienBAN, setstatesotienBAN] = useState(0);
  const textAreaRef = useRef();
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = async () => {
    if (inputValue) {
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
      const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} : `;

      const newContent = textAreaValue + "\n" + datetimeString + inputValue;

      setTextAreaValue(newContent);

      socket.emit("changeContent", newContent);
      // Chuyển đổi ký tự xuống dòng thành thẻ <br>
      const updatenewcontent = datetimeString + inputValue;
      await Update_Notifi_By_id(updatenewcontent);
      setInputValue("");
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
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
  const handleIncrease = async () => {
    setmin(0);
    setmax(0);
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate.getMonth() === 0) {
      newDate.setFullYear(newDate.getFullYear());
    }
    setCurrentDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${getMonthNameInVietnamese(
      newDate.getMonth()
    )}`;
    await fetchingdoanhthu(statechinhanh, formattedDate);
    await fetchingCost(statechinhanh, formattedDate);
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
  };
  const fetchingGetAllDEBTOR_by_STOREID_year_month = async (x, y) => {
    const req = {
      storeID: x,
      thoidiem: y,
    };

    const check = await GET_ALLDEBTOR_BY_Debtor_Year_month(req);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateDebtor(JSON.parse(resolvedResult));
    } else {
      setStateDebtor(JSON.parse(check));
    }
  };
  const fetchingdoanhthu = async (storeID, thoidiem) => {
    {
      const fetch = {
        storeID: storeID,
        thoidiem: thoidiem,
      };
      const objBranch = await GET_ALL_DOANHTHU_By_storeID_date(fetch);

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        let sumallSotienNhapKho = 0;
        setstateDoanhthu(JSON.parse(resolvedResult));
        JSON.parse(resolvedResult).forEach((obj) => {
          sumallSotienNhapKho += parseFloat(obj.sotienThucte);
        });

        setstatesotienBAN(sumallSotienNhapKho);

        let maxValue = 0;
        let minValue = 0;
        JSON.parse(resolvedResult).forEach((obj) => {
          if (obj.sotienThucte > maxValue) {
            maxValue = obj.sotienThucte;
          }
          if (obj.sotienThucte < minValue) {
            minValue = obj.sotienThucte;
          }
        });
        setmin(minValue);
        setmax(maxValue);
        const sumSotien = JSON.parse(resolvedResult).reduce(
          (total, obj) => total + obj.sotien,
          0
        );
        setstatetongdoanhthu(sumSotien);
      } else {
        let sumallSotienNhapKho = 0;
        setstateDoanhthu(JSON.parse(objBranch));
        JSON.parse(objBranch).forEach((obj) => {
          sumallSotienNhapKho += parseFloat(obj.sotienThucte);
        });
        setstatesotienBAN(sumallSotienNhapKho);
        let maxValue = 0;
        let minValue = 0;
        JSON.parse(objBranch).forEach((obj) => {
          if (obj.sotienThucte > maxValue) {
            maxValue = obj.sotienThucte;
          }
          if (obj.sotienThucte < minValue) {
            minValue = obj.sotienThucte;
          }
        });
        setmin(minValue);
        setmax(maxValue);
        const sumSotien = JSON.parse(objBranch).reduce(
          (total, obj) => total + obj.sotien,
          0
        );

        setstatetongdoanhthu(sumSotien);
      }
    }
  };
  const fetchingCost = async (storeID, thoidiem) => {
    {
      const fetch = {
        storeID: storeID,
        thoidiem: thoidiem,
      };
      const objBranch = await Get_all_COST_Phieu_Store_By_Year_Month(fetch);

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        let sumallSotienNhapKho = 0;
        let sumallSotienNhapKhoTT = 0;
        // setstateDoanhthu(JSON.parse(resolvedResult));
        JSON.parse(resolvedResult).forEach((obj) => {
          sumallSotienNhapKho += parseFloat(obj.sotien);
          sumallSotienNhapKhoTT += parseFloat(obj.sotienThucte);
        });

        setstateCostBuy(sumallSotienNhapKho);
        setstateCostBuyThucTe(sumallSotienNhapKhoTT);
      } else {
        let sumallSotienNhapKho = 0;
        let sumallSotienNhapKhoTT = 0;
        // setstateDoanhthu(JSON.parse(resolvedResult));
        JSON.parse(objBranch).forEach((obj) => {
          sumallSotienNhapKho += parseFloat(obj.sotien);
          sumallSotienNhapKhoTT += parseFloat(obj.sotienThucTe);
        });
        setstateCostBuyThucTe(sumallSotienNhapKhoTT);
        setstateCostBuy(sumallSotienNhapKho);
      }
    }
  };
  const fetchingStore = async () => {
    {
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
    }
  };
  const handleDecrease = async () => {
    setmin(0);
    setmax(0);
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);

    if (newDate.getMonth() === 11) {
      newDate.setFullYear(newDate.getFullYear());
    }
    setCurrentDate(newDate);
    const formattedDate = `${newDate.getFullYear()}-${getMonthNameInVietnamese(
      newDate.getMonth()
    )}`;
    await fetchingdoanhthu(statechinhanh, formattedDate);
    await fetchingCost(statechinhanh, formattedDate);
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
      statechinhanh,
      formattedDate
    );
  };

  const formattedDate = `${currentDate.getFullYear()}-${getMonthNameInVietnamese(
    currentDate.getMonth()
  )}`;

  let chinhanhdau = "";
  let checkaccess = false;
  const checkAccess = async () => {
    try {
      const check = await HandleAccessAccount();
      if (check instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await check;

        if (resolvedResult === "true" || resolvedResult) {
          checkaccess = resolvedResult;

          setstateCheckaccess(checkaccess);
        } else {
          checkaccess = resolvedResult;
          setstateCheckaccess(checkaccess);
        }
      } else {
        if (check === "true" || check) {
          checkaccess = true;

          setstateCheckaccess(check);
        } else {
          checkaccess = false;

          setstateCheckaccess(check);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchingDebtor = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = await GET_ALLDEBTOR_CONNO();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;
        setStateDebtor(JSON.parse(resolvedResult));
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức
        setStateDebtor(JSON.parse(objBranch));
      }
    }
  };
  const fetchingnoti = async () => {
    const objBranch = await GET_Notifi_BY_ID();

    if (objBranch instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await objBranch;
      const formattedContent = resolvedResult.replace(/ƒ/g, "\n");

      setTextAreaValue(formattedContent);
    } else {
      // Nếu không phải là promise, cập nhật state ngay lập tức
      const stringc = objBranch;
      const formattedContent = stringc.replace(/ƒ/g, "\n");

      setTextAreaValue(formattedContent);
    }
  };

  const fetchingapi = async () => {
    await checkAccess();
    // await fetchingDebtor();
    await fetchingStore();
    await fetchingnoti();
    await fetchingdoanhthu(chinhanhdau, formattedDate);
    await fetchingCost(chinhanhdau, formattedDate);
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
      chinhanhdau,
      formattedDate
    );
    setStatechinhanh(chinhanhdau);
  };
  const handle_getAllDoanhthu = async (e) => {
    await fetchingdoanhthu(e.target.value, formattedDate);
    await fetchingCost(e.target.value, formattedDate);
    await fetchingGetAllDEBTOR_by_STOREID_year_month(
      e.target.value,
      formattedDate
    );

    setStatechinhanh(e.target.value);
  };
  const findmaxdoanhthu = () => {
    let maxValue = 0;
    let minValue = 0;
    stateDoanhthu.forEach((obj) => {
      if (obj.sotien > maxValue) {
        maxValue = obj.sotien;
      }
      if (obj.sotien < minValue) {
        minValue = obj.sotien;
      }
    });
  };
  useEffect(() => {
    fetchingapi();
    // Lắng nghe sự kiện khi có sự thay đổi nội dung từ server
    socket.on("updateContent", (newContent) => {
      setTextAreaValue(newContent);
    });

    return () => {
      // Đảm bảo rằng khi component bị unmounted, không còn lắng nghe sự kiện
      socket.off("updateContent");
    };
  }, []);
  return (
    <>
      {stateCheckaccess ? (
        <>
          {" "}
          <div class="social-icons">
            <a
              onClick={() => {
                setIsOpenchat(!isOpenChat);
              }}
              class="tiktok"
            >
              <ChatIcon fontSize="large" />
            </a>
          </div>
        </>
      ) : (
        ""
      )}

      {stateCheckaccess ? (
        <Box m="20px">
          {/* HEADER */}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header
              title={i18n.t("DESDOASHBOARD")}
              // subtitle={i18n.t("TONGDOANHTHU")}
            />

            {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
          </Box>

          <Box mb="20px">
            <div style={{ marginLeft: "-.75%" }} className="container">
              <h3>{i18n.t("CN")}</h3>
              <select onChange={handle_getAllDoanhthu} id="chinhanh">
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
          </Box>
          <Box mb="20px">
            {" "}
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

          {/* GRID & CHARTS */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
          >
            {/* ROW 1 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={parseInt(statetongdoanhthu).toLocaleString("en-US")}
                subtitle={i18n.t("TSOTIENTHUVETUBAN")}
                progress="0.75"
                increase="+14%"
                icon={
                  <TrafficIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            {statechinhanh && statechinhanh === "ST00" ? (
              <>
                {" "}
                <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <StatBox
                    title={parseInt(statesotienBAN).toLocaleString("en-US")}
                    subtitle={i18n.t("TSOTIENDABAN")}
                    progress="0.75"
                    increase="+14%"
                    icon={
                      <TrafficIcon
                        sx={{
                          color: colors.greenAccent[600],
                          fontSize: "26px",
                        }}
                      />
                    }
                  />
                </Box>
              </>
            ) : (
              ""
            )}

            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={parseInt(statetCostBuy).toLocaleString("en-US")}
                subtitle={i18n.t("CostBuy")}
                progress="0.80"
                increase="+43%"
                icon={
                  <ShoppingBasketIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>

            {statechinhanh === "ST00" ? (
              <>
                {" "}
                <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <StatBox
                    title={parseInt(statetCostBuyThucTe).toLocaleString(
                      "en-US"
                    )}
                    subtitle={i18n.t("TSOTIENTHUCTETUNHAPKHO")}
                    progress="0.80"
                    increase="+43%"
                    icon={
                      <ShoppingBasketIcon
                        sx={{
                          color: colors.greenAccent[600],
                          fontSize: "26px",
                        }}
                      />
                    }
                  />
                </Box>
              </>
            ) : (
              ""
            )}

            {/* ROW 2 */}
            <Box
              gridColumn="span 8"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    {i18n.t("TONGQUAN")}
                  </Typography>
                  {/* <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                  >
                    $59,342.32
                    <Button>Month</Button>
                    <Button>Day</Button>
                  </Typography> */}
                </Box>
                {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
              </Box>
              <Box height="250px" m="-20px 0 0 0">
                <LineChart
                  isDashboard={true}
                  stateDoanhthu={stateDoanhthu}
                  minD={min}
                  maxD={max}
                />
              </Box>
            </Box>
            <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              overflow="auto"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography
                  color={colors.grey[100]}
                  variant="h5"
                  fontWeight="600"
                >
                  {i18n.t("TONGQUANNO")}
                </Typography>
              </Box>
              {stateDebtor &&
                stateDebtor.map((transaction, i) => (
                  <Box
                    key={`${transaction.id}-${i}`}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    p="15px"
                  >
                    <Box>
                      <Typography
                        color={colors.greenAccent[500]}
                        variant="h5"
                        fontWeight="600"
                      >
                        {transaction.id}
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        {i18n.t("CONNO")}:{" "}
                        {converToName[transaction.Debtor_BranchID]}
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        {i18n.t("CHUNO_CN")}:{" "}
                        {converToName[transaction.Owner_BranchID]}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        color={colors.greenAccent[500]}
                        variant="h5"
                        fontWeight="600"
                      >
                        {i18n.t("THOIDIEMNO")}
                      </Typography>
                      <Typography color={colors.grey[100]}>
                        {transaction.ThoiDiemNo}
                      </Typography>
                    </Box>
                    <Box
                      backgroundColor={colors.greenAccent[500]}
                      p="5px 10px"
                      borderRadius="4px"
                    >
                      {parseFloat(transaction.sotienNo).toLocaleString("en-US")}{" "}
                      VND
                    </Box>
                  </Box>
                ))}
            </Box>

            {/* ROW 3 */}

            <Box
              className="chatbox"
              gridColumn="span 4"
              style={{ display: isOpenChat ? "block" : "none" }}
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
                p={1}
                textAlign="center"
              >
                {i18n.t("Notice")}
                <hr></hr>
              </Typography>
              <div
                style={{
                  display: "grid",
                  width: "100%",
                }}
              >
                <textarea
                  ref={textAreaRef}
                  value={textAreaValue}
                  rows={9}
                  readOnly
                  style={{
                    fontSize: ".9rem",
                    fontStyle: "oblique",
                    fontWeight: "",
                    color: "white",
                    border: "aliceblue",
                    paddingLeft: "15px",
                    backgroundColor: "#1f2a40",
                  }}
                />
                <hr></hr>
                <label style={{ padding: "5px", paddingLeft: "15px" }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                  />

                  <Button color="success" onClick={handleButtonClick}>
                    <SendIcon />
                  </Button>
                </label>
              </div>
            </Box>

            {/* <Box
              gridColumn="span 4"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ padding: "30px 30px 0 30px" }}
              >
                Sales Quantity
              </Typography>
              <Box height="250px" mt="-20px">
                <BarChart isDashboard={true} />
              </Box>
            </Box> */}
          </Box>
        </Box>
      ) : (
        <Box style={{ display: "flex", marginTop: "10%" }}>
          <div
            style={{
              backgroundColor: "#141b2d",
              color: "white",
              display: "grid",
              margin: "auto",

              height: "100%",
              width: "80%",
            }}
          >
            <Header
              title="Thông báo"
              subtitle="Hãy cập nhật thông tin thường xuyên"
            />
            <textarea
              ref={textAreaRef}
              value={textAreaValue}
              rows={10}
              readOnly
              style={{
                fontSize: ".9rem",
                fontStyle: "oblique",
                fontWeight: "bold",
              }}
            />
          </div>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
