// src/hooks/useFormSubmission.ts
import { useState } from "react";
import { FormData } from "../components/OnboardingForm";

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitForm = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setIsSuccess(false);

    try {
      const response = await fetch(
        "https://fe-hometask-api.qa.vault.tryvault.com/profile-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      setIsSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitForm, isSubmitting, submitError, isSuccess };
};
