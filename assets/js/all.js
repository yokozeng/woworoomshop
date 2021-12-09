"use strict";

//首頁跟後台拆開做

/*

戳所有產品API getProductsList() -> 取得產品資料
跑forEach 組字串-> 顯示產品資訊
select綁change監聽 -> 篩選產品資訊
*/
console.clear();
var apiPath = "zengzeng";
var token = "JZrWxOJ9QrMv7bwenU4Xp94h4M12";
var orderData = []; //DOM元素

var orderList = document.querySelector(".orderList");
var thead = document.querySelector(".thead");
var tbodyList = document.querySelector(".tbodyList"); // 圖表顏色變數
//const primaryDark = "#301E5F";

var primary = "#937218";
var primaryLight = "#c79a20";
var light = "#c7b06f"; // 類別排名高到低

var colors = [primary, primaryLight, light];
/*========================= 後台 =========================*/

/*---------- 訂單相關(管理者) ----------*/
// GET 取得訂單列表 (v)

function getOrderList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(apiPath, "/orders"), {
    headers: {
      Authorization: token
    }
  }).then(function (response) {
    //console.log('成功',response.data.orders);
    orderData = response.data.orders; //console.log("response.data.orders1", orderData);

    console.log("length", orderData.length);
    console.log(orderData.length == 0); //判斷訂單內有無東西

    if (orderData.length == 0) {
      orderList.innerHTML = "\n            <p class=\"text-center text-secondary\">\n              \u76EE\u524D\u6C92\u6709\u8A02\u55AE\u5537(\u3063\u02D8\u03C9\u02D8\u03C2 )\n            </p>\n          ";
      return;
    } else {
      console.log("render中"); //render 圖表

      productCategory(orderData); //table head字串

      var theadStr = "\n        <div>\n        <input type=\"button\" value=\"\u6E05\u9664\u5168\u90E8\u8A02\u55AE\" class=\"deleteAllOrderBtn\">\n        <tr>\n      <th>\u8A02\u55AE\u7DE8\u865F</th>\n      <th>\u806F\u7D61\u4EBA</th>\n      <th>\u806F\u7D61\u5730\u5740</th>\n      <th>\u96FB\u5B50\u90F5\u4EF6</th>\n      <th>\u8A02\u55AE\u54C1\u9805</th>\n      <th>\u8A02\u55AE\u65E5\u671F</th>\n      <th>\u8A02\u55AE\u72C0\u614B</th>\n      <th>\u64CD\u4F5C</th>\n    </tr>";
      thead.innerHTML = theadStr;
      var date;
      var orderStatusText = '';
      var str = ""; //forEach

      orderData.forEach(function (item, index) {
        // 訂單狀態轉換
        if (item.paid === false) {
          orderStatusText = '未處理';
        } else {
          orderStatusText = '已處理';
        } // 日期轉換


        date = new Date(item.createdAt * 1000);
        date = "".concat(date.getFullYear(), "/").concat(date.getMonth() + 1, "/").concat(date.getDate()); // 印出產品項目1

        var productsStr = '';
        item.products.forEach(function (item) {
          productsStr += "<p>".concat(item.title, " x ").concat(item.quantity, "</p>");
        }); //組 table body字串

        str += "<tr>\n                    <td>".concat(item.id, "</td>\n                    <td>\n                      <p>").concat(item.user.name, "</p>\n                      <p>").concat(item.user.tel, "</p>\n                    </td>\n                    <td>").concat(item.user.address, "</td>\n                    <td>").concat(item.user.email, "</td>\n                    <td>\n                      <p>").concat(productsStr, "</p>\n                    </td>\n                    <td>").concat(date, "</td>\n                    <td class=\"orderStatus\">\n                      <input type=\"button\" class=\"orderStatusBtn\" data-id=\"").concat(item.id, "\" data-status=\"").concat(item.paid, "\" value=\"").concat(orderStatusText, "\">\n                    </td>\n                    <td>\n                      <input type=\"button\" class=\"delSingleOrderBtn\" data-id=\"").concat(item.id, "\" value=\"\u522A\u9664\">\n                    </td>\n                </tr>");
      });
      console.log("response.data.orders2", orderData);
      tbodyList.innerHTML = str;
    }
  });
}

;
getOrderList(); //監聽

orderList.addEventListener("click", function (e) {
  //console.log('id啦',e.target.dataset.id)
  var orderId = e.target.getAttribute('data-id');
  var orderClassName = e.target.getAttribute("class");
  var orderStatus = e.target.getAttribute('data-status');
  console.log('paidStatus', orderStatus);
  console.log('id', orderId);
  console.log('class', orderClassName); //觸發 修改訂單狀態

  if (orderClassName == "orderStatusBtn") {
    editOrderListStatus(orderStatus, orderId);
  } //觸發 刪除特定訂單


  if (orderClassName == "delSingleOrderBtn") {
    deleteOrderItem(orderId);
  } //觸發 清空全部訂單


  if (orderClassName == "deleteAllOrderBtn") {
    deleteAllOrder();
  }
}); // PUT 修改訂單狀態 (v)

function editOrderListStatus(orderStatus, orderId) {
  console.log("修改中"); // 轉換訂單狀態

  var newStatus;

  if (orderStatus == "true") {
    newStatus = false;
  } else {
    newStatus = true;
  }

  ;
  console.log("newStatus", newStatus);
  axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(apiPath, "/orders"), {
    data: {
      id: orderId,
      paid: newStatus
    }
  }, {
    headers: {
      Authorization: token
    }
  }).then(function (response) {
    alert("狀態修改成功 (*´▽`*)");
    console.log("狀態修改成功 (*´▽`*)");
    getOrderList();
  })["catch"](function (error) {
    console.log("狀態修改失敗", error.response.data);
  });
}

; // DELETE 清空全部訂單

function deleteAllOrder() {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(apiPath, "/orders"), {
    headers: {
      Authorization: token
    }
  }).then(function (response) {
    console.log(response.data);
    alert("訂單已全部清空。 (*´▽`*)");
    getOrderList();
  });
}

; // DELETE 刪除特定訂單 (v)

function deleteOrderItem(orderId) {
  console.log('準備刪除訂單囉～');
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(apiPath, "/orders/").concat(orderId), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response.data);
    alert('訂單刪除成功 (*´▽`*)');
    getOrderList();
  });
}

; // 圖表 全品項營收比重

function productCategory(orderData) {
  if (orderData.length == 0) {
    chart.innerHTML = "<p>\u76EE\u524D\u6C92\u6709\u8A02\u55AE\u5537(\u3063\u02D8\u03C9\u02D8\u03C2 )</p>";
  } else {
    var obj = {};
    var objAry = [];
    var productCategoryAry = []; // 篩選類別，並累加數量上去

    orderData.forEach(function (items) {
      items.products.forEach(function (item) {
        console.log('obj', obj);
        console.log('類別數量', obj[item.category]);

        if (obj[item.category] === undefined) {
          obj[item.category] = item.quantity;
        } else {
          obj[item.category] += item.quantity;
        }

        console.log('最後類別數量', obj[item.category]);
      });
    }); // 將資料處理成符合 c3 要的格式，存進 productCategoryAry

    objAry = Object.keys(obj);
    console.log('objAry', objAry);
    objAry.forEach(function (item) {
      var ary = [];
      ary.push(item);
      ary.push(obj[item]);
      productCategoryAry.push(ary);
    });
    console.log('productCategoryAry', productCategoryAry); // 排序 (多到少)

    productCategoryAry.sort(function (a, b) {
      return b[1] - a[1];
    });
    renderC3(productCategoryAry);
  }
} // 圖表 renderC3


function renderC3(ary) {
  // 處理顏色格式
  var arrayName = {};
  ary.forEach(function (item, index) {
    if (arrayName[item[0]] === undefined) {
      arrayName[item[0]] = colors[index];
    }
  }); //c3產生器

  var pieChart = c3.generate({
    bindto: "#chart",
    data: {
      columns: ary,
      // 資料存放
      type: "pie",
      // 圖表種類
      colors: arrayName
    }
  });
}
//# sourceMappingURL=all.js.map
