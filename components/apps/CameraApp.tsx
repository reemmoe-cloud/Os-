import React, { useRef, useEffect, useState } from 'react';
import { Icons } from '../ui/Icons';
import { addPhoto } from '../../services/photoStore';

export const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      // Trigger flash effect
      setFlash(true);
      setTimeout(() => setFlash(false), 150);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
          // Flip horizontally for "mirror" effect if using user facing camera
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
          
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const dataUrl = canvas.toDataURL('image/jpeg');
          addPhoto(dataUrl);
          setCaptured(dataUrl);
          
          // Clear capture preview after 2 seconds
          setTimeout(() => setCaptured(null), 2000);
      }
    }
  };

  return (
    <div className="relative h-full bg-black flex flex-col overflow-hidden">
      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        {!error ? (
            <>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                />
                <canvas ref={canvasRef} className="hidden" />
            </>
        ) : (
            <div className="flex items-center justify-center h-full text-white/50 flex-col gap-4">
                <Icons.Camera size={48} />
                <p>{error}</p>
            </div>
        )}
        
        {/* Flash Overlay */}
        <div className={`absolute inset-0 bg-white transition-opacity duration-150 pointer-events-none ${flash ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Capture Preview Overlay */}
        {captured && (
            <div className="absolute bottom-4 right-4 w-24 h-32 border-2 border-white rounded-lg overflow-hidden shadow-2xl animate-[scale-in_0.3s_ease-out]">
                <img src={captured} className="w-full h-full object-cover" alt="Captured" />
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-24 bg-black/40 backdrop-blur-md flex items-center justify-center gap-12 relative z-10">
        <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Icons.Settings size={20} />
        </button>
        
        <button 
            onClick={takePicture}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
        >
            <div className="w-full h-full bg-white rounded-full"></div>
        </button>

        <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Icons.Refresh size={20} />
        </button>
      </div>
    </div>
  );
};