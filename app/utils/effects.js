import { useEffect } from 'react';

export function useOnComponentClickOut(componentRef, onClickOut) {
  useEffect(() => {
    function onWindowClick(ev) {
      if (
        onClickOut &&
        componentRef &&
        componentRef.current &&
        !componentRef.current.contains(ev.target)
      ) {
        onClickOut();
      }
    }
    window.addEventListener('click', onWindowClick);
    return () => {
      window.removeEventListener('click', onWindowClick);
    };
  });
}
