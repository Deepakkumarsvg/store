import * as XLSX from 'xlsx';

export const exportToExcel = ({ rows, fileName = 'export', sheetName = 'Sheet1' }) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
  return true;
};
