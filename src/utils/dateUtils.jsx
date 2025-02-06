// Get the start and end dates of the current week
export const getCurrentWeekRange = () => {
  const today = new Date();

  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
  startOfWeek.setDate(today.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0); // Set time to start of the day

  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999); // Set time to end of the day

  return { startOfWeek, endOfWeek };
};

// Filter applications for a specific date
export const filterApplicationsByDate = (applications = [], date) => {
  if (!applications || !Array.isArray(applications)) {
    console.error("Applications is undefined or not an array:", applications);
    return []; // Return an empty array to prevent errors
  }

  return applications.filter((app) => {
    if (!app.date_added) return false; // Ensure date exists
    const appDate = new Date(app.date_added).toLocaleDateString();
    return appDate === date.toLocaleDateString();
  });
};

// Filter applications within the current week
export const filterApplicationsByCurrentWeek = (applications = []) => {
  const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  if (!applications || !Array.isArray(applications)) {
    console.error("Applications is undefined or not an array:", applications);
    return [];
  }
  return applications.filter((app) => {
    const applicationDate = new Date(app.date_added);
    return applicationDate >= startOfWeek && applicationDate <= endOfWeek;
  });
};
