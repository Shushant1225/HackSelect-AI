import { useState, useEffect, useRef } from "react";
import { Camera, AlertTriangle, Shield, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WebcamPreviewProps {
  active: boolean;
  onFaceAlert: (message: string) => void;
}

/**
 * Real webcam preview with face detection UI.
 * Shows actual webcam feed from the device camera.
 */
export const WebcamPreview = ({ active, onFaceAlert }: WebcamPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  // Initialize webcam
  useEffect(() => {
    if (!active) {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
      return;
    }

    const initCamera = async () => {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err: any) {
        setError(
          err.name === "NotAllowedError"
            ? "Camera permission denied. Please enable camera access."
            : "Could not access camera. Ensure camera is available."
        );
        setCameraActive(false);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [active]);

  // Simple face detection simulation (replace with real library like face-api or ml5.js for production)
  useEffect(() => {
    if (!cameraActive || !videoRef.current) return;

    const checkVideo = setInterval(() => {
      // In production, integrate with a real face detection library
      // For now, we'll assume face is detected when video is playing
      setFaceDetected(videoRef.current?.readyState === 4);
    }, 1000);

    return () => clearInterval(checkVideo);
  }, [cameraActive]);

  if (!active) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center p-4 h-40">
        <Camera className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground">Webcam not active</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border-2 border-destructive bg-destructive/5 flex flex-col items-center justify-center p-4 h-40">
        <AlertCircle className="h-6 w-6 text-destructive mb-2" />
        <p className="text-xs text-destructive text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden border-2 transition-colors duration-300",
      faceDetected ? "border-success/50" : "border-yellow-500/50"
    )}>
      {/* Actual webcam feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-40 w-full object-cover bg-black"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* REC indicator */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
        <span className="text-[10px] font-mono text-destructive-foreground/80 font-bold">
          REC
        </span>
      </div>

      {/* Face detection status badge */}
      <div
        className={cn(
          "absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm",
          cameraActive
            ? faceDetected
              ? "bg-success/80 text-success-foreground"
              : "bg-yellow-500/80 text-yellow-50"
            : "bg-muted/80 text-muted-foreground"
        )}
      >
        {cameraActive ? (
          <>
            <div className={cn("h-2 w-2 rounded-full", faceDetected ? "bg-success" : "bg-yellow-400")} />
            {faceDetected ? "Face Detected" : "No Face"}
          </>
        ) : (
          <>
            <AlertTriangle className="h-2.5 w-2.5" />
            Camera Loading...
          </>
        )}
      </div>

      {/* Proctoring status */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-md">
        <Shield className={cn("h-3 w-3", faceDetected ? "text-success" : "text-yellow-500")} />
        <span className="text-[10px] text-foreground font-medium">Proctored</span>
      </div>

      {/* Debug info */}
      <div className="absolute bottom-2 right-2 text-[8px] text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded-md font-mono">
        {cameraActive ? "Connected" : "Connecting..."}
      </div>
    </div>
  );
};
