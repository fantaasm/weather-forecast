export const weekDays:string[] = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
export const months:string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"]

export function getCurrentDateString(): string {
  const today = new Date()
  // sunday = 0

  return `${weekDays[today.getDay()].substring(0, 3).concat(".")} ${today.getDate()} ${months[today.getMonth()].substring(0, 3)}`
}

export function getDateFromUnix(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function convertTimeToHumanReadable(x: number): string {
  const date = new Date(x * 1000)
  return convertFrom24To12Format(date.getHours())
}

function convertFrom24To12Format(time24: number): string {
  const period = +time24 < 12 ? 'AM' : 'PM';
  const hours = +time24 % 12 || 12;
  return `${hours} ${period}`;
}