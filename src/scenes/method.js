export const ConvertStoreIdTONAME = (name) => {
  let convert = "";
  if (name === "STOO") {
    convert += "PHOTO TIME COMPANY";
  }
  if (name === "STO1") {
    convert += "PHOTO TIME - Selft studio";
  }
  if (name === "STO2") {
    convert += "PHOTO TIME CRESCENT MALL";
  }
  if (name === "STO3") {
    convert += "PHOTO TIME VẠN HẠNH MALL";
  }
  if (name === "STO4") {
    convert += "PHOTO TIME Cinestar Cinema QUỐC THANH";
  }
  if (name === "STO5") {
    convert += "PHOTO TIMEThiso Mall Sala";
  }
  if (name === "STO6") {
    convert += "PHOTO TIME GIGAMALL THỦ ĐỨC";
  }
  if (name === "STO7") {
    convert += "PHOTO TIME VINCOM PLAZA THỦ ĐỨC";
  }
  if (name === "STO8") {
    convert += "PHOTO TIME Lotte Mall Tây Hồ";
  }
  if (name === "STO9") {
    convert += "PHOTO TIME HÙNG VƯƠNG PLAZA";
  }
  if (name === "STO10") {
    convert += "PHOTO TIME Royal City";
  }
  if (name === "STO11") {
    convert += "PHOTO TIME THE LOOP";
  }
  return convert;
};

export const converToName = {
  ST00: "PHOTO TIME COMPANY",
  ST01: "PHOTO TIME - Selft studio",
  ST02: "PHOTO TIME CRESCENT MALL",
  ST03: "PHOTO TIME VẠN HẠNH MALL",
  ST04: "PHOTO TIME Cinestar Cinema QUỐC THANH",
  ST05: "PHOTO TIME Thiso Mall Sala",
  ST06: "PHOTO TIME GIGAMALL THỦ ĐỨC",
  ST07: "PHOTO TIME VINCOM PLAZA THỦ ĐỨC",
  ST08: "PHOTO TIME Lotte Mall Tây Hồ",
  ST09: "PHOTO TIME HÙNG VƯƠNG PLAZA",
  ST10: "PHOTO TIME Royal City",
  ST11: "PHOTO TIME THE LOOP",
  // Thêm các ánh xạ khác nếu cầ
};
export const converBranchIDTOStoreID = {
  BT001: "ST01",
  BT002: "ST02",
  BT003: "ST03",
  BT004: "ST04",
  BT005: "ST05",
  BT006: "ST06",
  BT007: "ST07",
  BT008: "ST08",
  BT009: "ST09",
  BT010: "ST10",
  BT011: "ST11",
  BT00: "ST00",
  // Thêm các ánh xạ khác nếu cầ
};

export const CreateIdMaxValueOfarray = (loai, resolvedResult, code) => {
  let lenghtState = 0;

  const arrayOfNumbers = resolvedResult.map((obj) =>
    parseInt(obj.id.split("-")[3])
  );

  if (arrayOfNumbers) {
    // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
    let maxNumber = Math.max(...arrayOfNumbers);
    const result = 1 / 0;

    const negativeInfinity = -1 / 0;

    if (maxNumber === negativeInfinity || maxNumber === result) {
      maxNumber = 0;
    }
    lenghtState = maxNumber + 1;
  }
  // Tạo một đối tượng Date hiện tại
  const currentDate = new Date();

  // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = currentDate.getDate().toString().padStart(2, "0");

  // Tạo chuỗi datetime
  const datetimeString = `${year}${month}${day}`;

  const valueId = loai + "-" + code + "-" + datetimeString + "-" + lenghtState;
  return valueId;
};
