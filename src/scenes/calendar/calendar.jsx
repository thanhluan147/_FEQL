import { useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import {
  Get_all_store_By_userid,
  Get_all_Store,
} from "../contacts/handlestore";
import React, { useEffect } from "react";
import HandleAccessAccount from "../handleAccess/handleAccess";
import { GET_ALL_DOANHTHU_By_storeID } from "./handledoanhthu";
const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [stateStore, setStateStore] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statecalendar, setStatecalendar] = useState([]);

  let checkaccess = false;
  let chinhanhdau = "";
  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
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
  const formatYYYYMMDD = (x) => {
    const inputDateTimeString = x;
    const dateTimeObject = new Date(inputDateTimeString);

    // Lấy ngày, tháng, và năm
    const year = dateTimeObject.getFullYear();
    const month = (dateTimeObject.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = dateTimeObject.getDate().toString().padStart(2, "0");

    // Định dạng ngày theo yêu cầu
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };
  const fetchingGettAllDOANHTHU_by_storeID = async (x) => {
    const check = await GET_ALL_DOANHTHU_By_storeID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStatecalendar(JSON.parse(resolvedResult));
    
      let arry = [];
      JSON.parse(resolvedResult).map((object, idx) => {
        const date = formatYYYYMMDD(resolvedResult.thoidiem);
     
        const temp = {
          id: object.id, // index (1-based)
          title: "temp",
          date: date,
        };
        arry.push(temp);
      });
      setStatecalendar(arry);
    } else {
      let arry = [];
      JSON.parse(check).map((object, idx) => {
        const date = formatYYYYMMDD(object.thoidiem);
      
        const temp = {
          id: object.id, // index (1-based)
          title: "temp",
          date: date,
        };
        arry.push(temp);
      });
      setStatecalendar(arry);
    }
  };
  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    await fetchingGettAllDOANHTHU_by_storeID(chinhanhdau);

    setStatechinhanh(chinhanhdau);
  };
  useEffect(() => {
    fetchingapi();

  }, []);
  const handle_getAllCalendar = async (e) => {
    await fetchingGettAllDOANHTHU_by_storeID(e.target.value);
    setStatechinhanh(e.target.value);
  };
  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />
      <div className="container">
        <h3>Chi nhánh</h3>
        <select onChange={handle_getAllCalendar} id="chinhanh">
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
      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={statecalendar}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
