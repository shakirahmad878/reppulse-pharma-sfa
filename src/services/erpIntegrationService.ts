/**
 * SefMed Distributor ERP Connector
 * Formats POB Secondary Sales Orders into Tally Prime XML and Marg ERP 9+ format.
 */

import { POBOrder } from '../types';

export class ERPIntegrationService {
  /**
   * Generates standard Tally Prime Sales Order XML format.
   */
  public static exportToTallyXML(order: POBOrder): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="Sales Order" ACTION="Create">
            <DATE>${order.orderDate.replace(/-/g, '')}</DATE>
            <VOUCHERTYPENAME>Sales Order</VOUCHERTYPENAME>
            <VOUCHERNUMBER>${order.orderNumber}</VOUCHERNUMBER>
            <PARTYLEDGERNAME>${order.buyerName}</PARTYLEDGERNAME>
            <BASICBUYERNAME>${order.buyerName}</BASICBUYERNAME>
            <NARRATION>POB booked by MR ${order.userName} via SefMed Pharma SFA (${order.territoryName})</NARRATION>
            <ALLINVENTORYENTRIES.LIST>
              ${order.items
                .map(
                  item => `
              <STOCKITEMNAME>${item.productName}</STOCKITEMNAME>
              <RATE>${item.rate} / ${item.packSize}</RATE>
              <ACTUALQTY>${item.quantity} (${item.freeQuantity} Free)</ACTUALQTY>
              <BILLEDQTY>${item.quantity}</BILLEDQTY>
              <AMOUNT>-${item.totalAmount.toFixed(2)}</AMOUNT>
              `
                )
                .join('')}
            </ALLINVENTORYENTRIES.LIST>
            <LEDGERENTRIES.LIST>
              <LEDGERNAME>Output GST 12%</LEDGERNAME>
              <AMOUNT>-${order.gstAmount.toFixed(2)}</AMOUNT>
            </LEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
    return xml.trim();
  }

  /**
   * Generates Marg ERP 9+ CSV / Fixed Width format.
   */
  public static exportToMargCSV(order: POBOrder): string {
    const headers = 'OrderNo,Date,BuyerName,Territory,ProductCode,ProductName,PackSize,Qty,FreeQty,Rate,Amount,GSTAmount,GrandTotal\n';
    const rows = order.items
      .map(
        item =>
          `"${order.orderNumber}","${order.orderDate}","${order.buyerName}","${order.territoryName}","${item.productId}","${item.productName}","${item.packSize}",${item.quantity},${item.freeQuantity || 0},${item.rate},${item.totalAmount.toFixed(2)},${order.gstAmount.toFixed(2)},${order.grandTotal.toFixed(2)}`
      )
      .join('\n');
    return headers + rows;
  }

  /**
   * Triggers a browser download for ERP export file.
   */
  public static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
