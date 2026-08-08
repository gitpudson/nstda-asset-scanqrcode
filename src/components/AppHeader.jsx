import "../styles/app-header.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function AppHeader() {
  return (
    <div className="header">

      <div className="circle left"></div>
      <div className="circle right"></div>
      <div className="budget-chip">
        <h3>ระบบตรวจสอบครุภัณฑ์</h3>
      </div>

      <div className="budget-chip1">
        <CalendarMonthIcon fontSize="small" />
        <span>{`สวทช. ปีงบประมาณ ${new Date().getFullYear() + 543}`}</span>
      </div>
    </div>
  );
}