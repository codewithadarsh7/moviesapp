"use client";

import { useEffect } from "react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string | null;
  title: string;
}

const TrailerModal = ({
  isOpen,
  onClose,
  trailerUrl,
  title,
}: TrailerModalProps) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !trailerUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-label="Trailer Modal"
    >
      <div
        className="bg-[#18181b] p-4 rounded-lg max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()} // prevent closing when click inside the modal
      >
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={trailerUrl}
            title={`${title} Trailer`}
            allow="autoplay encrypted-media"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
