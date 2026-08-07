import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import "../styles/asset-result.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SaveIcon from "@mui/icons-material/Save";
import axios from 'axios';
import Swal from "sweetalert2";
import { assets } from "../assets/assets";

import {
    Box,
    Card,
    Typography,
    TextField,
    MenuItem,
    Avatar,
    Button,
    IconButton,
} from "@mui/material";


export default function AssetResultCard({ qrcode }) {
    const { fetAssetByAssetCode, fetStatus, isLoading, SaveData, isSaving, location } = useContext(AppContext);

    //ดึง Building
    const buildings = Object.keys(location);
    console.log(buildings);

    //ดึง Floor เมื่อเลือก Building
    const getFloors = (building) => {
        return Object.keys(
            location[building] || {}
        );
    };

    //ดึง Room เมื่อเลือก Floor
    const getRooms = (building, floor) => {
        return location[building]?.[floor] || [];
    };

    const filteredFloors = location?.Floor?.filter(
        item => item.Building === formData.new_building
    ) || [];

    const filteredRooms = location?.Room?.filter(
        item => item.Floor === formData.new_floor
    ) || [];

    const [building, setBuilding] = useState("");
    const [floor, setFloor] = useState("");
    const [room, setRoom] = useState({});

    const [images, setImages] = useState([]);
    const [imgPerson, setImgPerson] = useState();
    const [statusList, setStatusList] = useState([]);

    const [formData, setFormData] = useState({
        org_owner: "",
        asset_code: "",
        asset_name: "",
        build: "",
        floor: "",
        room: "",
        person_id: 0,
        person_name: "",
        asset_status: "",
        new_building: "",
        new_floor: "",
        new_room: "",
        asset_image: "",
        image_url: "",
        new_status: "",
        updated_at: "",
        person_key: "",
        row_number: 0
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImage = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImages([
            {
                file,
                preview: URL.createObjectURL(file),
                isOld: false,
            },
        ]);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("th-TH", {
            timeZone: "Asia/Bangkok",
        });
    };

    //ฟังก์ชันย่อรูป
    const compressImage = (
        file,
        maxWidth = 1024,
        quality = 0.6
    ) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const img = new Image();

            reader.onload = (e) => {
                img.src = e.target.result;
            };

            img.onload = () => {
                const canvas = document.createElement("canvas");

                const scale = Math.min(
                    1,
                    maxWidth / img.width
                );

                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(
                    img,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const dataUrl = canvas.toDataURL(
                    "image/jpeg",
                    quality
                );

                const base64 = dataUrl.split(",")[1];

                resolve(
                    `${file.name}||image/jpeg||${base64}`
                );
            };

            img.onerror = reject;
            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {

        if (!images || images.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "ไม่พบรูปภาพ",
                // text: "กรุณาถ่ายรูปหรือแนบรูปภาพอย่างน้อย 1 รูป",
                text: "กรุณาถ่ายรูปหรือแนบรูปภาพก่อน",
                confirmButtonText: "ตกลง",
            });
            return;
        }

        const result = await Swal.fire({
            title: "ยืนยันการบันทึก?",
            text: "ต้องการบันทึกข้อมูลนี้หรือไม่",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "บันทึก",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {

            let imageData = [];
            const newImages = images.filter((img) => img.file);

            // แปลงเป็น Base64 เฉพาะรูปใหม่
            if (newImages.length > 0) {
                imageData = await Promise.all(
                    newImages.map((img) =>
                        compressImage(
                            img.file,
                            // 1280,  // หลังย่อ                        
                            // 0.7    // 200-500 KB
                            1024,  // หลังย่อ
                            0.6    // 100-300 KB
                        )
                    )
                );
            }

            const data = {
                function: "updateAsset",
                payload: {
                    ...formData,
                    // ส่ง image เฉพาะกรณีมีรูปใหม่
                    ...(imageData.length > 0 && {
                        image: imageData,
                    }),
                },
            };

            SaveData(data);
            // alert("บันทึกสำเร็จ");

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถบันทึกข้อมูลได้",
            });
        } finally {
            // setSaving(false);
        }

    };

    useEffect(() => {

        const loadData = async () => {

            try {

                const asset = await fetAssetByAssetCode(qrcode);

                // console.log(asset);

                if (!asset || !asset.success) {

                    await Swal.fire({
                        icon: "warning",
                        title: "ไม่พบรายการครุภัณฑ์",
                        text: "กรุณาตรวจสอบ QR Code แล้วทำรายการใหม่",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });

                    window.location.reload();

                    return;
                }

                setFormData(asset);

                setImgPerson(
                    `https://i.nstda.or.th/lib/search/cache/large/${asset.person_key}.jpg`
                );

                const apiImages = asset.image_url
                    ? [
                        {
                            preview: asset.image_url,
                            isOld: true,
                        },
                    ]
                    : [];

                setImages(apiImages);

            } catch (error) {

                console.error(error);

                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถดึงข้อมูลครุภัณฑ์ได้",
                    confirmButtonText: "ตกลง",
                });

            }

        };

        if (qrcode) {
            loadData();
        }

    }, [qrcode]);

    useEffect(() => {
        const loadData = async () => {

            const status = await fetStatus();
            setStatusList(status);
            //   console.log("statusList =", statusList);     

        };

        loadData();

    }, [statusList]);


    return (
        <>
            {(isLoading) &&
                // <div>
                //     <Typography variant="h6" fontWeight={500}>
                //         กำลังค้นหาหมายเลขครุภัณฑ์
                //     </Typography>
                //     <Typography variant="h6" fontWeight={500} className="label-asset">
                //         {qrcode}
                //     </Typography>
                //     <Typography variant="h6" fontWeight={500}>
                //         กรุณารอสักครู่.....
                //     </Typography>
                //     <img className='loading' src={assets.spinner} alt="" />
                // </div>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight={500}>
                        กำลังค้นหาหมายเลขครุภัณฑ์
                    </Typography>

                    <Typography variant="h6" fontWeight={500} className="label-asset">
                        {qrcode}
                    </Typography>

                    <Typography variant="h6" fontWeight={500}>
                        กรุณารอสักครู่.....
                    </Typography>

                    <img className='loading' src={assets.spinner} alt="" />
                </Box>
            }

            {(!isLoading && formData.org_owner != "") && (
                <Box className="page">
                    {/* Header */}
                    <Box className="header-box">
                        <IconButton>
                            {/* <ArrowBackIcon /> */}
                            <img className="logo-org" src={formData.org_owner === "สก." ? assets.co :
                                formData.org_owner === "ศอ." ? assets.nectec :
                                    formData.org_owner === "ศช." ? assets.biotec :
                                        formData.org_owner === "ศว." ? assets.mtec :
                                            formData.org_owner === "ศล." ? assets.entec :
                                                formData.org_owner === "ศน." ? assets.nanotec : ""

                            } />
                        </IconButton>

                        <Typography variant="h6" fontWeight={300}>
                            รายการผู้ถือครองครุภัณฑ์
                        </Typography>
                    </Box>

                    {/* Employee */}
                    <Card className="employee-card">
                        <Avatar
                            src={imgPerson}
                            sx={{
                                width: 75,
                                height: 75,
                                bgcolor: "#ff6b00",
                            }}
                        />

                        <Box>
                            <Typography fontWeight={700}>
                                {formData.person_name}
                            </Typography>

                            <Typography color="text.secondary">
                                รหัสพนักงาน {formData.person_key}
                            </Typography>

                            <Typography color="text.secondary">
                                หน่วยงาน {formData.org_owner}
                            </Typography>
                        </Box>
                    </Card>

                    {/* Form */}
                    <Card className="form-card">

                        <Typography className="label">
                            รหัสครุภัณฑ์
                        </Typography>

                        <TextField
                            fullWidth
                            size="small"
                            value={formData.asset_code}
                        />

                        <Typography className="label">
                            รายการครุภัณฑ์
                        </Typography>

                        <Box className="asset-box">
                            <Typography fontWeight={700}>
                                {formData.asset_name}
                            </Typography>

                        </Box>

                        {formData?.new_building === "" ?
                            <>
                                <Typography className="label">
                                    ตำแหน่งที่ตั้งปัจจุบัน
                                </Typography>
                                <Box className="asset-box">
                                    <Typography fontWeight={700}>
                                        อาคาร : {formData?.build || "-"}
                                    </Typography>

                                    <Typography fontWeight={700}>
                                        ชั้น : {formData?.floor || "-"}
                                    </Typography>

                                    <Typography fontWeight={700}>
                                        ห้อง : {formData?.room || "-"}
                                    </Typography>
                                </Box>
                            </>

                            : <></>
                        }

                        <Typography className="label">
                            อาคาร
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            // label="Building"
                            value={formData.new_building}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    new_building: e.target.value,
                                    new_floor: "",
                                    new_room: ""
                                }))
                            }
                        >

                            {Object.keys(location)
                                .sort((a, b) =>
                                    a.localeCompare(b, "en", {
                                        numeric: true,
                                        sensitivity: "base",
                                    })
                                )
                                .map(item => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                        </TextField>

                        <Typography className="label">
                            ชั้น
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            // label="Floor"
                            value={formData.new_floor}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    new_floor: e.target.value,
                                    new_room: ""
                                }))
                            }
                        >

                            {Object.keys(location[formData.new_building] || {})
                                .sort((a, b) => {
                                    if (a === "ไม่มีชั้น") return -1;
                                    if (b === "ไม่มีชั้น") return 1;

                                    return a.localeCompare(b, "en", {
                                        numeric: true,
                                        sensitivity: "base"
                                    });
                                })
                                .map(item => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}

                        </TextField>

                        <Typography className="label">
                            ห้อง
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            // label="Room"
                            value={formData.new_room}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    new_room: e.target.value
                                }))
                            }
                        >
                            {(location[formData.new_building]?.[formData.new_floor] || [])
                                .map(item => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                        </TextField>

                        <Typography className="label">
                            สถานะ
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            size="small"
                            name="new_status"
                            value={formData.new_status || ""}
                            onChange={handleChange}
                        >
                            {statusList.map((status) => (
                                <MenuItem
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Typography className="label">
                            รูปภาพ
                        </Typography>

                        <label className="upload-box">
                            <CameraAltIcon
                                sx={{
                                    fontSize: 40,
                                    color: "#ff6b00",
                                }}
                            />

                            <Typography>
                                แตะเพื่อถ่ายรูป
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {/* หรือเลือกจากแกลเลอรี่ */}
                            </Typography>

                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                capture="environment"
                                onChange={handleImage}
                            />
                        </label>

                        {
                            formData.updated_at !== "" ? (
                                <Typography className="label">
                                    แก้ไขล่าสุด {formatDate(formData.updated_at)}
                                </Typography>
                            ) : ""
                        }

                        <Box className="gallery">
                            {images
                                .filter((item) => item.preview)
                                .map((item, index) => (
                                    <img
                                        key={index}
                                        src={item.preview}
                                        // alt={`preview-${index}`}
                                        alt=""
                                        className="preview"
                                    />
                                ))}
                        </Box>


                    </Card>

                    {/* Save */}
                    <Box className="footer">
                        <Button
                            fullWidth
                            //   startIcon={<SaveIcon />}
                            startIcon={isSaving ? <img className='loading-save' src="./spinner.svg" alt="" /> : <SaveIcon />}
                            variant="contained"
                            onClick={handleSave}
                            className="save-btn"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving....." : "Save"}
                        </Button>
                    </Box>

                </Box>

            )

            }


        </>
    );
}