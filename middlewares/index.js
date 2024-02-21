// const fs = require("fs");
const { Reset, FgGreen, FgYellow, FgMagenta, FgCyan } = require("../colors");

function logReqRes(file_name) {
  var mydate = new Date(Date.now());
  var str_date = `${mydate.getDate()}/${
    mydate.getMonth() + 1
  }/${mydate.getFullYear()} ${mydate.toLocaleTimeString()}`;

  return (req, res, next) => {
    // fs.appendFile(
    //   file_name,
    //   `\n[${str_date}] \t[${req.ip}] \t[${req.method}] \t[${req.path}]`,
    //   (err) => next()
    // );
    console.log(
      `${
        req.method === "GET"
          ? FgGreen
          : req.method === "POST"
          ? FgYellow
          : req.method === "DELETE"
          ? FgMagenta
          : FgCyan
      }%s${Reset}`,
      `\n[${req.method}] \t[${str_date}] \t[${req.ip}] \t[${req.path}]`
    );
    next();
  };
}
module.exports = { logReqRes };
