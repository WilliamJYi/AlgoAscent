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

// Filter problems for a specific date
export const filterProblemsByDate = (problems = [], date) => {
  if (!problems || !Array.isArray(problems)) {
    console.error("Problems is undefined or not an array:", problems);
    return []; // Return an empty array to prevent errors
  }

  return problems.filter((app) => {
    if (!app.date_added) return false; // Ensure date exists
    const appDate = new Date(app.date_added).toLocaleDateString();
    return appDate === date.toLocaleDateString();
  });
};

// Filter problems within the current week
export const filterProblemsByCurrentWeek = (problems = []) => {
  const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  if (!problems || !Array.isArray(problems)) {
    console.error("Problems is undefined or not an array:", problems);
    return [];
  }
  return problems.filter((app) => {
    const problemDate = new Date(app.date_added);
    return problemDate >= startOfWeek && problemDate <= endOfWeek;
  });
};
