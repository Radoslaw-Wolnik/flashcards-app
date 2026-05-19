// src/components/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  buttonText = 'Continue' 
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-slate-950/55 flex items-center justify-center z-50 p-4">
        <div 
          className="surface-card max-w-md w-full transform transition-all duration-300 shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-950 mb-2">{title}</h3>
            <p className="text-slate-700 mb-6">{message}</p>
            
            <div className="flex justify-end">
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="primary-action"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};
