const fs = require("fs");
const Json2csvParser = require('json2csv').Parser;

module.exports = ({ fields, data, path }) => {
  const promise = new Promise((resolve, reject) => {
    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(data);

    fs.writeFile(path, csv, function(err){
        if(err)  {
          reject();

          return;
        }
        resolve();
    });
  });

  return promise;
}
