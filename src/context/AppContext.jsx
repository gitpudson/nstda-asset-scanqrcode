import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import Swal from "sweetalert2";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {

    const url_api_backend = "https://script.google.com/macros/s/AKfycbyg6MlP1rcgNjTaWgob_GZyQS4WiJfE56-nSmhkuk2AgAwUwK8tUeFE1LKIFAfgH5ryzA/exec";

    const [menu_building, setMenuBuilding] = useState("");
    const [isLoading,setIsLoading] = useState(true);
    const [isSaving,setIsSaving] = useState(false);
    const [location,setLocation] = useState({});

    const fetLocation = async (org) => {

    try {

        console.log("fetLocation");

        const post = {
            function: 'getLocationNew',
            payload: {
                org
            }
        };

        const response = await axios.post(
            url_api_backend,
            post,
            {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }
        );

        if (response.data.success) {

            setLocation(response.data.data);

            // console.log(response.data.data);

            // console.log(
            //     Object.keys(response.data.data)
            // );

        }

    } catch (error) {

        console.error(
            'Load Location Error:',
            error
        );

    }

};

    const fetAssetByAssetCode = async (qrcode) => {

    try {

        console.log(qrcode);

        const post = {
            function: 'getAssetByAssetCode',
            payload: {
                asset_code: qrcode
            }
        };

        setIsLoading(true);

        const response = await axios.post(
            url_api_backend,
            post,
            {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }
        );

        if (response.data.success) {

            const assetData = response.data.data;

            // console.log(assetData.org_owner);

            await fetLocation(assetData.org_owner);

            return assetData;
        }

    } catch (error) {

        console.error(
            'Load Asset Error:',
            error
        );

    } finally {

        setIsLoading(false);

    }

};

    const fetStatus = async () => {
      

        const post = {
            function: 'getStatus',
            payload: {

            }
        }

        const response = await axios.post(`${url_api_backend}`, post,
            {
                headers: {
                    'Content-Type': 'text/plain',
                },
                mode: "no-cors"
            }
        )

        if (response.data.success) {
            // console.log(response.data.data.person_name);
            return response.data.data;
        }

    }

    const SaveData = async (post) => {
        console.log("Save");
        console.log(post);

        setIsSaving(true);
        const response = await axios.post(`${url_api_backend}`, post,
            {
                headers: {
                    'Content-Type': 'text/plain',
                },
                mode: "no-cors"
            }
        )

        if (response) {
            setIsSaving(false);
            console.log("Success");
            Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                text: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว",
                timer: 2000,
                showConfirmButton: false,
                });
        }

    }


    useEffect(() => {
        console.log("location");
        console.log(location);
    }, [location]);



    const contextValue = {
        url_api_backend,
        isLoading,
        dataBuilding,
        menu_building,
        setMenuBuilding,
        fetAssetByAssetCode,
        fetStatus,
        SaveData,
        isSaving,
        location,
        fetLocation
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider