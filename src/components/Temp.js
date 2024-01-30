import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
const Temp = () => {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  return (
    <>
      <div>
        <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
        <button onClick={() => changeLanguage("ko")}>한국어</button>
      </div>
    </>
  );
};
export default Temp;
