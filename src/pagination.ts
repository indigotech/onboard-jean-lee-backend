export function createPageInfo(limit = 10, page = 1, count) {
  const offset = page ? (page - 1) * limit : 0;

  return {
    limit,
    offset,
    page,
    totalPages: Math.ceil(count / limit),
    hasNextPage: count > offset + limit,
    hasPreviousPage: page > 1,
  };
}
