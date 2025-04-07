export const isAdminEmail = (email: string | null | undefined): boolean => {
    return !!email && email.toLowerCase().includes('admin');
  };
  