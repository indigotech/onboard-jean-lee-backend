export const passwordValidator = (password: string) => {
  if (password.length < 6) {
    return false;
  }

  if (!/[a-z]|[A-Z]/.test(password)) {
    return false;
  }

  if (!/[0-9]/.test(password)) {
    return false;
  }

  return true;
};
