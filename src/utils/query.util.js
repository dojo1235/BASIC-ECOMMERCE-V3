/**
 * Build dynamic WHERE clause compatible with older MariaDB
 */
export const buildFilters = (search, filters = {}, tableAlias = '') => {
  let clauses = [];
  const params = [];
  const prefix = tableAlias ? `${tableAlias}.` : '';
  if (search) {
  clauses.push(`(${prefix}name LIKE ? OR ${prefix}email LIKE ?)`);
  params.push(`%${search}%`, `%${search}%`);
  }
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      clauses.push(`${prefix}${key} = ?`);
      params.push(value);
    }
  }
  const where = clauses.length > 0 ? 'WHERE ' + clauses.join(' AND ') : '';
  return { where, params };
};

/**
 * Pagination (page instead of limit/offset)
 */ 
export const getPagination = (page = 1, pageSize = 20) => {
  const _page = Number.parseInt(page, 10);
  const _pageSize = Number.parseInt(pageSize, 10);
  const safePage = Number.isNaN(_page) ? 1 : _page;
  const safePageSize = Number.isNaN(_pageSize) ? 20 : _pageSize;
  const limit = safePageSize;
  const offset = (safePage - 1) * safePageSize;
  return { limit, offset };
};