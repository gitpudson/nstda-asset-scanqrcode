import { useState, useContext } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CropFreeIcon from "@mui/icons-material/CropFree";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import Html5Scanner from "./Html5Scanner";
import { assets } from "../assets/assets";

import "../styles/scanner-view.css";
import "../styles/asset-result.css";
import AssetResultCard from "./AssetResultCard";
import AppHeader from "./AppHeader";
import { AppContext } from "../context/AppContext";

import {
    Box,
    Card,
    Typography,
    TextField,
    MenuItem,
    Stack,
    Button,
    IconButton,
    Paper,
    Chip
} from "@mui/material";

export default function ScannerView() {
    const { fetAssetBySearchKey, isLoading } = useContext(AppContext);
    const [cameraOn, setCameraOn] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [assetData, setAssetData] = useState(null);

    const [personKey, setPersonKey] =
        useState("");

    const [assetSuffix, setAssetSuffix] =
        useState("");

    const [searchResults, setSearchResults] =
        useState([]);

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

    const handleSearchAsset =
        async () => {

            if (!personKey) {

                alert(
                    "กรุณาระบุรหัสพนักงาน"
                );

                return;

            }

            try {

                const result =
                    await fetAssetBySearchKey(
                        personKey,
                        assetSuffix
                    );

                //--------------------------------
                // ไม่พบ
                //--------------------------------

                if (
                    !result ||
                    result.length === 0
                ) {

                    alert(
                        "ไม่พบรายการครุภัณฑ์"
                    );

                    return;

                }

                //--------------------------------
                // พบ 1 รายการ
                //--------------------------------

                if (
                    result.length === 1
                ) {

                    setScanResult(
                        result[0]
                            .asset_code
                    );

                    return;

                }

                //--------------------------------
                // พบหลายรายการ
                //--------------------------------

                // console.log(result);
                setSearchResults(
                    result
                );

                // TODO
                // แสดงตารางเลือกรายการ

            }

            catch (e) {

                console.error(e);

            }

        };

    return (
        <>
            {!scanResult && (
                <>
                    <AppHeader />

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

                            {!cameraOn
                                ? (
                                    <div className="scan-text">
                                        IIARG/SMR@NECTEC
                                    </div>
                                )
                                : <></>}

                            {/* <div className="scan-text">
                                SMR@NECTEC
                            </div> */}

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

                            <p>
                                {cameraOn
                                    ? "กดปุ่ม X เพื่อปิดกล้อง"
                                    : "แตะปุ่มกล้องเพื่อเริ่มสแกน"}
                            </p>

                            {/* //ค้นหาครุภัณฑ์ด้วยรหัสพนักงาน */}
                            <Box sx={{ mt: 2 }}>

                                <Typography
                                    className="label-search"
                                    sx={{
                                        mb: 2,
                                        color: "#E65100",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        textAlign: "center"
                                    }}
                                >
                                    หรือค้นหาด้วยรหัสพนักงาน
                                </Typography>

                                <Stack spacing={1}>

                                    <TextField
                                        fullWidth
                                        placeholder="รหัสพนักงาน 6 หลัก *"
                                        value={personKey}
                                        // บังคับให้กรอกเฉพาะตัวเลข
                                        onChange={(e) =>
                                            setPersonKey(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                    />

                                    <TextField
                                        fullWidth
                                        placeholder="เลขครุภัณฑ์ 5 ตัวท้าย (ไม่บังคับ)"
                                        value={assetSuffix}
                                        // บังคับให้กรอกเฉพาะตัวเลข
                                        onChange={(e) =>
                                            setAssetSuffix(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                    />

                                    <Button
                                        fullWidth
                                        startIcon={<SearchIcon />}
                                        variant="contained"
                                        onClick={handleSearchAsset}
                                        className="search-btn"
                                    >
                                        SEARCH
                                    </Button>

                                    {
                                        searchResults.length > 0 && (
                                            <Box sx={{ mt: 3 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        mb: 1,
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    ผลการค้นหา
                                                    ({searchResults.length} รายการ)
                                                </Typography>

                                                {
                                                    searchResults.map(
                                                        (item) => (
                                                            <Paper
                                                                key={
                                                                    item.row_number
                                                                }
                                                                sx={{
                                                                    p: 1,
                                                                    mb: 1,
                                                                    borderRadius: 2
                                                                }}
                                                            >

                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        gap: 1
                                                                    }}
                                                                >
                                                                    {
                                                                        <>
                                                                            <Box
                                                                                sx={{
                                                                                    flex: 1,
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    sx={{
                                                                                        fontWeight:
                                                                                            700
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        item.asset_code
                                                                                    }
                                                                                </Typography>

                                                                                <Typography
                                                                                    variant="body2"
                                                                                >
                                                                                    {
                                                                                        item.asset_name
                                                                                    }
                                                                                </Typography>

                                                                                <Box
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        flexDirection: "column",
                                                                                        alignItems: "center",
                                                                                        mt: 0.5
                                                                                    }}
                                                                                >
                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        color="text.secondary"
                                                                                        sx={{
                                                                                            fontWeight:
                                                                                                700
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            item.person_name
                                                                                        }
                                                                                    </Typography>

                                                                                    {

                                                                                        item.updated_at &&
                                                                                        String(item.updated_at).trim() !== "" && (

                                                                                            <Chip
                                                                                                label="ตรวจสอบแล้ว"
                                                                                                size="small"
                                                                                                sx={{
                                                                                                    mt: 0.5,
                                                                                                    backgroundColor: "#138000",
                                                                                                    color: "#fff",
                                                                                                    fontWeight: 700,
                                                                                                    height: 22,
                                                                                                    fontSize: "0.7rem"
                                                                                                }}
                                                                                            />

                                                                                        )
                                                                                    }

                                                                                    {

                                                                                        !item.updated_at &&
                                                                                        String(item.updated_at).trim() === "" && (

                                                                                            <Chip
                                                                                                label="ยังไม่ตรวจสอบ"
                                                                                                size="small"
                                                                                                sx={{
                                                                                                    mt: 0.5,
                                                                                                    backgroundColor: "#6B7280",
                                                                                                    color: "#fff",
                                                                                                    fontWeight: 700,
                                                                                                    height: 22,
                                                                                                    fontSize: "0.7rem"
                                                                                                }}
                                                                                            />

                                                                                        )
                                                                                    }
                                                                                </Box>


                                                                            </Box>

                                                                            <Box
                                                                                sx={{
                                                                                    display: "flex",
                                                                                    flexDirection: "column",
                                                                                    alignItems: "center",
                                                                                    justifyContent: "center",
                                                                                    gap: 1
                                                                                }}
                                                                            >

                                                                                <Box
                                                                                    component="img"
                                                                                    src={item.image_person}
                                                                                    alt=""
                                                                                    width={55}
                                                                                    height={55}
                                                                                    style={{
                                                                                        borderRadius: "50%",
                                                                                    }}
                                                                                    sx={{
                                                                                        alignSelf: "center",
                                                                                        textTransform: "none"
                                                                                    }}
                                                                                />
                                                                                <Button
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    sx={{
                                                                                        minWidth: 70,
                                                                                        height: 36,
                                                                                        alignSelf: "center",
                                                                                        borderRadius: 2,
                                                                                        fontWeight: 600,
                                                                                        textTransform: "none"
                                                                                    }}
                                                                                    onClick={() => {

                                                                                        setScanResult(
                                                                                            item.asset_code
                                                                                        );

                                                                                    }}
                                                                                >
                                                                                    เลือก
                                                                                </Button>
                                                                            </Box>


                                                                        </>
                                                                    }
                                                                </Box>

                                                            </Paper>
                                                        )

                                                    )
                                                }


                                            </Box>
                                        )
                                    }

                                </Stack>

                            </Box>



                            {(isLoading) &&
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        height: '100vh',
                                        textAlign: 'center'
                                    }}
                                >
                                    {/* <Typography variant="h6" fontWeight={500}>
                                        กำลังค้นหาหมายเลขครุภัณฑ์
                                    </Typography>

                                    <Typography variant="h6" fontWeight={500} className="label-asset">
                                        {qrcode}
                                    </Typography>

                                    <Typography variant="h6" fontWeight={500}>
                                        กรุณารอสักครู่.....
                                    </Typography> */}

                                    <img className='loading-search' src={assets.spinner} alt="" />
                                </Box>
                            }


                        </div>
                    </div>
                </>

            )}

            {scanResult && (<AssetResultCard qrcode={scanResult} />)}
            {/* <AssetResultCard qrcode={"1000-001-0001-0000001-000"} /> */}


        </>


    );
}