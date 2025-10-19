import ExcelJS from 'exceljs';

type Replacements = Record<string, string | number>;

export async function generateFromTemplate(
  templatePath: string,
  replacements: Replacements,
  outFilename?: string
) {
  const res = await fetch(encodeURI(templatePath));
  if (!res.ok) throw new Error('Template not found: ' + templatePath);
  const arrayBuffer = await res.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  const ws = workbook.worksheets[0];

  // Remplace uniquement .value pour préserver les styles
  Object.entries(replacements).forEach(([cellAddr, value]) => {
    try {
      const cell = ws.getCell(cellAddr);
      if (value === null || value === undefined || value === '') {
        cell.value = '';
      } else if (typeof value === 'number') {
        cell.value = value;
      } else {
        const str = String(value);
        const isoDate = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
        if (isoDate.test(str)) {
          const d = new Date(str);
          cell.value = Number.isNaN(d.getTime()) ? str : d;
        } else {
          cell.value = str;
        }
      }
    } catch {
      // ignore les adresses de cellules invalides
    }
  });

  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = outFilename ?? `report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}