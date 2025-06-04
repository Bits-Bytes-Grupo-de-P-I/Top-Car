// Esse arquivo serve para limpar os espaços em branco mandados nos inputs
export const cleanAndValidateFormData = (data) => {
  const cleaned = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (typeof value === "string") {
        const trimmedValue = value.trim();
        // Só adiciona se não estiver vazio após o trim
        if (trimmedValue !== "") {
          cleaned[key] = trimmedValue;
        }
      } else if (value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
};
