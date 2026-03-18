const getPagination = (req, defaultLimit = 50, maxLimit = 200) => {
  const parsedPage = Number.parseInt(req.query.page, 10);
  const parsedLimit = Number.parseInt(req.query.limit, 10);

  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const limit = Number.isNaN(parsedLimit) || parsedLimit < 1
    ? defaultLimit
    : Math.min(parsedLimit, maxLimit);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});

module.exports = {
  getPagination,
  buildPagination,
};
