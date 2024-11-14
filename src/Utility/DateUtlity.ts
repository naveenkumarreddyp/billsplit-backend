export class DateUtility {
  public static getCurrentDateAndTime(): string {
    const date = new Date();
    return date.toISOString();
  }

  public static getFormattedDate(date: Date): string {
    return date.toLocaleDateString();
  }

  public static getFormattedTime(date: Date): string {
    return date.toLocaleTimeString();
  }

  public static getFormattedDateTime(date: Date): string {
    return `${this.getFormattedDate(date)} ${this.getFormattedTime(date)}`;
  }

  public static getTodayStartDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Sets hours, minutes, seconds, and milliseconds to 0
    return today;
  }

  public static getMonthStartDate() {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1); // Sets day to 1 (first day of the month)
    monthStart.setHours(0, 0, 0, 0); // Sets hours, minutes, seconds, and milliseconds to 0
    return monthStart;
  }
  public static getYearStartDate() {
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1); // Creates date with time set to 00:00:00.000 automatically
    return yearStart;
  }

  public static getMonthName(monthNumber: number) {
    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return month[monthNumber - 1];
  }
}
