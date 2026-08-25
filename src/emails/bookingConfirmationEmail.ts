import type { BookingConfirmationSnapshot } from "@/lib/bookingConfirmation";
import type { Locale } from "@/i18n/config";
import { localeTag } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { formatFreeCancellationDeadline } from "@/lib/freeCancellation";

type Msg = (typeof messages)["de"]["booking"];

function t(locale: Locale, key: keyof Msg, params?: Record<string, string | number>): string {
  const table = messages[locale].booking as Record<string, string>;
  let text = table[key] ?? String(key);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

function formatEuro(value: number, locale: Locale) {
  return new Intl.NumberFormat(localeTag(locale), {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

function formatDeadline(arrivalIso: string, locale: Locale) {
  return formatFreeCancellationDeadline(new Date(arrivalIso), locale);
}

function guestName(
  guest: { salutation: string; firstName: string; lastName: string },
  locale: Locale
) {
  const title =
    guest.salutation === "mr"
      ? t(locale, "salutationMr")
      : guest.salutation === "ms"
        ? t(locale, "salutationMs")
        : "";
  return [title, guest.firstName, guest.lastName].filter(Boolean).join(" ");
}

/**
 * Email-safe HTML booking confirmation template.
 * No sending integration — render only for future server-side mailers.
 */
export function renderBookingConfirmationEmail(snapshot: BookingConfirmationSnapshot): string {
  const locale = snapshot.locale;
  const departure = new Date(snapshot.arrivalIso);
  departure.setDate(departure.getDate() + snapshot.nights);
  const paymentLabel =
    snapshot.payment === "card" ? t(locale, "paymentCard") : t(locale, "paymentInvoice");
  const paymentNote =
    snapshot.payment === "card" ? t(locale, "paymentCardNote") : t(locale, "paymentInvoiceNote");

  const roomRows = snapshot.rooms
    .map(
      (room) => `
      <tr><td colspan="2" style="padding:16px 0 8px;font-weight:bold;font-size:15px;color:#0f172a;border-top:1px solid #e8eaef;">
        ${t(locale, "roomLine", { n: room.roomIndex + 1 })} · ${room.categoryName}
      </td></tr>
      <tr><td style="padding:4px 0;color:#475569;font-size:14px;">${room.occupancy}</td></tr>
      <tr><td style="padding:4px 0;color:#475569;font-size:14px;">${t(locale, "confirmMainGuest")}: ${guestName(room.mainGuest, locale)}</td></tr>
      ${
        room.mealPlanLabel
          ? `<tr><td style="padding:4px 0;color:#475569;font-size:14px;">${room.mealPlanLabel}</td></tr>`
          : ""
      }
      <tr><td align="right" style="padding:8px 0;font-weight:bold;color:#0f172a;">${formatEuro(room.total, locale)}</td></tr>`
    )
    .join("");

  const extrasRows = snapshot.extras
    .map((extra) => {
      const label =
        extra.quantity && extra.quantity > 1 ? `${extra.label} × ${extra.quantity}` : extra.label;
      return `
      <tr>
        <td style="padding:6px 0;color:#475569;font-size:14px;">${label}</td>
        <td align="right" style="padding:6px 0;font-weight:600;color:#0f172a;">+${formatEuro(extra.amount, locale)}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${t(locale, "confirmEmailSubject")}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8eaef;">
        <tr><td style="background:#1B63EB;padding:24px 28px;">
          <p style="margin:0;font-size:22px;font-weight:bold;color:#ffffff;">Urlaubspanda</p>
          <p style="margin:8px 0 0;font-size:14px;color:#dbeafe;">${t(locale, "confirmEmailHeading")}</p>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f172a;">${t(locale, "confirmThankYou")}</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.5;color:#475569;">${t(locale, "confirmEmailSent", { email: snapshot.contact.email })}</p>
          <p style="margin:0 0 24px;font-size:14px;font-weight:bold;color:#1B63EB;">${t(locale, "requestNo", { ref: snapshot.requestRef })}</p>

          <h2 style="margin:0 0 8px;font-size:16px;color:#0f172a;">${snapshot.hotel.name}</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#475569;">${snapshot.hotel.region}, ${snapshot.hotel.country} · ${"★".repeat(snapshot.hotel.stars)}</p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
            <tr><td style="padding:6px 0;font-size:14px;color:#475569;">${t(locale, "arrivalDate")}</td><td align="right" style="font-size:14px;font-weight:600;">${formatDate(snapshot.arrivalIso, locale)}</td></tr>
            <tr><td style="padding:6px 0;font-size:14px;color:#475569;">${t(locale, "departureDate")}</td><td align="right" style="font-size:14px;font-weight:600;">${formatDate(departure.toISOString(), locale)}</td></tr>
            <tr><td style="padding:6px 0;font-size:14px;color:#475569;">${t(locale, "duration")}</td><td align="right" style="font-size:14px;font-weight:600;">${snapshot.nights}</td></tr>
          </table>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${roomRows}</table>
          ${
            snapshot.extras.length > 0
              ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;">${extrasRows}</table>`
              : ""
          }
          ${
            snapshot.voucherDiscount > 0
              ? `<p style="margin:12px 0 0;font-size:14px;color:#16a34a;">${t(locale, "voucherDiscount")}: −${formatEuro(snapshot.voucherDiscount, locale)}</p>`
              : ""
          }
          <p style="margin:20px 0 0;padding-top:16px;border-top:2px solid #0f172a;font-size:20px;font-weight:bold;">${t(locale, "totalPriceLabel")}: ${formatEuro(snapshot.totalPrice, locale)}</p>
          <p style="margin:8px 0 0;font-size:12px;color:#64748b;">${t(locale, "taxesIncluded")}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;">${t(locale, "touristTaxNote")}</p>

          <p style="margin:20px 0 8px;font-size:14px;font-weight:bold;color:#0f172a;">${t(locale, "confirmCancellation")}</p>
          <p style="margin:0;padding:12px;background:#EAF8F0;border-radius:8px;font-size:14px;font-weight:600;color:#16a34a;">${t(locale, "cancelNoRisk", { date: formatDeadline(snapshot.arrivalIso, locale) })}</p>

          <p style="margin:20px 0 8px;font-size:14px;font-weight:bold;color:#0f172a;">${t(locale, "howToPay")}</p>
          <p style="margin:0;font-size:14px;color:#475569;">${paymentLabel}<br/>${paymentNote}</p>

          <p style="margin:20px 0 8px;font-size:14px;font-weight:bold;color:#0f172a;">${t(locale, "confirmContactDetails")}</p>
          <p style="margin:0;font-size:14px;color:#475569;">${guestName(snapshot.contact, locale)}<br/>${snapshot.contact.email}<br/>${snapshot.contact.phoneLocal}</p>
          ${
            snapshot.remarks
              ? `<p style="margin:20px 0 8px;font-size:14px;font-weight:bold;color:#0f172a;">${t(locale, "confirmRemarks")}</p><p style="margin:0;font-size:14px;color:#475569;">${snapshot.remarks}</p>`
              : ""
          }

          <h3 style="margin:28px 0 12px;font-size:16px;color:#0f172a;">${t(locale, "confirmWhatNext")}</h3>
          <ol style="margin:0;padding-left:20px;color:#475569;font-size:14px;line-height:1.6;">
            <li><strong>${t(locale, "confirmStep1Title")}</strong> — ${t(locale, "confirmStep1Text")}</li>
            <li><strong>${t(locale, "confirmStep2Title")}</strong> — ${t(locale, "confirmStep2Text")}</li>
            <li><strong>${t(locale, "confirmStep3Title")}</strong> — ${t(locale, "confirmStep3Text")}</li>
          </ol>
        </td></tr>
        <tr><td style="padding:20px 28px;background:#f7f8fb;font-size:12px;color:#64748b;text-align:center;">
          Urlaubspanda · ${t(locale, "confirmEmailFooter")}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
