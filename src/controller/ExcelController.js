const ExcelService = require("../services/ExcelService");

exports.downloadExcel = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;
    const userId = req.user.userId;

    const excelBuffer = await ExcelService.downloadStudentExcel({
      fromDate,
      toDate,
      userId,
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="students_${fromDate}_to_${toDate}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(excelBuffer);
  } catch (err) {
    next(err);
  }
};
