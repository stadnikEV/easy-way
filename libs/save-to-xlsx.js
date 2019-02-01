
const excel = require('excel4node');

module.exports = ({ path, fields, data }) => {
  const promise = new Promise((resolve, reject) => {
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('Sheet 1');

    fields.forEach((col, index) => {
      worksheet.cell(1, index + 1).string(col);
    })

    data.forEach((row, indexRow) => {
      fields.forEach((field, indexCol) => {
        let value = data[indexRow][field];
        if (!value) {
          value = '';
        }
        worksheet.cell(indexRow + 2, indexCol + 1).string(value.toString());
      });
    })

    workbook.write(path, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    })
  });

  return promise;
};
