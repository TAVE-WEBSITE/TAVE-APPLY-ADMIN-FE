const formatMMDD = (isoString: string) => {
  const date = new Date(isoString);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
};

const formatHHMin = (isoString: string) => {
  const date = new Date(isoString);
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${min}`;
};

/**
 * ISO 문자열을 'YYYY.MM.DD' 형식으로 변환
 */
function formatDateOnly(isoString: string): string {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

/**
 * ISO 문자열을 'YYYY.MM.DD HH:MM' 형식으로 변환
 */
function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

const formatDateTimeInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: (value: string) => void
) => {
  let value = e.target.value.replace(/\D/g, ""); // 숫자만 남기기

  if (value.length > 12) {
    value = value.slice(0, 12);
  }

  let formatted = "";

  if (value.length >= 4) {
    formatted += value.slice(0, 4); // YYYY
    if (value.length >= 6) {
      formatted += "." + value.slice(4, 6); // MM
      if (value.length >= 8) {
        formatted += "." + value.slice(6, 8); // DD
        if (value.length >= 10) {
          formatted += " " + value.slice(8, 10); // HH
          if (value.length >= 12) {
            formatted += ":" + value.slice(10, 12); // MM
          } else {
            formatted += value.length > 10 ? ":" + value.slice(10) : "";
          }
        } else {
          formatted += value.length > 8 ? " " + value.slice(8) : "";
        }
      } else {
        formatted += value.length > 6 ? "." + value.slice(6) : "";
      }
    } else {
      formatted += value.length > 4 ? "." + value.slice(4) : "";
    }
  } else {
    formatted += value;
  }

  setValue(formatted);
};

export {
  formatMMDD,
  formatHHMin,
  formatDateOnly,
  formatDateTime,
  formatDateTimeInput,
};
