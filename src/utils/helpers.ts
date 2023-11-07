import html2canvas from "html2canvas";

export const getConnectionFromURL = () => {
  const url = new URL(window.location.href);

  const connection = url.searchParams.get("connection");

  if (connection) {
    return connection;
  } else {
    return null;
  }
};

export const isConnectionValid = (connection: string) => {
  if (connection.length === 0) {
    return false;
  }

  if (connection[0] === "[" || connection[0] === ":") {
    return false;
  }

  if (
    connection.includes("\n") ||
    connection.includes("\r") ||
    connection.includes("\u2028") ||
    connection.includes("\u2029")
  ) {
    return false;
  }

  if (connection.includes("::$") || connection.includes("::?")) {
    return false;
  }

  return true;
};

export const copyTextToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};

export const copyElementToClipboard = async (el: HTMLElement) => {
  try {
    const canvas = await html2canvas(el);

    canvas.toBlob((blob) => {
      if (blob) {
        navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
      }
    });
    return true;
  } catch (error) {
    return false;
  }
};
