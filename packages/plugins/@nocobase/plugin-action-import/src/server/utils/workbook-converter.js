import * as XLSX from 'xlsx';
export class WorkbookConverter {
  /**
   * Convert ExcelJS Workbook to XLSX Workbook
   */
  static async excelJSToXLSX(workbook) {
    // Convert ExcelJS workbook to buffer in memory
    const buffer = await workbook.xlsx.writeBuffer();
    // Convert buffer to XLSX workbook
    return XLSX.read(buffer, { type: 'buffer' });
  }
}
//# sourceMappingURL=workbook-converter.js.map
