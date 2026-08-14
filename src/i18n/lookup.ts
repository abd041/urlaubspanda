import type { Locale } from "@/i18n/config";
import { messages, type Messages } from "@/i18n/messages";

function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const fromLocale = getPath(messages[locale], key);
  const fallback = getPath(messages.de, key);
  let value =
    typeof fromLocale === "string"
      ? fromLocale
      : typeof fallback === "string"
        ? fallback
        : key;

  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
  }

  return value;
}

export type MessageTree = Messages;
