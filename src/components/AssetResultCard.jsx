import "../styles/asset-result.css";

export default function AssetResultCard({ asset }) {

    return (
        <div className="asset-card">

            <div className="asset-header">
                ✅ พบข้อมูลครุภัณฑ์
            </div>

            <div className="asset-row">
                <label>รหัสครุภัณฑ์</label>
                <span>{asset.assetNo}</span>
            </div>

            <div className="asset-row">
                <label>ชื่อรายการ</label>
                <span>{asset.assetName}</span>
            </div>

            <div className="asset-row">
                <label>หน่วยงาน</label>
                <span>{asset.department}</span>
            </div>

            <div className="asset-row">
                <label>ผู้รับผิดชอบ</label>
                <span>{asset.owner}</span>
            </div>

            <div className="asset-row">
                <label>สถานที่</label>
                <span>{asset.location}</span>
            </div>

            <div className="asset-row">
                <label>สถานะ</label>

                <span className="status-ok">
                    {asset.status}
                </span>
            </div>

        </div>
    );
}