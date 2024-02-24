import React, { useState } from "react";
import * as XLSX from "xlsx";

const Testform = () => {
  const [htmlTable, setHtmlTable] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const excelData = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]);

        setHtmlTable(excelData);
      };

      reader.readAsBinaryString(file);
    }
  };
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div dangerouslySetInnerHTML={{ __html: htmlTable }} />
    </div>
  );
};
export default Testform;
