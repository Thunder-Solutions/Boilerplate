import css from './overlay.module.css'
import { createContextState, getClassName } from 'utilities'
import { useState } from 'react'

export const OverlayContext = createContextState(false)

const Overlay = ({ children }) => {
  const [showOverlay, setShowOverlay] = useState(false)
  const overlayClass = getClassName({
    [css.visible]: showOverlay,
  }, css.overlay)
  return (
    <OverlayContext.Provider value={{ value: showOverlay, setValue: setShowOverlay }}>
      <div className={overlayClass}></div>
      {children}
    </OverlayContext.Provider>
  )
}

export default Overlay
