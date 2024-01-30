// i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      translation: {
        QLNV: "Quản lý nhân viên",
        QLCNHANH: "Quản Lý chi nhánh",
        QLK: "Quản lý kho",
        TT: "Thông tin",
        BDTK: "Biến động tồn kho",
        QLNK: "Quản lý nhập kho",
        QLXK: "Quản lý xuất kho",
        DT: "Doanh thu",
        QLHD: "Quản lý hóa đơn",
        QLDT: "Quản lý danh thu",
        QLCN: "Quản lý con nợ",
        HV: "Hành vi",
        NK: "Nhập kho",
        XK: "Xuất kho",
        //BUTTON
        BTN_XACNHAN: "Xác nhận",
        BTN_DONG: "Đóng",
        //TEAM
        TITLETEAM: "Thông tin nhân viên",
        DESTEAM: "Quản lý các thành viên tại cửa hàng",
        THEMNV: "Thêm nhân viên",
        XOANV: "Xóa nhân viên",
        SUANV: "Sửa thông tin nhân viên",
        CN: "Chi nhánh",
        MNV_TEAM: "Mã nhân viên",
        TNV_TEAM: "Tên nhân viên",
        SDT_TEAM: "Số điện thoại",
        CV_TEAM: "Chức vụ",
        NV_TEAM: "Ngày vào",
        TDT_TEAM: "Thời điểm tạo",
        ALERT_THEMNHANVIEN_TEAM: "Nhân viên đã được thêm thành công",

        //BRANCH
        TITLEBRANCH: "Chi nhánh",
        DESBRANCH: "Quản lý các thông tin chi nhánh",
        STT_B: "Số thứ tự",
        MA_B: "Mã chi nhánh",
        TEN_B: "Tên chi nhánh",
        DIACHI_B: "Địa chỉ",
        MASOTHUE_B: "Mã số thuế",
        THOIDIEMTAO_B: "Thời điểm tạo",

        //KHO
        TITLEKHO: "Tồn kho",
        DESKHO: "Quản lý tồn kho",
        MASP_P: "Mã sản phẩm",
        TEN_P: "Tên sản phẩm",
        LOAI_P: "Loại",
        HINHANH_P: "Hình ảnh",
        SOLUONG_P: "Số lượng",
        TINHTRANG_P: "Tình trạng",
        HANHVI_P: "Hành vi",
        THEMSP_P: "Thêm sản phẩm",
        XOASP_P: "Xóa sản phẩm",
        DIEUCHINHSP_P: "Điều chỉnh sản phẩm",
        ALERT_THEMSANPHAM_P: "Thêm sản phẩm thành công",

        //NHẬP KHO
        TITLENHAPKHO: "Nhập kho",
        DESNHAPKHO: "Quản lý nhập kho",
        MAKHO_NP: "Mã phiếu lập",
        MTK_NP: "Mã tài khoản",
        TINHTRANG_NP: "Tình trạng",
        SOTIEN_NP: "Số tiền",
        NGAYLAPPHIEU_NP: "Ngày lập phiếu",
        NGAYCAPNHAT_NP: "Ngày cập nhật phiếu",
        SOLUONGSP_NP: "Số lượng nhập",
        BTN_XACNHANYEUCAU_NP: "Xác nhận yêu cầu",

        TITLE_ALERT_NP: "Cập nhật tình trạng",
        DES_ALERT_NP: "Chuyển trạng thái sang chấp thuận?",
        CAPNHAT_NP: "Cập nhật thành công",
        CLICKNO_NP: "Bạn chọn không!",

        //Xuất KHO
        TITLEXUATKHO: "Xuất kho",
        DESXUATKHO: "Quản lý xuất kho",
        MAPX_PX: "Mã phiếu xuất",
        MAPN_PX: "Mã phiếu nhập",
        TONGTIEN_PX: "Tổng tiền",
        TINHTRANG_PX: "Tình trạng",
        NGAYLAP_PX: "Ngày lập phiếu",
        NGAYCAPNHAT_PX: "Ngày cập nhật",
        SOLUONGSP_PX: "Số lượng sản phẩm xuất",
        ALERT_LAPHOADONSUCCESS: "Lập hóa đơn thành công",
        BTN_LAPHOADON: "Lập hóa đơn",
        MODAL_NOIBAN: "Nơi bán",
        MODAL_GIAMUA: "Giá mua",
        MODAL_NOIMUA: "Nơi mua",
        MODAL_GIABAN: "Giá bán",
        MODAL_NHAPNOIBAN: "Nhập nơi bán",
        MODAL_NHAPNOIMUA: "Nhập nơi mua",

        //Hóa đơn
        TITLEHOADON: "Hóa đơn",
        DESHOADON: "Chi tiết hóa đơn (đã từng mua) theo từng chi nhánh",
        MAHD_HD: "Mã hóa đơn",
        MATK_HD: "Mã tài khoản",
        NOIBAN_HD: "Nơi bán",
        GIABAN_HD: "Giá bán",
        GIAMUA_HD: "Giá mua",
        NGAYLAP_HD: "Ngày lập hóa đơn",

        //DOANH THU
        TITLEDOANHTHU: "Doanh thu",
        DESDOANHTHU: "Chi tiết doanh thu từng cửa hàng",
        MADT_DT: "Mã doanh thu",
        MAKHO_DT: "Mã kho",
        SOTIEN_DT: "Số tiền doanh thu",
        NGAYLAP_DT: "Ngày lập phiếu",
        DSCONNO_DT: "Danh sách con nợ",

        //CON NỢ DEBTOR
        TITLECONNO: "Danh sách nợ",
        DESCONNO: "Chi tiết Nợ của từng cửa hàng",
        MA_CN: "Mã phiếu nợ",
        CHUNO_CN: "Chủ nợ",
        THOIDIEMNO_CN: "Thời điểm nợ",
        SOTIENNO_CN: "Số tiền nợ",
        LANCUOICAPNHAT: "Lần cuối cập nhật",
        MODAL_DIEUCHINHTT: "Cập nhật số tiền nợ",
        MODAL_SOTIENNO: "Số tiền nợ",
        MODAL_SOTIENTHU: "Số tiền thu",
        BTN_CAPNHATSOTIEN: "Cập nhật số tiền",
        ALERT_CAPNHATSUCCESS: "Đã cập nhật vào doanh thu thành công ",

        //Nhập kho
        TITLENHAP: "Gửi yêu cầu Nhập sản phẩm",
        TONGSOTIEN_NHAP: "Tổng số tiền",
        LOAIPHIEU_NHAP: "Loại phiếu",
        ALERT_TITLE: "Gửi đơn yêu cầu xác nhận",
        ALERT_DES: "Bạn có chắc sẽ gửi đơn",
        ALERT_CHU: "chứ?",
        ALERT_PHIEUNHAP: "Phiếu nhập",
        ALERT_PHIEUXUAT: "Phiếu xuất",
        ALERT_GUIYEUCAUSUCCESS: "Gửi yêu cầu nhập thành công",
        ERROR_NAME: "Vui lòng nhập Tên sản phẩm.",

        ERROR_LOAI: "Vui lòng nhập Loại.",

        ERROR_SOLUONG: "Vui lòng nhập Số lượng.",

        ERROR_SOTIEN: "Vui lòng nhập Tên sản phẩm.",

        ERROR_HINH: "Vui lòng chọn một hình ảnh.",
        BTN_XOA: "Xóa",
        LABLE_NHAP: "Nhập",
        BTN_GUIYEUCAU: "Gửi yêu cầu",

        //LẬP PHIẾU XUẤT
        TITLEPHIEUXUAT: "Lập phiếu xuất kho",
        CN_XUAT: "Chi nhánh xuất",
        MAPHIEU_XUAT: "Mã phiếu",
        LABLE_XUAT: "Xuất",
        XUATSU_X: "Xuất sứ",
        ALERT_ADDPHIEUSUCCESS: "Thêm phiếu xuất thành công !!",

        //Doashboard
        TITLEDOASHBOARD: "Bảng điều khiển",

        DESDOASHBOARD: "Chào mừng tới bảng điều khiển",
        TONGDOANHTHU: "Tổng doanh thu",
        SOTIENLOINHUAN: "Số tiền lợi nhuận",
        TONGTIENMUA: "Tổng tiền mua",
        TONGQUAN: "Tổng quan doanh thu",
        TONGQUANNO: "Tổng quan nợ",
        THOIDIEMNO: "Thời điểm nợ",
      },
    },
    ko: {
      translation: {
        QLNV: "인사 관리",
        QLCNHANH: "지점 관리",
        QLK: "창고 관리",
        TT: "정보",
        BDTK: "재고 변동",
        QLNK: "입고 관리",
        QLXK: "출고 관리",
        DT: "매출",
        QLHD: "영수증 관리",
        QLDT: "매출 관리",
        QLCN: "채무 관리",
        HV: "행동",
        NK: "입고",
        XK: "출고",

        //BUTTON
        BTN_XACNHAN: "확인",
        BTN_DONG: "닫기",
        //TEAM
        TITLETEAM: "팀 정보",
        DESTEAM: "가게 구성원 관리",
        THEMNV: "직원 추가",
        XOANV: "직원 삭제",
        SUANV: "직원 정보 수정",
        CN: "지점",
        MNV_TEAM: "직원 코드",
        TNV_TEAM: "직원 이름",
        SDT_TEAM: "전화 번호",
        CV_TEAM: "직위",
        NV_TEAM: "입사일",
        TDT_TEAM: "생성 시간",
        ALERT_THEMNHANVIEN_TEAM: "직원이 성공적으로 추가되었습니다",

        //BRANCH
        TITLEBRANCH: "지점",
        DESBRANCH: "지점 정보 관리",
        MA_B: "지점 코드",
        STT_B: "순서",
        TEN_B: "지점명",
        DIACHI_B: "주소",
        MASOTHUE_B: "세금 번호",
        THOIDIEMTAO_B: "생성 시간",

        //KHO
        TITLEKHO: "재고",
        DESKHO: "재고 관리",
        MASP_P: "상품 코드",
        TEN_P: "상품 이름",
        LOAI_P: "종류",
        HINHANH_P: "이미지",
        SOLUONG_P: "수량",
        TINHTRANG_P: "상태",
        HANHVI_P: "행동",
        THEMSP_P: "상품 추가",
        XOASP_P: "상품 삭제",
        DIEUCHINHSP_P: "상품 조정",
        ALERT_THEMSANPHAM_P: "상품 추가 성공",

        //NHẬP KHO
        TITLENHAPKHO: "입고",
        DESNHAPKHO: "입고 관리",
        MAKHO_NP: "전표 코드",
        MTK_NP: "계정 번호",
        TINHTRANG_NP: "상태",
        SOTIEN_NP: "금액",
        NGAYLAPPHIEU_NP: "전표 작성일",
        NGAYCAPNHAT_NP: "전표 업데이트 일자",
        SOLUONGSP_NP: "입고 수량",
        BTN_XACNHANYEUCAU_NP: "요청 확인",
        TITLE_ALERT_NP: "상태 업데이트",
        DES_ALERT_NP: "상태를 승인으로 변경",
        CAPNHAT_NP: "업데이트 성공",
        CLICKNO_NP: "당신은 아니라고 선택하셨습니다!",

        //Xuất KHO
        TITLEXUATKHO: "출고",
        DESXUATKHO: "출고 관리",
        MAPX_PX: "출고 번호",
        MAPN_PX: "입고 번호",
        TONGTIEN_PX: "총액",
        TINHTRANG_PX: "상태",
        NGAYLAP_PX: "전표 작성일",
        NGAYCAPNHAT_PX: "전표 업데이트 일자",
        SOLUONGSP_PX: "출고 제품 수량",
        ALERT_LAPHOADONSUCCESS: "영수증 작성 성공",
        BTN_LAPHOADON: "영수증 작성",
        MODAL_NOIBAN: "판매처",
        MODAL_GIAMUA: "구매 가격",
        MODAL_NOIMUA: "구입처",
        MODAL_GIABAN: "판매 가격",

        MODAL_NHAPNOIBAN: "판매처 입력",
        MODAL_NHAPNOIMUA: "구입처 입력",

        //Hóa đơn
        TITLEHOADON: "영수증",
        DESHOADON: "각 지점별 구매한 영수증 세부 정보",
        MAHD_HD: "영수증 번호",
        MATK_HD: "계정 번호",
        NOIBAN_HD: "판매처",
        GIABAN_HD: "판매 가격",
        GIAMUA_HD: "구매 가격",
        NGAYLAP_HD: "영수증 작성일",

        //DOANH THU
        TITLEDOANHTHU: "매출",
        DESDOANHTHU: "매장별 매출 세부 정보",
        MADT_DT: "매출 번호",
        MAKHO_DT: "창고 코드",
        SOTIEN_DT: "매출 금액",
        NGAYLAP_DT: "전표 작성일",
        DSCONNO_DT: "미수금 목록",

        TITLECONNO: "미수금 목록",
        DESCONNO: "각 매장별 미수금 세부 정보",
        MA_CN: "미수금 번호",
        CHUNO_CN: "채무자",
        THOIDIEMNO_CN: "미수금 시간",
        SOTIENNO_CN: "미수금",
        LANCUOICAPNHAT: "마지막 업데이트",

        MODAL_DIEUCHINHTT: "미수금 금액 업데이트",
        MODAL_SOTIENNO: "미수금 금액",
        MODAL_SOTIENTHU: "수금 금액",

        BTN_CAPNHATSOTIEN: "금액 업데이트",

        ALERT_CAPNHATSUCCESS: "매출에 성공적으로 업데이트되었습니다",

        //NHẬP
        TITLENHAP: "제품 입고 요청 보내기",
        TONGSOTIEN_NHAP: "총 금액",
        LOAIPHIEU_NHAP: "전표 유형",
        ALERT_TITLE: "확인 요청서 보내기",
        ALERT_DES: "확인 요청을 보낼까요",
        ALERT_CHU: "맞아요?",
        ALERT_PHIEUNHAP: "입고 전표",
        ALERT_PHIEUXUAT: "출고 전표",
        ALERT_GUIYEUCAUSUCCESS: "입고 요청을 성공적으로 보냈습니다",
        ERROR_NAME: "제품 이름을 입력하세요.",

        ERROR_LOAI: "종류를 입력하세요.",

        ERROR_SOLUONG: "수량을 입력하세요.",

        ERROR_SOTIEN: "제품 이름을 입력하세요.",

        ERROR_HINH: "이미지를 선택하세요.",
        BTN_XOA: "삭제",
        LABLE_NHAP: "입력",
        BTN_GUIYEUCAU: "요청 보내기",

        //phiếu xuất
        TITLEPHIEUXUAT: "출고 전표 작성",
        CN_XUAT: "지점 출고",
        MAPHIEU_XUAT: "전표 번호",
        LABLE_XUAT: "출고",
        XUATSU_X: "출처",
        ALERT_ADDPHIEUSUCCESS: "출고 전표 추가 성공 !!",

        //Doashboard
        TITLEDOASHBOARD: "대시 보드",

        DESDOASHBOARD: "대시 보드에 오신 것을 환영합니다",
        TONGDOANHTHU: "총 매출",
        SOTIENLOINHUAN: "순이익 금액",
        TONGTIENMUA: "총 구매 금액",
        TONGQUAN: "매출 전체적인 상황",
        TONGQUANNO: "전체적인 미수금 상황",
        THOIDIEMNO: "미수금 시기",
      },
    },
  },
  lng: "vi", // Ngôn ngữ mặc định là tiếng Việt
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
