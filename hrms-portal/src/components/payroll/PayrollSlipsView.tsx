import React, { useState } from 'react';
import { HrmsUser, PayslipRecord } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { PayslipModal } from '../ess/PayslipModal';
import { printOrDownloadHtml } from '../../utils/printUtils';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Receipt, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface PayrollSlipsViewProps {
  currentUser: HrmsUser;
}

export const PayrollSlipsView: React.FC<PayrollSlipsViewProps> = ({ currentUser }) => {
  const [payslips, setPayslips] = useState<PayslipRecord[]>(() => HrmsService.getPayslips());
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);

  // Salary Slip selectors
  const [salaryYear, setSalaryYear] = useState<number>(2026);
  const [salaryMonth, setSalaryMonth] = useState<string>('September 2026');

  // Reimbursement Slip selectors
  const [reimbYear, setReimbYear] = useState<number>(2026);
  const [reimbMonth, setReimbMonth] = useState<string>('September 2026');

  // Form 16 selector
  const [form16AY, setForm16AY] = useState<string>('AY 2026-27 (FY 2025-26)');

  const [notification, setNotification] = useState<string | null>(null);

  // Find matching user payslip
  const userPayslips = payslips.filter(p => p.employeeId === currentUser.id || p.employeeCode === currentUser.employeeCode);
  const currentSlip = userPayslips.find(p => p.month === salaryMonth) || userPayslips[0];

  const handleDownloadAll = () => {
    if (!currentSlip) return;
    const content = `
      <div class="header">
        <div>
          <h1 class="title">NEW LIFE CARE LABORATORIES PVT. LTD.</h1>
          <div class="subtitle">Registered Office: Silchar, Assam 788001 | Central Workforce & Payroll System</div>
        </div>
        <div class="tag">ANNUAL PAYSLIPS SUMMARY: FY 2026-27</div>
      </div>
      <div class="grid">
        <div class="grid-item"><label>Employee Name</label><value>${currentUser.name}</value></div>
        <div class="grid-item"><label>Employee Code</label><value>${currentUser.employeeCode}</value></div>
        <div class="grid-item"><label>Designation</label><value>${currentUser.designation}</value></div>
        <div class="grid-item"><label>Department</label><value>${currentUser.department}</value></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Payable Days</th>
            <th class="text-right">Gross Earnings</th>
            <th class="text-right">Total Deductions</th>
            <th class="text-right">Net Credited</th>
          </tr>
        </thead>
        <tbody>
          ${['October 2026', 'September 2026', 'August 2026', 'July 2026', 'June 2026', 'May 2026'].map(m => `
            <tr>
              <td><strong>${m}</strong></td>
              <td>${currentSlip.presentDays + currentSlip.paidLeaveDays} / ${currentSlip.totalWorkingDays}</td>
              <td class="text-right">₹${currentSlip.earnings.grossEarnings.toLocaleString('en-IN')}</td>
              <td class="text-right">₹${currentSlip.deductions.totalDeductions.toLocaleString('en-IN')}</td>
              <td class="text-right"><strong>₹${currentSlip.netPay.toLocaleString('en-IN')}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="total-box">
        <span>Cumulative Net Disbursed (FY 2026-27)</span>
        <span style="color: #047857;">₹${(currentSlip.netPay * 6).toLocaleString('en-IN')}</span>
      </div>
    `;
    printOrDownloadHtml(`Annual_Payslips_${currentUser.employeeCode}`, content);
  };

  const handleRunPayroll = () => {
    const updated = HrmsService.runMonthlyPayroll('October 2026', 2026);
    setPayslips(updated);
    setSalaryMonth('October 2026');
    setNotification('October 2026 Payroll calculated and disbursed successfully!');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownloadSlip = () => {
    if (!currentSlip) return;
    const content = `
      <div class="header">
        <div>
          <h1 class="title">NEW LIFE CARE LABORATORIES PVT. LTD.</h1>
          <div class="subtitle">Registered Office: Silchar, Assam 788001 | Central Workforce & Payroll System</div>
        </div>
        <div class="tag">SALARY SLIP: ${currentSlip.month.toUpperCase()}</div>
      </div>
      <div class="grid">
        <div class="grid-item"><label>Employee Name</label><value>${currentSlip.employeeName}</value></div>
        <div class="grid-item"><label>Employee Code</label><value>${currentSlip.employeeCode}</value></div>
        <div class="grid-item"><label>Designation</label><value>${currentSlip.designation}</value></div>
        <div class="grid-item"><label>Department</label><value>${currentSlip.department}</value></div>
        <div class="grid-item"><label>Bank Account</label><value>${currentSlip.bankName} - ${currentSlip.bankAccount}</value></div>
        <div class="grid-item"><label>PAN Card</label><value>${currentSlip.panNumber}</value></div>
        <div class="grid-item"><label>EPFO UAN</label><value>${currentSlip.uanNumber}</value></div>
        <div class="grid-item"><label>Payable Days</label><value>${currentSlip.presentDays + currentSlip.paidLeaveDays} / ${currentSlip.totalWorkingDays} Days</value></div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <table>
            <thead><tr><th>Earnings Component</th><th class="text-right">Amount (₹)</th></tr></thead>
            <tbody>
              <tr><td>Basic Salary</td><td class="text-right">₹${currentSlip.earnings.basic.toLocaleString('en-IN')}</td></tr>
              <tr><td>House Rent Allowance (HRA)</td><td class="text-right">₹${currentSlip.earnings.hra.toLocaleString('en-IN')}</td></tr>
              <tr><td>Conveyance & Medical</td><td class="text-right">₹${currentSlip.earnings.conveyance.toLocaleString('en-IN')}</td></tr>
              <tr><td>Special Allowance</td><td class="text-right">₹${currentSlip.earnings.specialAllowance.toLocaleString('en-IN')}</td></tr>
              <tr style="font-weight: bold; background: #f8fafc;"><td>Gross Earnings</td><td class="text-right">₹${currentSlip.earnings.grossEarnings.toLocaleString('en-IN')}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <table>
            <thead><tr><th>Deductions Component</th><th class="text-right">Amount (₹)</th></tr></thead>
            <tbody>
              <tr><td>Provident Fund (EPF - 12%)</td><td class="text-right">₹${currentSlip.deductions.epfEmployee.toLocaleString('en-IN')}</td></tr>
              <tr><td>ESIC Contribution</td><td class="text-right">₹${currentSlip.deductions.esicEmployee.toLocaleString('en-IN')}</td></tr>
              <tr><td>Professional Tax (PT)</td><td class="text-right">₹${currentSlip.deductions.professionalTax.toLocaleString('en-IN')}</td></tr>
              <tr><td>Tax Deducted at Source (TDS)</td><td class="text-right">₹${currentSlip.deductions.tds.toLocaleString('en-IN')}</td></tr>
              <tr style="font-weight: bold; background: #f8fafc;"><td>Total Deductions</td><td class="text-right" style="color: #e11d48;">₹${currentSlip.deductions.totalDeductions.toLocaleString('en-IN')}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="total-box">
        <span>Net Salary Transferred to Bank</span>
        <span style="color: #047857; font-size: 18px;">₹${currentSlip.netPay.toLocaleString('en-IN')}</span>
      </div>
    `;
    printOrDownloadHtml(`Payslip_${currentSlip.employeeCode}_${currentSlip.month.replace(/\s+/g, '_')}`, content);
  };

  const handleDownloadReimbursement = () => {
    const content = `
      <div class="header">
        <div>
          <h1 class="title">NEW LIFE CARE LABORATORIES PVT. LTD.</h1>
          <div class="subtitle">Registered Office: Silchar, Assam 788001 | Expense Reimbursement Voucher</div>
        </div>
        <div class="tag">REIMBURSEMENT VOUCHER: ${reimbMonth.toUpperCase()}</div>
      </div>
      <div class="grid">
        <div class="grid-item"><label>Employee Name</label><value>${currentUser.name}</value></div>
        <div class="grid-item"><label>Employee Code</label><value>${currentUser.employeeCode}</value></div>
        <div class="grid-item"><label>Disbursement Type</label><value>NEFT / Direct Account Credit</value></div>
        <div class="grid-item"><label>Status</label><value style="color: #047857;">VERIFIED & DISBURSED</value></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Expense Category</th>
            <th>Description & Audit Trail</th>
            <th class="text-right">Claim Amount</th>
            <th class="text-right">Approved Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Field Travel & Fuel</strong></td>
            <td>Doctor & Chemist clinic coverage beat visits (GPS Validated)</td>
            <td class="text-right">₹4,200</td>
            <td class="text-right"><strong>₹4,200</strong></td>
          </tr>
          <tr>
            <td><strong>Daily Working Allowance (DA)</strong></td>
            <td>Outstation HQ & regional tour allowances</td>
            <td class="text-right">₹2,800</td>
            <td class="text-right"><strong>₹2,800</strong></td>
          </tr>
          <tr>
            <td><strong>Client & Chemist Coordination</strong></td>
            <td>Phone, postage, and client working expenses</td>
            <td class="text-right">₹1,750</td>
            <td class="text-right"><strong>₹1,750</strong></td>
          </tr>
        </tbody>
      </table>
      <div class="total-box">
        <span>Total Reimbursement Credited</span>
        <span style="color: #047857; font-size: 18px;">₹8,750</span>
      </div>
    `;
    printOrDownloadHtml(`Reimbursement_Voucher_${currentUser.employeeCode}_${reimbMonth.replace(/\s+/g, '_')}`, content);
  };

  const handleDownloadForm16 = (part: 'A' | 'B') => {
    const content = `
      <div class="header">
        <div>
          <h1 class="title">NEW LIFE CARE LABORATORIES PVT. LTD.</h1>
          <div class="subtitle">Tax Deduction at Source Certificate under Section 203 of the Income-tax Act, 1961</div>
        </div>
        <div class="tag">FORM NO. 16 - PART ${part} (${form16AY})</div>
      </div>
      <div class="grid">
        <div class="grid-item"><label>Employee Name</label><value>${currentUser.name}</value></div>
        <div class="grid-item"><label>PAN of Employee</label><value>${currentSlip?.panNumber || 'ABCPA4820K'}</value></div>
        <div class="grid-item"><label>Employer TAN</label><value>BLRA12345E</value></div>
        <div class="grid-item"><label>Assessment Year</label><value>${form16AY}</value></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Quarter</th>
            <th>Receipt / Challan Number</th>
            <th class="text-right">Amount Paid / Credited</th>
            <th class="text-right">Amount of Tax Deducted</th>
            <th class="text-right">Amount of Tax Deposited</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q1 (Apr - Jun)</td>
            <td>CHLN-2026-90812</td>
            <td class="text-right">₹1,80,000</td>
            <td class="text-right">₹14,400</td>
            <td class="text-right"><strong>₹14,400</strong></td>
          </tr>
          <tr>
            <td>Q2 (Jul - Sep)</td>
            <td>CHLN-2026-94301</td>
            <td class="text-right">₹1,80,000</td>
            <td class="text-right">₹14,400</td>
            <td class="text-right"><strong>₹14,400</strong></td>
          </tr>
          <tr>
            <td>Q3 (Oct - Dec)</td>
            <td>CHLN-2026-98214</td>
            <td class="text-right">₹1,80,000</td>
            <td class="text-right">₹14,400</td>
            <td class="text-right"><strong>₹14,400</strong></td>
          </tr>
          <tr>
            <td>Q4 (Jan - Mar)</td>
            <td>CHLN-2027-10294</td>
            <td class="text-right">₹1,80,000</td>
            <td class="text-right">₹14,400</td>
            <td class="text-right"><strong>₹14,400</strong></td>
          </tr>
        </tbody>
      </table>
      <div class="total-box">
        <span>Total TDS Deposited in Central Govt. Account</span>
        <span style="color: #047857; font-size: 18px;">₹57,600</span>
      </div>
    `;
    printOrDownloadHtml(`Form16_Part_${part}_${currentUser.employeeCode}`, content);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-500 hover:text-emerald-700">
            &times;
          </button>
        </div>
      )}

      {/* Top Header Card (Darwinbox Screen 5: "My Slips" + "Download All") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            My Slips & Tax Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository for statutory salary payslips, reimbursement summaries, and Form 16
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunPayroll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all border border-amber-200 cursor-pointer shadow-2xs"
            title="Generate October 2026 Payroll"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Run Oct 2026 Payroll
          </button>

          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#E0E7FF] text-[#3730A3] hover:bg-[#C7D2FE] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Download className="w-4 h-4 text-[#4F46E5]" />
            Download All
          </button>
        </div>
      </div>

      {/* Tri-Fold Document Hub (Darwinbox Screen 5) */}
      <div className="space-y-4">
        
        {/* 1. Salary Slip Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Salary Slip</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Statutory EPF & ESIC Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Monthly computation of Basic, HRA, Allowances, PF deduction (12%), Professional Tax (₹200), and Net Credit.
                </p>
                {currentSlip && (
                  <div className="mt-2 text-xs font-mono text-slate-700 flex items-center gap-3">
                    <span>Gross: <strong className="text-slate-900">₹{currentSlip.earnings.grossEarnings.toLocaleString('en-IN')}</strong></span>
                    <span>•</span>
                    <span>Deductions: <strong className="text-rose-600">₹{currentSlip.deductions.totalDeductions.toLocaleString('en-IN')}</strong></span>
                    <span>•</span>
                    <span>Net Pay: <strong className="text-emerald-700 font-black">₹{currentSlip.netPay.toLocaleString('en-IN')}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Selectors & Actions */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {/* Year Dropdown */}
              <select
                value={salaryYear}
                onChange={e => setSalaryYear(Number(e.target.value))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>

              {/* Month Dropdown */}
              <select
                value={salaryMonth}
                onChange={e => setSalaryMonth(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
                <option value="May 2026">May 2026</option>
              </select>

              {/* View Action */}
              <button
                onClick={() => {
                  if (currentSlip) setSelectedPayslip(currentSlip);
                }}
                title="View Payslip"
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Download Action */}
              <button
                onClick={handleDownloadSlip}
                title="Download / Print Payslip PDF"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* 2. Reimbursement Slip Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Reimbursement Slip</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                    Direct Account Credit
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Summary statement of non-taxable expense disbursements including business travel, client meals, and fuel allowance.
                </p>
                <div className="mt-2 text-xs font-mono text-slate-700 flex items-center gap-3">
                  <span>Approved Claims: <strong className="text-emerald-700">₹8,750</strong></span>
                  <span>•</span>
                  <span>Disbursement Date: <strong className="text-slate-800">01 Oct 2026 via NEFT</strong></span>
                </div>
              </div>
            </div>

            {/* Right Selectors & Actions */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <select
                value={reimbYear}
                onChange={e => setReimbYear(Number(e.target.value))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>

              <select
                value={reimbMonth}
                onChange={e => setReimbMonth(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
              </select>

              <button
                onClick={() => {
                  setNotification('Displaying approved reimbursement statement for September 2026 (₹8,750)...');
                  setTimeout(() => setNotification(null), 4000);
                }}
                title="View Reimbursement Summary"
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadReimbursement}
                title="Download Reimbursement Slip"
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* 3. Form 16 (Tax Deduction Certificate) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Form 16 (TDS Certificate)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    TRACES Digitally Signed
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Certificate under Section 203 of the Income-tax Act, 1961 for tax deducted at source on salary by the employer.
                </p>
                <div className="mt-2 text-xs font-mono text-slate-700 flex items-center gap-3">
                  <span>PAN: <strong className="text-slate-900">ABCPA4820K</strong></span>
                  <span>•</span>
                  <span>TAN: <strong className="text-slate-900">BLRA12345E</strong></span>
                  <span>•</span>
                  <span>Total TDS Deposited: <strong className="text-indigo-700">₹57,600</strong></span>
                </div>
              </div>
            </div>

            {/* Right Form 16 Downloads */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <select
                value={form16AY}
                onChange={e => setForm16AY(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="AY 2026-27 (FY 2025-26)">AY 2026-27 (FY 2025-26)</option>
                <option value="AY 2025-26 (FY 2024-25)">AY 2025-26 (FY 2024-25)</option>
              </select>

              <button
                onClick={() => handleDownloadForm16('A')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Part A
              </button>

              <button
                onClick={() => handleDownloadForm16('B')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                Part B
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Printable / Viewable Official Payslip Modal */}
      {selectedPayslip && (
        <PayslipModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}

    </div>
  );
};
