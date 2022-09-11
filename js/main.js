import { createApp, reactive } from "https://unpkg.com/petite-vue?module";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import {
  readFileDiemHocTap,
  readFileDiemNeNep,
  pushNotification,
} from "./helper.js";
const supabase = createClient(
  "https://clcrfohusnfsddfklteg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsY3Jmb2h1c25mc2RkZmtsdGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI4MjgxMjcsImV4cCI6MTk3ODQwNDEyN30.BJnSbzGih8lkuIoMtuADNfOywe_rHICQwk347VQ_d4o"
);

const store = reactive({
  open: false,
  isLoggedIn: false,
  diemHocTap: [],
  diemNeNep: [],
  viPham: [],
  handleUploadDiemHocTap(event) {
    const fileList = event.target.files;
    let file = fileList[0];
    let fileName = file.name;
    if (!fileName.endsWith(".xlsx")) {
      pushNotification(
        "error",
        "File không đúng định dạng",
        "Chỉ nhận file có đuôi .xlsx"
      );
      return;
    }
    if (this.diemHocTap.length > 0) {
      this.diemHocTap = [];
    }

    let data = readFileDiemHocTap(file);
    this.diemHocTap = data;
    console.log(data);
  },

  handleUploadDiemNeNep(event) {
    const fileList = event.target.files;
    let file = fileList[0];
    let fileName = file.name;
    if (!fileName.endsWith(".xlsx")) {
      pushNotification(
        "error",
        "File không đúng định dạng",
        "Chỉ nhận file có đuôi .xlsx"
      );

      return;
    }

    if (this.diemNeNep.length > 0) {
      this.diemNeNep = [];
    }

    let data = readFileDiemNeNep(file);
    this.diemNeNep = data;
  },

  handleUploadViPham(event) {
    pushNotification(
      "warning",
      "Tính năng chưa hoàn thiện",
      "Tính năng này hiện chưa được triển khai đâu nha &#128555;"
    );

    // const fileList = event.target.files;
    // let file = fileList[0];
    // let fileName = file.name;
    // if (!fileName.endsWith(".xlsx")) {
    //   alert(`Khong dung dinh dang file Excel ${fileName}`);
    //   return;
    // }

    // if (store.viPham.length > 0) {
    //   store.viPham = [];
    // }

    // var reader = new FileReader();
    // // let tmpDiemHocTap = [];
    // reader.onload = function (e) {
    //   var data = e.target.result;
    //   /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
    //   let workbook = read(data);

    //   let sheetNames = workbook.SheetNames;
    //   let firstSheet = workbook.Sheets[sheetNames[0]];

    //   let sheetData = utils.sheet_to_json(firstSheet, {
    //     header: 1,
    //     blankRows: false,
    //   });
    //   let week = sheetNames[0].split(" ")[1];
    //   let dataToShow = Object.values(sheetData);
    //   dataToShow.map((e) => {
    //     e = e.slice(0);
    //     return e;
    //   });
    //   sheetData[0].forEach((element, index) => {
    //     store.viPham.push({
    //       lop: element,
    //       tuan: week,
    //       tot_10: sheetData[1][index],
    //       tot_9_5: sheetData[2][index],
    //       tot_9: sheetData[3][index],
    //       kha_8_5: sheetData[4][index],
    //       kha_8: sheetData[5][index],
    //       kha_7_5: sheetData[6][index],
    //       tb_7: sheetData[7][index],
    //       tb_6_5: sheetData[8][index],
    //       tb_6: sheetData[9][index],
    //       tb_5_5: sheetData[10][index],
    //       tb_5: sheetData[11][index],
    //       yeu_4_5: sheetData[12][index],
    //       yeu_4: sheetData[13][index],
    //       yeu_3_5: sheetData[14][index],
    //       vi_pham: sheetData[15][index],
    //     });
    //   });
    //   new gridjs.Grid({
    //     columns: [
    //       { name: "Lớp" },
    //       { name: "Tốt 10" },
    //       { name: "Tốt 9.5" },
    //       { name: "Tốt 9" },
    //       { name: "Khá 8.5" },
    //       { name: "Khá 8" },
    //       { name: "Khá 7.5" },
    //       { name: "TB 7" },
    //       { name: "TB 6,5" },
    //       { name: "TB 6" },
    //       { name: "TB 5.5" },
    //       { name: "TB 5" },
    //       { name: "Yếu 4.5" },
    //       { name: "Yếu 4" },
    //       { name: "Yếu 3.5" },
    //       {
    //         name: "Vi phạm",
    //         width: "auto",
    //       },
    //     ],
    //     data: dataToShow,
    //     pagination: true,
    //   }).render(document.getElementById("vi-pham-wrapper"));
    // };
    // reader.readAsArrayBuffer(file);
  },
});

function MainComponent() {
  return {
    $template: "#main",
    mounted() {
      let jwt = localStorage.getItem("jwt");
      if (jwt && jwt !== "") {
        store.isLoggedIn = true;
      }
    },
  };
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.HandleLogin = (response) => {
  const responsePayload = parseJwt(response.credential);

  let email = responsePayload.email;
  if (email != "hangminhvu.626@gmail.com" && email != "bovachd@gmail.com") {
    alert("Authenticaion Failed. Access Denied!!!");
    store.isLoggedIn = false;
    localStorage.clear();
    return;
  }

  localStorage.setItem("jwt", `Bearer ${response.credential}`);
  store.isLoggedIn = true;
};

createApp({ MainComponent, store }).mount();
