// src/hooks/useCorporationValidation.ts
import { useState, useEffect } from "react";

export const useCorporationValidation = (
  corporationNumber: string,
  touched: boolean
) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!corporationNumber || corporationNumber.length !== 9 || !touched) {
      setValidationError(null);
      return;
    }

    const validateCorporationNumber = async () => {
      setIsValidating(true);
      setValidationError(null);

      try {
        const response = await fetch(
          `https://fe-hometask-api.qa.vault.tryvault.com/corporation-number/${corporationNumber}`
        );
        const data = await response.json();

        if (!data.valid) {
          setValidationError(data.message || "Invalid Corporation Number");
        }
      } catch (error) {
        console.error("Corporation validation error:", error);
        setValidationError("Failed to validate corporation number");
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateCorporationNumber, 500);
    return () => clearTimeout(timeoutId);
  }, [corporationNumber, touched]);

  return { isValidating, validationError };
};
