exports.created = (student) => ({
  message: "Student created successfully",
  data: student,
});

exports.listWithPagination = (rows, count, page, limit) => ({
  records: rows,
  pagination: {
    totalRecords: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    limit,
  },
});
