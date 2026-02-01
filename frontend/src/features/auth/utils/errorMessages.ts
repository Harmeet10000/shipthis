/**
 * Maps backend error codes/messages to user-friendly messages
 */
const errorMessageMap: Record<string, string> = {
  "Invalid credentials": "Invalid email or password. Please try again.",
  "User already exists": "An account with this email already exists.",
  "Email already registered": "An account with this email already exists.",
  "Invalid token": "Your session has expired. Please log in again.",
  "Token expired": "Your session has expired. Please log in again.",
  Unauthorized: "You are not authorized to perform this action.",
  "Network Error":
    "Unable to connect to the server. Please check your internet connection.",
};

/**
 * Get a user-friendly error message
 * @param error - Error object or message string
 * @returns User-friendly error message
 */
export function getErrorMessage(error: any): string {
  // Handle axios error response
  if (error?.response?.data?.message) {
    const backendMessage = error.response.data.message;
    return errorMessageMap[backendMessage] || backendMessage;
  }

  // Handle error message string
  if (typeof error === "string") {
    return errorMessageMap[error] || error;
  }

  // Handle Error object
  if (error?.message) {
    return errorMessageMap[error.message] || error.message;
  }

  // Default error message
  return "An unexpected error occurred. Please try again.";
}
