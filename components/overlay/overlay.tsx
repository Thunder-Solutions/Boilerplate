import css from './overlay.module.css';
import { DivTagProps, createContextState, getClassName } from 'utilities';
import { useState } from 'react';

export const OverlayContext = createContextState(false);

export type OverlayProps = DivTagProps;

const Overlay = ({ children, className, ...props }: OverlayProps) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayClass = getClassName({
    [css.visible]: showOverlay,
  }, css.overlay, className);
  return (
    <OverlayContext.Provider value={{ value: showOverlay, setValue: setShowOverlay }}>
      <div {...props} className={overlayClass}></div>
      {children}
    </OverlayContext.Provider>
  );
};

export default Overlay;
