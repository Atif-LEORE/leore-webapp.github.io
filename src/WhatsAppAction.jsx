import { createWhatsAppUrl } from "./whatsapp.js";

function WhatsAppIcon() {
  return (
    <svg
      className="whatsapp-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="11.5" fill="#25D366" />
      <path
        d="M18.7 11.7a6.7 6.7 0 0 1-9.9 5.9l-.4-.2-2.2.6.6-2.2-.2-.4a6.7 6.7 0 1 1 12.1-3.7Z"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9.1 8.1c-.3-.1-.6 0-.8.3l-.4.6c-.2.3-.2.7-.1 1 .6 2.2 2.3 3.9 4.5 4.5.4.1.7.1 1-.1l.6-.4c.3-.2.4-.5.3-.8l-.3-.9-1.4-.7-.8.8a5.2 5.2 0 0 1-1.8-1.8l.8-.8-.7-1.4-.9-.3Z"
        fill="#fff"
      />
    </svg>
  );
}

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
        <WhatsAppIcon />
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
      <WhatsAppIcon />
      {label}
    </a>
  );
}
