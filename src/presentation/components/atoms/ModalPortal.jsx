import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * ModalPortal renders its children directly into document.body,
 * bypassing any CSS stacking contexts, ancestor transforms, filters,
 * or layout scroll containers.
 *
 * This guarantees the modal is ALWAYS centered in the middle of the user's
 * current viewport (window), regardless of page scroll offset.
 */
export function ModalPortal({ children, isOpen = true }) {
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    // Lock page scroll behind the modal
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(children, document.body);
}
