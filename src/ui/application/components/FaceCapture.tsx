/**
 * Face Capture Component with Face Detection
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RefreshCw, Check, X, AlertCircle, Upload } from 'lucide-react';

interface FaceCaptureProps {
  onCapture: (photoData: string) => void;
  currentPhoto?: string;
  label?: string;
}

export function FaceCapture({ onCapture, currentPhoto, label = 'Capture Photo' }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(currentPhoto || null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsVideoReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure playback starts on mobile browsers.
        const video = videoRef.current;
        video.onloadedmetadata = () => {
          Promise.resolve()
            .then(() => video.play())
            .catch(() => {
              // Some mobile browsers block autoplay; still mark as “streaming” so UI shows.
            })
            .finally(() => setIsStreaming(true));
        };
        video.oncanplay = () => setIsVideoReady(true);
      }
    } catch (err) {
      const e = err as Error & { name?: string };
      if (e?.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access or upload a photo.');
      } else if (e?.name === 'NotFoundError') {
        setError('No camera found on this device. Please upload a photo.');
      } else {
        setError('Unable to open camera. Please upload a photo.');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsVideoReady(false);
  }, []);

  // Simple face detection simulation using canvas brightness analysis
  useEffect(() => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) return;

    const checkForFace = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, 160, 120);

      const imageData = ctx.getImageData(40, 20, 80, 80);
      const data = imageData.data;
      
      let brightness = 0;
      let skinTones = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        brightness += (r + g + b) / 3;
        // Detect skin-like colors
        if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
          skinTones++;
        }
      }
      
      const avgBrightness = brightness / (data.length / 4);
      const skinRatio = skinTones / (data.length / 4);
      
      // Simple heuristic for face detection
      setFaceDetected(avgBrightness > 50 && avgBrightness < 220 && skinRatio > 0.15);
    };

    const interval = setInterval(checkForFace, 200);
    return () => clearInterval(interval);
  }, [isStreaming]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Some devices report 0x0 until the stream is fully ready.
    if (videoRef.current.videoWidth < 2 || videoRef.current.videoHeight < 2) {
      setError('Camera is not ready yet. Please wait a moment and try again.');
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 480;
    canvas.height = 480;
    
    const video = videoRef.current;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const x = (video.videoWidth - size) / 2;
    const y = (video.videoHeight - size) / 2;
    
    ctx.drawImage(video, x, y, size, size, 0, 0, 480, 480);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhoto(photoData);
    onCapture(photoData);
    stopCamera();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (file: File | null) => {
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      setCapturedPhoto(dataUrl);
      onCapture(dataUrl);
      stopCamera();
    } catch {
      setError('Failed to upload photo. Please try again.');
    }
  };

  const retake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  if (capturedPhoto) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="relative aspect-square max-w-[200px] mx-auto">
            <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute top-2 right-2 bg-success text-success-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={retake}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retake Photo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
        />

        {error && (
          <div className="text-center py-8 text-destructive">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
            <div className="mt-4 flex flex-col gap-2 items-center">
              <Button variant="outline" onClick={startCamera}>Try Camera Again</Button>
              <Button variant="outline" onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>
        )}

        {!isStreaming && !error && (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">{label}</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={startCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Open Camera
              </Button>
              <Button variant="outline" onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>
        )}

        {isStreaming && (
          <div className="space-y-4">
            <div className="relative aspect-square max-w-[300px] mx-auto overflow-hidden rounded-lg border-4 border-dashed transition-colors"
              style={{ borderColor: faceDetected ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }}>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`w-32 h-40 border-2 rounded-full ${
                    faceDetected ? 'border-success' : 'border-muted-foreground/40'
                  }`}
                />
              </div>
              <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
                faceDetected ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {faceDetected ? 'Face Detected ✓' : 'Position your face'}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={stopCamera}>
                <X className="h-4 w-4 mr-2" />Cancel
              </Button>
              {/* Don't block capture behind heuristic face detection; it frequently fails on real devices. */}
              <Button className="flex-1" onClick={capturePhoto} disabled={!isVideoReady}>
                <Camera className="h-4 w-4 mr-2" />Capture
              </Button>
            </div>
            {!isVideoReady && (
              <p className="text-xs text-muted-foreground text-center">
                Preparing camera…
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
