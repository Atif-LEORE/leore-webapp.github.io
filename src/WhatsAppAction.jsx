import { createWhatsAppUrl } from "./whatsapp.js";

export default function WhatsAppAction({
  phone,
  message,
  label,
  className = "",
  disabled = false,
  disabledReason,
}) {
  const href = disabled ? null : createWhatsAppUrl(phone, message);
  const accessibleLabel = href
    ? `${label} (opens in a new tab)`
    : `${label} unavailable${disabledReason ? `: ${disabledReason}` : ""}`;

  if (!href) {
    return (
      <button
        type="button"
        className={`${className} whatsapp-action-disabled`}
        disabled
        aria-label={accessibleLabel}
        title={disabledReason}
      >
        <span className="material-symbols-outlined" aria-hidden="true">chat</span>
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={accessibleLabel}
    >
      <span className="material-symbols-outlined" aria-hidden="true">chat</span>
      {label}
    </a>
  );
}
