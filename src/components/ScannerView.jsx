import { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CropFreeIcon from "@mui/icons-material/CropFree";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";

import Html5Scanner from "./Html5Scanner";
import { assets } from "../assets/assets";

import "../styles/scanner-view.css";
import AssetResultCard from "./AssetResultCard";

export default function ScannerView() {
    const [cameraOn, setCameraOn] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [assetData, setAssetData] = useState(null);

    const handleStartScan = () => {
        setCameraOn(true);
    };

    const handleResetScan = () => {
        setScanResult(null);
        setCameraOn(true); //ถ้าต้องการให้กด "สแกนใหม่" แล้วเปิดกล้องต่อทันที true
    };

    const handleToggleCamera = () => {
        if (cameraOn) {
            // กำลังปิดกล้อง
            setScanResult(null);
            setCameraOn(false);
        } else {
            // กำลังเปิดกล้อง
            setCameraOn(true);
        }
    };

    return (
        <>
            {!scanResult && (
                <>
                    <div className="scanner-card">
                        <div className="camera-area">

                            {cameraOn && (
                                <Html5Scanner
                                    onScanSuccess={(result) => {
                                        setScanResult(result);
                                        setCameraOn(false);
                                    }}
                                />
                            )}

                            <button
                                className={`flash-btn ${cameraOn ? "camera-close" : "camera-open"}`}
                                onClick={handleToggleCamera}
                            >
                                {cameraOn ? <CloseIcon /> : <CameraAltIcon />}
                            </button>


                            <div className="scan-frame">

                                <div className="corner tl"></div>
                                <div className="corner tr"></div>
                                <div className="corner bl"></div>
                                <div className="corner br"></div>

                                {!cameraOn && (
                                    <img
                                        src={assets.qrcode}
                                        alt="QR Code"
                                        className="sample-qr" />
                                )

                                }

                                {cameraOn && (
                                    <div className="laser"></div>
                                )}

                            </div>

                            <div className="scan-text">
                                SMR@NECTEC
                            </div>

                        </div>

                        <div className="scanner-status">

                            {scanResult && (
                                <div className="result-card">
                                    <h3>ผลการสแกน</h3>

                                    <p>{scanResult}</p>

                                    <button
                                        className="rescan-btn"
                                        onClick={handleResetScan}
                                    >
                                        สแกนใหม่
                                    </button>
                                </div>
                            )}

                            {/* <div className="status-icon">
                    <CropFreeIcon />
                </div> */}

                            <h2>
                                {cameraOn ? "พร้อมสแกน" : "เริ่มสแกน"}
                            </h2>

                            {/* <p>
                    {cameraOn
                        ? "วาง QR Code หรือ Barcode ให้อยู่ในกรอบ"
                        : "แตะปุ่มด้านบนเพื่อเปิดกล้อง"}
                </p> */}
                            <p>
                                {cameraOn
                                    ? "กดปุ่ม X เพื่อปิดกล้อง"
                                    : "แตะปุ่มกล้องเพื่อเริ่มสแกน"}
                            </p>

                        </div>
                    </div>
                </>

            )}

            {scanResult && (<AssetResultCard qrcode={scanResult} />)}


        </>


    );
}