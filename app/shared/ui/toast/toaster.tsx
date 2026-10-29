import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { toastClassNames, toasterClass, toasterStyle } from './constants';
import { ToastCloseIcon, ToastIcon } from './toast-icons';

export function Toaster({
  position = 'bottom-right',
  toastOptions,
  visibleToasts = 3,
  ...props
}: ToasterProps) {
  return (
    <Sonner
      className={toasterClass}
      closeButton
      icons={{
        close: <ToastCloseIcon />,
        error: <ToastIcon variant="error" />,
        info: <ToastIcon variant="info" />,
        success: <ToastIcon variant="success" />,
      }}
      gap={8}
      offset={24}
      style={toasterStyle}
      theme="system"
      {...props}
      position={position}
      visibleToasts={visibleToasts}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastClassNames,
          ...toastOptions?.classNames,
        },
      }}
    />
  );
}
