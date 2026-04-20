import { Html5Qrcode } from 'html5-qrcode';
export declare function useScanner({ onScannerSizeChanged, elementId, onScanSuccess, app: appCtx, navigate }: {
    onScannerSizeChanged: any;
    elementId: any;
    onScanSuccess: any;
    app: any;
    navigate: any;
}): {
    startScanCamera: (scanner: Html5Qrcode) => Promise<null>;
    startScanFile: (file: File) => Promise<void>;
};
