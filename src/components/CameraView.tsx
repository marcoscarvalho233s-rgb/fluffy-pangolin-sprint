import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  projectTitle: string;
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ projectTitle, onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
      }
    }, 'image/jpeg', 0.8);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-80 text-white">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-medium">{projectTitle}</h2>
        <Button variant="ghost" size="icon" onClick={flipCamera}>
          <RefreshCw className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex justify-center p-8 bg-black bg-opacity-80">
        <Button
          size="lg"
          className="w-20 h-20 rounded-full p-0 border-4 border-white"
          onClick={capturePhoto}
        >
          <div className="w-16 h-16 rounded-full bg-white" />
        </Button>
      </div>
      
      <div className="text-center p-4 bg-black bg-opacity-80 text-white text-sm">
        <p>Toque no botão para tirar a foto</p>
      </div>
    </div>
  );
};