import * as XLSX from "xlsx";

export const formatDate = (date) => {
  const pad = (num, size) => num.toString().padStart(size, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1, 2);
  const day = pad(date.getDate(), 2);
  
  return `${year}-${month}-${day}`;
};

export const uploadLastPays = (data = [], square, date) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, square);
  
  XLSX.writeFile(workbook, `${square} - ${formatDate(new Date(date))}.xlsx`);
};