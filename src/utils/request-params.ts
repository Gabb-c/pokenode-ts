export const getListRequestParams = (offset = 0, limit = 20): URLSearchParams => {
  return new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
};
