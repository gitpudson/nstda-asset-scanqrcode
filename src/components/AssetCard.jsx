import {
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";

export default function AssetCard({ asset }) {
  return (
    <Card
      sx={{
        mt: 2,
        borderRadius: 4,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography>
            รหัส : {asset.assetNo}
          </Typography>

          <Typography>
            ชื่อ : {asset.assetName}
          </Typography>

          <Typography>
            หน่วยงาน : {asset.department}
          </Typography>

          <Typography color="success.main">
            สถานะ : {asset.status}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}