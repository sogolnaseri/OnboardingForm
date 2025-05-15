// src/components/OnboardingForm.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCorporationValidation } from "../hooks/useCorporationValidation";
import { useFormSubmission } from "../hooks/useFormSubmission";
import FormField from "./FormField";
import "./OnboardingForm.css";

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  corporationNumber: string;
}

// Phone number validation function
const isValidCanadianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s/g, "");
  const canadianPhoneRegex = /^\+1[2-9]\d{9}$/;
  return canadianPhoneRegex.test(cleanPhone);
};

// Validation schema
const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .max(50, "First name must be 50 characters or less"),
  lastName: yup
    .string()
    .required("Last name is required")
    .max(50, "Last name must be 50 characters or less"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test(
      "phone",
      "Please enter a valid Canadian phone number starting with +1",
      isValidCanadianPhone
    ),
  corporationNumber: yup
    .string()
    .required("Corporation number is required")
    .length(9, "Corporation number must be exactly 9 digits")
    .matches(/^\d+$/, "Corporation number must contain only digits"),
});

const OnboardingForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    trigger,
    getValues,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { isValidating, validationError } = useCorporationValidation(
    getValues("corporationNumber") || "",
    !!touchedFields.corporationNumber
  );

  const { submitForm, isSubmitting, submitError, isSuccess } =
    useFormSubmission();

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  const onSubmit = async (data: FormData) => {
    if (isValidating || validationError) {
      return;
    }
    await submitForm(data);
  };

  const handleCorporationNumberBlur = async () => {
    await trigger("corporationNumber");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="onboarding-form" data-testid="onboarding-form">
        <h2>Onboarding Form</h2>

        {isSuccess && (
          <div className="success-message">
            Form submitted successfully! Thank you for your submission.
          </div>
        )}

        <div className="form-row">
          <FormField
            label="First Name"
            error={errors.firstName?.message}
            required
          >
            <input
              {...register("firstName")}
              type="text"
              className={`form-input ${errors.firstName ? "error" : ""}`}
              onBlur={() => trigger("firstName")}
            />
          </FormField>

          <FormField
            label="Last Name"
            error={errors.lastName?.message}
            required
          >
            <input
              {...register("lastName")}
              type="text"
              className={`form-input ${errors.lastName ? "error" : ""}`}
              onBlur={() => trigger("lastName")}
            />
          </FormField>
        </div>

        <FormField label="Phone Number" error={errors.phone?.message} required>
          <input
            {...register("phone")}
            type="tel"
            className={`form-input ${errors.phone ? "error" : ""}`}
            onBlur={() => trigger("phone")}
          />
        </FormField>

        <FormField
          label="Corporation Number"
          error={errors.corporationNumber?.message || validationError}
          required
          isValidating={isValidating}
        >
          <input
            {...register("corporationNumber")}
            type="text"
            className={`form-input ${
              errors.corporationNumber || validationError ? "error" : ""
            }`}
            onBlur={handleCorporationNumberBlur}
          />
        </FormField>

        {submitError && <div className="submit-error">{submitError}</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || isValidating}
        >
          {isSubmitting ? "Submitting..." : "Submit"} →
        </button>
      </form>
    </div>
  );
};

export default OnboardingForm;
