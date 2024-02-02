import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import ORDER from "./scenes/Order";
import XUATKHO from "./scenes/xuatkho";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "./scenes/login/LoginPage";
import Father from "./FatherCoponent";
import Bills from "./scenes/bill";
import DOANHTHU from "./scenes/doanhthu";
import DEBTORS from "./scenes/debtor";
import ACCOUNT from "./scenes/account";
import BRACNH from "./scenes/branch";
import DETAILS from "./scenes/Details/details";
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <Routes>
      <Route
        path="/"
        element={<Father childrend={<Dashboard></Dashboard>}></Father>}
      />
      <Route
        path="/details"
        element={<Father childrend={<DETAILS></DETAILS>}></Father>}
      />
      <Route
        path="/team"
        element={<Father childrend={<Team></Team>}></Father>}
      />

      <Route
        path="/contacts"
        element={<Father childrend={<Contacts></Contacts>}></Father>}
      />
      <Route
        path="/form"
        element={<Father childrend={<Form></Form>}></Father>}
      />

      <Route
        path="/invoices"
        element={<Father childrend={<Invoices></Invoices>}></Father>}
      />
      <Route
        path="/xuatkho"
        element={<Father childrend={<XUATKHO></XUATKHO>}></Father>}
      />
      <Route
        path="/bills"
        element={<Father childrend={<Bills></Bills>}></Father>}
      />

      <Route
        path="/orders"
        element={<Father childrend={<ORDER></ORDER>}></Father>}
      />

      <Route
        path="/doanhthu"
        element={<Father childrend={<DOANHTHU></DOANHTHU>}></Father>}
      />
      <Route
        path="/debtors"
        element={<Father childrend={<DEBTORS></DEBTORS>}></Father>}
      />

      <Route path="/bar" element={<Bar />} />
      <Route path="/pie" element={<Pie />} />
      <Route path="/line" element={<Line />} />
      <Route path="/faq" element={<FAQ />} />

      <Route
        path="/calendar"
        element={<Father childrend={<Calendar></Calendar>}></Father>}
      />

      <Route
        path="/account"
        element={<Father childrend={<ACCOUNT></ACCOUNT>}></Father>}
      />
      <Route
        path="/branch"
        element={<Father childrend={<BRACNH></BRACNH>}></Father>}
      />
      <Route path="/geography" element={<Geography />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
}

export default App;
