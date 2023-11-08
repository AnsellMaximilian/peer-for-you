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

export function generateNumberWithMinDistance(
  existingNumbers: number[],
  minDistance: number
) {
  let generatedNumber: number;
  let isFarEnough = false;

  do {
    // Generate a random number between 0 and 360
    generatedNumber = Math.random() * 360;

    // Check if the generated number is at least minDistance away from all existing numbers
    isFarEnough = existingNumbers.every(
      (num) => Math.abs(num - generatedNumber) >= minDistance
    );
  } while (!isFarEnough);

  return generatedNumber;
}

export const generateMemberColor = () => {
  return `hsl(${Math.floor(Math.random() * 361)}%, 100%, 93%)`;

  // const hueRegex = /hsl\((\d{1,3})/;
  // const usedValues = members.map((m) => {
  //   const profileData: MemberData = m.profileData as MemberData;

  //   const match = profileData.color.match(hueRegex);
  //   if (match) {
  //     const hueValue = parseInt(match[1], 10);

  //     return hueValue;
  //   }

  //   return 0;
  // });
  // return `hsl(${generateNumberWithMinDistance(usedValues, 25)}%, 100%, 93%)`;
};
