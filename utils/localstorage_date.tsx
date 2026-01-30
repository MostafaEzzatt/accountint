export const getInitialDateFromLocal = () => {
  if (typeof window !== "undefined") {
    const savedDate = localStorage.getItem("form_date_key"); // change key name as needed
    if (savedDate) return savedDate;
  }
  return new Date().toLocaleDateString();
};

export const saveDateToLocal = (data: string) => {
  if (typeof window !== "undefined") {
    // We stringify because localStorage only stores strings
    localStorage.setItem("form_date_key", data);
  }
};
