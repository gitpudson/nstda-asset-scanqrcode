import "../styles/app-header.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function AppHeader() {
  return (
    <div className="header">
      
      <div className="budget-chip">
        <h2>ระบบตรวจสอบครุภัณฑ์</h2>
      </div>

      <div className="budget-chip1">
        <CalendarMonthIcon fontSize="small" />
        <span>{`สวทช. ปีงบประมาณ ${new Date().getFullYear() + 543}`}</span>
      </div>
    </div>
  );
}