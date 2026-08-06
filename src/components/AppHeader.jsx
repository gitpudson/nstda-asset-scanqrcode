import "../styles/app-header.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function AppHeader() {
  return (
    <div className="header">
      <h1>ระบบตรวจสอบครุภัณฑ์ V.01</h1>

      <div className="budget-chip">
        <CalendarMonthIcon fontSize="small" />
        <span>สวทช. ปีงบประมาณ 2569</span>
      </div>
    </div>
  );
}