export const isValidDomain = (email) => {
  const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const domain = email.split('@')[1];
  return domainPattern.test(domain);
};
