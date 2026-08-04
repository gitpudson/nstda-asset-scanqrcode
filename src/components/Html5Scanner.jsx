import { useEffect } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

/*
export default function Html5Scanner({ onScanSuccess }) {
  useEffect(() => {
    let scanner = null;
    let started = false;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode("reader");

        const isMobile = /Android|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        );

        const cameraConfig = isMobile
          ? {
              facingMode: "environment",
            }
          : {
              facingMode: "user",
            };

        await scanner.start(
          cameraConfig,
          {
            fps: 10,

            qrbox: {
              width: 220,
              height: 220,
            },

            aspectRatio: 1,

            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
            ],
          },

          (decodedText) => {
            onScanSuccess(decodedText);
          },

          () => {}
        );

        started = true;
      } catch (error) {
        console.error("Scanner Error:", error);
      }
    };

    startScanner();

    return () => {
      if (scanner && started) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, [onScanSuccess]);

  return <div id="reader"></div>;
}
*/

import { useEffect } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

export default function Html5Scanner({ onScanSuccess }) {
  useEffect(() => {
    let scanner = null;
    let started = false;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode("reader");

        const isMobile =
          /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
          );

        const cameraConfig = isMobile
          ? {
              facingMode: "environment",
            }
          : {
              facingMode: "user",
            };

        await scanner.start(
          cameraConfig,
          {
            fps: 5,

            qrbox: {
              width: 280,
              height: 280,
            },

            aspectRatio: 1,

            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
            ],
          },

          (decodedText) => {
            onScanSuccess(decodedText);

            scanner
              .stop()
              .then(() => scanner.clear())
              .catch(() => {});
          },

          () => {}
        );

        started = true;
      } catch (error) {
        console.error("Scanner Error:", error);
      }
    };

    startScanner();

    return () => {
      if (scanner && started) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
  }, [onScanSuccess]);

  return <div id="reader"></div>;
}