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
