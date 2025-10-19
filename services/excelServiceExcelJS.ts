import ExcelJS from 'exceljs';

type Replacements = Record<string, string | number>;

export async function generateFromTemplateExcelJS(
  templatePath: string,
  replacements: Replacements,
  outFilename?: string,
  options?: { logoPath?: string; logoRange?: string } // logoRange ex: 'A1:C4' or object
) {
  const res = await fetch(encodeURI(templatePath));
  if (!res.ok) throw new Error('Template not found: ' + templatePath);
  const arrayBuffer = await res.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  const ws = workbook.worksheets[0];

  // Replace cell values while preserving styles
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
          if (!Number.isNaN(d.getTime())) {
            cell.value = d;
          } else {
            cell.value = str;
          }
        } else {
          cell.value = str;
        }
      }
    } catch (err) {
      // ignore invalid addresses
      // console.warn('Invalid cell', cellAddr, err);
    }
  });

  // Optionally add logo (ExcelJS in browser requires base64)
  if (options?.logoPath) {
    try {
      const logoRes = await fetch(encodeURI(options.logoPath));
      if (logoRes.ok) {
        const blob = await logoRes.blob();
        const arrayBuf = await blob.arrayBuffer();
        const extMatch = (options.logoPath.match(/\.(png|jpe?g|gif)$/i) || [])[1] || 'png';
        const bytes = new Uint8Array(arrayBuf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        const base64 = btoa(binary);
        const imageId = workbook.addImage({
          base64: `data:image/${extMatch === 'jpg' ? 'jpeg' : extMatch};base64,${base64}`,
          extension: extMatch === 'jpg' ? 'jpeg' : extMatch,
        });

        if (typeof options.logoRange === 'string') {
          ws.addImage(imageId, options.logoRange);
        } else {
          ws.addImage(imageId, 'A1:C4');
        }
      }
    } catch (err) {
      // ignore logo errors
    }
  }

  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = outFilename ?? `report_${new Date().toISOString().slice(0,10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}