import {
  read,
  utils,
  writeFile,
} from "https://cdn.sheetjs.com/xlsx-0.18.11/package/xlsx.mjs";

function checkFileDiemHocTap(headers = []) {
  let headerToCheck = [
    "lớp",
    "tốt 10",
    "tốt 9.5",
    "tốt 9",
    "khá 8.5",
    "khá 8",
    "khá 7.5",
    "tb 7",
    "tb 6.5",
    "tb 6",
    "tb 5.5",
    "tb 5",
    "yếu 4.5",
    "yếu 4",
    "yếu 3.5",
    "vi phạm/hạn chế",
  ];
  let errorCols = [];

  headers.forEach((e, index) => {
    if (index < headerToCheck.length) {
      let normalizeHeader = e.toLowerCase().trim().normalize("NFC");
      let normalizeHeaderToCheck = headerToCheck[index].normalize("NFC");

      if (normalizeHeader !== normalizeHeaderToCheck) {
        errorCols.push(e);
      }
    }
  });

  if (errorCols.length > 3) {
    pushNotification(
      "error",
      "File không đúng định dạng",
      "Có thể bạn chọn nhầm file mất rồi! &#128517;"
    );
    return false;
  }

  errorCols.forEach((e) => {
    pushNotification(
      "error",
      "File không đúng định dạng",
      `Bạn hãy kiểm tra lại thứ tự các cột và tên cột nha &#128521;. Tên cột có thể sai "${e}"`
    );
  });

  return errorCols.length === 0;
}

function checkFileDiemNeNep(headers = []) {
  let headerToCheck = [
    "lớp",
    "thứ 2",
    "thứ 3",
    "thứ 4",
    "thứ 5",
    "thứ 6",
    "thứ 7",
    "vi phạm",
    "bí thư chấm",
  ];

  let errorCols = [];
  headers.forEach((e, index) => {
    if (index < headerToCheck.length) {
      let normalizeHeader = e.toLowerCase().trim().normalize("NFC");

      let normalizeHeaderToCheck = headerToCheck[index].normalize("NFC");

      if (normalizeHeader !== normalizeHeaderToCheck) {
        errorCols.push(e);
      }
    }
  });

  if (errorCols.length > 3) {
    pushNotification(
      "error",
      "File không đúng định dạng",
      "Có thể bạn chọn nhầm file mất rồi! &#128517;"
    );
    return false;
  }

  errorCols.forEach((e) => {
    pushNotification(
      "error",
      "File không đúng định dạng",
      `Bạn hãy kiểm tra lại thứ tự các cột và tên cột nha &#128521;. Tên cột có thể sai "${e}"`
    );
  });

  return errorCols.length === 0;
}

export function readFileDiemHocTap(file) {
  var reader = new FileReader();
  let result = [];
  reader.onload = function (e) {
    var data = e.target.result;
    /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
    let workbook = read(data);

    let sheetNames = workbook.SheetNames;
    let firstSheet = workbook.Sheets[sheetNames[0]];

    let sheetData = utils.sheet_to_json(firstSheet, {
      header: 1,
      blankRows: false,
    });
    let week = sheetNames[0].split(" ")[1];
    let headers = sheetData[0];

    let valid = checkFileDiemHocTap(headers);
    if (!valid) {
      return;
    }

    Object.values(sheetData).forEach((element, index) => {
      if (index !== 0) {
        result.push({
          lop: element[0],
          tuan: week,
          tot_10: element[1],
          tot_9_5: element[2],
          tot_9: element[3],
          kha_8_5: element[4],
          kha_8: element[5],
          kha_7_5: element[6],
          tb_7: element[7],
          tb_6_5: element[8],
          tb_6: element[9],
          tb_5_5: element[10],
          tb_5: element[11],
          yeu_4_5: element[12],
          yeu_4: element[13],
          yeu_3_5: element[14],
          vi_pham: element[15],
        });
      }
    });

    pushNotification(
      "success",
      "Upload thành công",
      "Upload dữ liệu điểm học tập thành công"
    );

    new gridjs.Grid({
      columns: [
        { name: "Lớp" },
        { name: "Tốt 10" },
        { name: "Tốt 9.5" },
        { name: "Tốt 9" },
        { name: "Khá 8.5" },
        { name: "Khá 8" },
        { name: "Khá 7.5" },
        { name: "TB 7" },
        { name: "TB 6,5" },
        { name: "TB 6" },
        { name: "TB 5.5" },
        { name: "TB 5" },
        { name: "Yếu 4.5" },
        { name: "Yếu 4" },
        { name: "Yếu 3.5" },
        {
          name: "Vi phạm",
          width: "auto",
        },
      ],
      data: result,
      pagination: true,
    }).render(document.getElementById("diem-hoc-tap-wrapper"));

    return result;
  };
  reader.readAsArrayBuffer(file);
}

export function readFileDiemNeNep(excelFile) {
  var reader = new FileReader();
  let result = [];
  reader.onload = function (e) {
    let file = e.target.result;
    /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
    let workbook = read(file);

    let sheetNames = workbook.SheetNames;
    let firstSheet = workbook.Sheets[sheetNames[0]];

    let sheetData = utils.sheet_to_json(firstSheet, {
      header: 1,
      blankRows: false,
    });

    let headers = sheetData[0];
    let valid = checkFileDiemNeNep(headers);
    if (!valid) {
      return;
    }

    let week = sheetNames[0].split(" ")[1];

    Object.values(sheetData).forEach((element, index) => {
      if (index !== 0) {
        result.push({
          lop: element[0],
          tuan: week,
          thu_2: element[1],
          thu_3: element[2],
          thu_4: element[3],
          thu_5: element[4],
          thu_6: element[5],
          thu_7: element[6],
          vi_pham: element[7],
          bi_thu_cham: element[8],
        });
        dataToShow.push(element);
      }
    });

    pushNotification(
      "success",
      "Upload thành công",
      "Upload dữ liệu điểm nề nếp thành công"
    );

    new gridjs.Grid({
      columns: [
        { name: "Lớp" },
        { name: "Thứ 2" },
        { name: "Thứ 3" },
        { name: "Thứ 4" },
        { name: "Thứ 5" },
        { name: "Thứ 6" },
        { name: "Thứ 7" },
        {
          name: "Vi phạm",
          width: "auto",
        },
        { name: "Bí thư chấm" },
      ],
      data: result,
      pagination: true,
    }).render(document.getElementById("diem-ne-nep-wrapper"));

    return result;
  };
  reader.readAsArrayBuffer(excelFile);
}

export function pushNotification(_status, _title, message) {
  new Notify({
    status: _status,
    title: _title,
    text: message,
    effect: "slide",
    speed: 300,
    showIcon: true,
    showCloseButton: true,
    autoclose: _status == "error" ? false : true,
    autotimeout: 3000,
    gap: 10,
    distance: 20,
    type: 1,
    position: "right top",
  });
}
