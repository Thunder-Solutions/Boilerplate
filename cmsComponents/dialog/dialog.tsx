import css from './dialog.module.css';
import DialogPolyfill from 'dialog-polyfill-universal';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { NOOP } from 'utilities';
import Title from 'cmsComponents/title/title';
import Button from 'cmsComponents/form/button/button';
import Icon from 'cmsComponents/icon/icon';
import { ReactState } from 'utilities/types';

export type DialogProps = PropsWithChildren<{
  title: string
  openState: ReactState<boolean>,
  className?: string,
  onClose?: (event: Event) => void,
}>;

const Dialog = ({ children, className = '', title, openState, onClose = NOOP, ...props }: DialogProps) => {

  const dialogClass = `${className} ${css.dialog}`;
  const dialogRef = useRef(null);

  // take the entire state as a prop to give the parent control
  // over the open/closed state of the dialog, while also
  // allowing us to manipulate it from the inside.
  const [open, setOpen] = openState || useState(false);
  const close = () => { setOpen(false); };

  // this effect encapsulates the polyfill and window events,
  // and does NOT need to be rerun multiple times.
  useEffect(() => {
    DialogPolyfill.registerDialog(dialogRef.current);
    const handleEsc = event => {
      if (event.key === 'Esc' || event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', handleEsc);
    dialogRef.current.addEventListener('close', onClose);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [dialogRef]);

  // this effect encapsulates the open/closed state of the dialog,
  // and should be rerun every time the open state changes.
  useEffect(() => {
    if (!dialogRef.current) return;
    if (open) {
      if (dialogRef.current.open) return; // skip if already open
      dialogRef.current.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else {
      if (!dialogRef.current.open) return; // skip if already closed
      dialogRef.current.close();
      document.documentElement.style.overflow = 'auto';
    }
  }, [open, dialogRef]);

  return (
    <dialog {...props} className={dialogClass} ref={dialogRef}>
      <header className={css.header}>
        <Title className={css.title}>{title}</Title>
        <Button className={css.closeButton} onClick={close}>
          <Icon type="Close" />
        </Button>
      </header>
      <section className={css.body}>
        {children}
      </section>
    </dialog>
  );
};

export default Dialog;
