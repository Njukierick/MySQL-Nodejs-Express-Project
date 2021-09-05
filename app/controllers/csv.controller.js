exports.uploadFile = (req, res) => {
  try {
    const customers = [];
    fs.createReadstream(__basedir + "/uploads/" + req.file.filename)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        console.log(error);
        throw error.message;
      })
      .on("data", (row) => {
        customers.push(row);
        console.log(row);
      })
      .on("end", () => {
        // save customers to Mysql database
        Customer.bulkcreate(customers).then(() => {
          const result = {
            status: "ok",
            filename: req.file.originalname,
            message: "upload successfully",
          };
          res.json(result);
        });
      });
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "upload Error! message -" + error.message,
    };
    res.json(result);
  }
};

exports.uploadFile = async (req, res) => {
  const messages = [];

  for (const file of req.files) {
    try {
      //parsing csv files to data array objects
      const csvParserStream = fs
        .createReadstream(__basedir + "/upload/" + file.filename)
        .pipe(csv.parse({ headers: true }));

      var end = new Promise(function (resolve, reject) {
        let customers = [];

        csvParserStream.on("data", (object) => {
          customers.push(object);
          console.log(object);
        });
        csvParserStream.on("end", () => {
          resolve(customers);
        });
        csvParserStream.on("error", (error) => {
          console.log(error);
          reject;
        });
      });

      await (async function () {
        let customers = await end;

        //save customers to MySQL/PostgreSQL database
        await customer.bulkCreate(customers).then(() => {
          const result = {
            status: "ok",
            filename: file.originalname,
            message: "upload successfully",
          };
          messages.push(result);
        });
      })();
    } catch (error) {
      console.log(error);

      const result = {
        status: "fail",
        filname: file.originalname,
        message: "Error ->" + error.message,
      };
      messages.push(result);
    }
  }

  return res.json(messages);
};
