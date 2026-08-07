import AppHeader from "../components/AppHeader";
import ScannerView from "../components/ScannerView";
import "../styles/scanner-page.css";

export default function ScannerPage() {
  return (
    <div className="mobile-container">
      {/* <AppHeader /> */}
      <ScannerView />
    </div>
  );
}