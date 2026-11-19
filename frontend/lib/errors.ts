import axios, { type AxiosError } from "axios";
import type { ApiErrorResponse } from "@/lib/types";

export interface NormalizedApiError {
  message: string;
  status?: number;
  fieldErrors: Record<string, string>;
  raw?: ApiErrorResponse;
}

export function normalizeApiError(error: unknown, fallbackMessage = "Something went wrong."): NormalizedApiError {
  if (!axios.isAxiosError(error)) {
    return {
      message: fallbackMessage,
      fieldErrors: {},
    };
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;
  const data = axiosError.response?.data;

  return {
    message: data?.message ?? fallbackMessage,
    status: data?.status ?? axiosError.response?.status,
    fieldErrors: data?.fieldErrors ?? {},
    raw: data,
  };
}

export function getApiErrorMessage(error: unknown, fallbackMessage = "Something went wrong.") {
  return normalizeApiError(error, fallbackMessage).message;
}