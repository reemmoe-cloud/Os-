import React, { useState, useEffect } from 'react';
import { Icons } from '../ui/Icons';
import { getPhotos, subscribe, Photo, deletePhoto } from '../../services/photoStore';

export const PhotosApp: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    setPhotos(getPhotos());
    const unsubscribe = subscribe(() => {
      setPhotos(getPhotos());
    });
    return unsubscribe;
  }, []);

  const handleDelete = (id: string) => {
      deletePhoto(id);
      setSelectedPhoto(null);
  };

  return (
    <div className="flex h-full bg-white text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-4 px-2">Photos</h2>
        <button className="flex items-center gap-3 p-2 bg-gray-200 rounded-lg text-sm font-medium">
            <Icons.Photos size={18} className="text-pink-500" />
            Library
        </button>
        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
            <Icons.User size={18} />
            For You
        </button>
        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
            <Icons.Star size={18} />
            Favorites
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {photos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Icons.Camera size={64} className="mb-4 opacity-20" />
                <p>No photos yet. Take some with the Camera app!</p>
            </div>
        ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {photos.map(photo => (
                    <div 
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                    >
                        <img src={photo.url} className="w-full h-full object-cover" alt="Gallery item" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Viewer */}
      {selectedPhoto && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col animate-[scale-in_0.2s_ease-out]">
            {/* Toolbar */}
            <div className="h-14 flex items-center justify-between px-4 bg-black/50 backdrop-blur-md absolute top-0 left-0 right-0 z-10">
                <button onClick={() => setSelectedPhoto(null)} className="text-white hover:text-gray-300">
                    <Icons.Back size={24} />
                </button>
                <span className="text-white font-medium text-sm">
                    {new Date(selectedPhoto.timestamp).toLocaleDateString()}
                </span>
                <button onClick={() => handleDelete(selectedPhoto.id)} className="text-white hover:text-red-500">
                    <Icons.Trash size={20} />
                </button>
            </div>
            
            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-4">
                <img src={selectedPhoto.url} className="max-w-full max-h-full object-contain" alt="Full view" />
            </div>
          </div>
      )}
    </div>
  );
};