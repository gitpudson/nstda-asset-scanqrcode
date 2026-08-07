import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import "../styles/asset-result.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SaveIcon from "@mui/icons-material/Save";
import axios from 'axios';
import Swal from "sweetalert2";

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
    const { url_api_backend, fetAssetByAssetCode, fetStatus, isLoading, SaveData, isSaving, location } = useContext(AppContext);

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
                <div>
                    <Typography variant="h6" fontWeight={500}>
                        กำลังค้นหาหมายเลขครุภัณฑ์
                    </Typography>
                    <Typography variant="h6" fontWeight={500} className="label-asset">
                        {qrcode}
                    </Typography>
                    <Typography variant="h6" fontWeight={500}>
                        กรุณารอสักครู่.....
                    </Typography>
                    <img className='loading' src="./spinner.svg" alt="" />
                </div>
            }


        </>
    );
}