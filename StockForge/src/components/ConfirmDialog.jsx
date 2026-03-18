import { WarningAmber, DeleteOutline, LocalShipping, CheckCircleOutline } from '@mui/icons-material';

const toneConfig = {
  danger: {
    modalClass: 'fm-theme-danger',
    iconClass: 'danger',
    defaultIcon: <DeleteOutline />,
  },
  warning: {
    modalClass: 'fm-theme-warning',
    iconClass: 'warning',
    defaultIcon: <LocalShipping />,
  },
  success: {
    modalClass: 'fm-theme-success',
    iconClass: 'success',
    defaultIcon: <CheckCircleOutline />,
  },
  info: {
    modalClass: 'fm-theme-info',
    iconClass: 'info',
    defaultIcon: <WarningAmber />,
  },
};

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  tone = 'danger',
  icon,
  processing = false,
}) => {
  if (!open) {
    return null;
  }

  const config = toneConfig[tone] || toneConfig.danger;

  return (
    <div className="fm-overlay" onClick={processing ? undefined : onClose}>
      <div className={`fm-modal fm-sm fm-confirm-dialog ${config.modalClass}`} onClick={(event) => event.stopPropagation()}>
        <div className="fm-modal-header">
          <div className="fm-modal-title-group">
            <div className={`fm-modal-icon ${config.iconClass}`}>
              {icon || config.defaultIcon}
            </div>
            <div>
              <h2 className="fm-modal-title">{title}</h2>
              <p className="fm-modal-subtitle">This action affects saved records.</p>
            </div>
          </div>
          <button className="fm-modal-close" onClick={onClose} type="button" disabled={processing}>✕</button>
        </div>

        <div className="fm-modal-body">
          <div className="fm-confirm-copy">
            <p className="fm-confirm-message">{message}</p>
          </div>
        </div>

        <div className="fm-modal-footer">
          <button className="fm-btn fm-btn-secondary" onClick={onClose} type="button" disabled={processing}>
            {cancelLabel}
          </button>
          <button className="fm-btn fm-btn-primary" onClick={onConfirm} type="button" disabled={processing}>
            {processing ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;