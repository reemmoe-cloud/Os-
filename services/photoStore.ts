
export interface Photo {
  id: string;
  url: string;
  timestamp: number;
}

let photos: Photo[] = [];
const listeners: (() => void)[] = [];

// Initialize with a dummy photo if empty
if (photos.length === 0) {
    photos.push({
        id: 'default-1',
        url: 'https://images.unsplash.com/photo-1531297461136-82lw9z1.jpg?w=800&q=80',
        timestamp: Date.now()
    });
}

export const addPhoto = (url: string) => {
  const photo = { id: Date.now().toString(), url, timestamp: Date.now() };
  photos = [photo, ...photos];
  notify();
};

export const getPhotos = () => photos;

export const deletePhoto = (id: string) => {
    photos = photos.filter(p => p.id !== id);
    notify();
};

export const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notify = () => listeners.forEach(l => l());
