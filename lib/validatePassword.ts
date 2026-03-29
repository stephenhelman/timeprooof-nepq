export function validatePassword(pw: string): string | null {
  if (!pw || pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Must contain at least 1 uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Must contain at least 1 lowercase letter.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Must contain at least 1 special character.";
  return null;
}
