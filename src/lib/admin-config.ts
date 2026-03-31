export const ADMIN_EMAILS = ["bimex4@gmail.com", "hello.passmark@gmail.com"];

export const isAdminEmail = (email: string | null | undefined) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
