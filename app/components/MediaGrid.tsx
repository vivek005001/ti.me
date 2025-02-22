interface MediaGridProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrls: string[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ isOpen, onClose, mediaUrls }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaUrls.map((url, index) => (
            <div key={index} className="aspect-square">
              {url.includes('.mp4') ? (
                <video
                  src={url}
                  controls
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <img
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaGrid; 