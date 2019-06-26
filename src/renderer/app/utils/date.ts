export const isToday = (date: Date) => {
  const current = new Date();
  return date.getFullYear() === current.getFullYear() &&
    date.getMonth() === current.getMonth() &&
    date.getDate() === current.getDate();
}
