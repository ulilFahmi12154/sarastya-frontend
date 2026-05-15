export function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

export function toInputDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function toIsoDate(inputDate) {
  if (!inputDate) {
    return null;
  }

  return new Date(`${inputDate}T12:00:00.000Z`).toISOString();
}

export function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
