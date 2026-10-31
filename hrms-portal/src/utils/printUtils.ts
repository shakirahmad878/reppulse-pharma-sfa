// Utility to print/download any HTML element or dedicated document layout
export function printOrDownloadHtml(title: string, htmlContent: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Please allow popups to download or print this document.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; font-size: 13px; line-height: 1.5; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 20px; font-weight: 900; color: #0f172a; margin: 0; }
          .subtitle { font-size: 11px; color: #64748b; margin-top: 2px; }
          .tag { display: inline-block; padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 700; font-size: 12px; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 20px; }
          .grid-item label { display: block; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 2px; }
          .grid-item value { display: block; font-size: 12px; font-weight: 700; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f1f5f9; text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
          td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          .text-right { text-align: right; }
          .total-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 15px; font-weight: 900; margin-top: 15px; }
          .footer-note { font-size: 10px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          .btn-bar { background: #0f172a; color: white; padding: 10px 16px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .btn { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }
          @media print {
            .btn-bar { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="btn-bar">
            <span>Official Document Ready to Download / Print</span>
            <button class="btn" onclick="window.print()">Print / Save as PDF</button>
          </div>
          ${htmlContent}
          <div class="footer-note">
            This is a computer generated statutory document issued by New Life Care Laboratories Pvt. Ltd. No physical signature required.
          </div>
        </div>
        <script>
          setTimeout(() => { window.print(); }, 400);
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
