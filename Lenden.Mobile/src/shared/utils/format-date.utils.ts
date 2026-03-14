export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "en-US"
) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, options);
}