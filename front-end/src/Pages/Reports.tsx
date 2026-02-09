import type{ FC } from "react";
import "./Reports.css";

const Reports: FC = () => {
  return (
    <div className="reports-page">

      {/* HEADER */}
      <div className="reports-header">
        <div>
          <p className="breadcrumb">Dashboard / Reports</p>
          <h2>Reports</h2>
        </div>

        <div className="report-actions">
          <button className="btn-outline">Export PDF</button>
          <button className="btn-primary">Export Excel</button>
        </div>
      </div>

      {/* TABS */}
      <div className="report-tabs">
        <button className="tab active">Employee</button>
        <button className="tab">Attendance</button>
        <button className="tab">Payroll</button>
      </div>

      {/* SUMMARY CARDS (EMPTY UI) */}
      <div className="report-cards">
        <div className="report-card">
          <p>Total Employees</p>
          <h3>—</h3>
        </div>

        <div className="report-card">
          <p>Present Today</p>
          <h3>—</h3>
        </div>

        <div className="report-card">
          <p>On Leave</p>
          <h3>—</h3>
        </div>
      </div>

      {/* TABLE (NO DATA) */}
      <div className="report-table-card">
        <h3>Employee Attendance Report</h3>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Status</th>
              <th>Working Days</th>
              <th>Leaves</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={5} className="empty-state">
                No report data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Reports;