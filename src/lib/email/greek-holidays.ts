interface HolidayInfo {
  date: string; // YYYY-MM-DD
  nameEl: string;
  nameEn: string;
  greetingEl: string;
  greetingEn: string;
}

/**
 * Calculate Orthodox Easter date using the Meeus algorithm.
 * Returns the date of Easter Sunday for the given year.
 */
export function calculateOrthodoxEaster(year: number): Date {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31); // 3 = March, 4 = April
  const day = ((d + e + 114) % 31) + 1;

  // Julian calendar date — convert to Gregorian by adding 13 days (valid 1900-2099)
  const julian = new Date(year, month - 1, day);
  julian.setDate(julian.getDate() + 13);
  return julian;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getGreekHolidays(year: number): HolidayInfo[] {
  const easter = calculateOrthodoxEaster(year);

  const holidays: HolidayInfo[] = [
    // Fixed holidays
    {
      date: `${year}-01-01`,
      nameEl: 'Πρωτοχρονιά',
      nameEn: "New Year's Day",
      greetingEl:
        'Καλή Χρονιά! Σας ευχόμαστε υγεία, ευτυχία και δημιουργική χρονιά γεμάτη επιτυχίες.',
      greetingEn:
        'Happy New Year! Wishing you health, happiness, and a creative year full of success.',
    },
    {
      date: `${year}-01-06`,
      nameEl: 'Θεοφάνεια',
      nameEn: 'Epiphany',
      greetingEl: 'Χρόνια πολλά για τα Θεοφάνεια! Σας ευχόμαστε φώτιση και ευλογία.',
      greetingEn: 'Happy Epiphany! Wishing you light and blessings.',
    },
    {
      date: `${year}-03-25`,
      nameEl: '25η Μαρτίου',
      nameEn: 'Greek Independence Day',
      greetingEl: 'Χρόνια πολλά! Τιμούμε την εθνική μας ιστορία και γιορτάζουμε τον Ευαγγελισμό.',
      greetingEn: 'Happy Greek Independence Day! Honoring our national heritage.',
    },
    {
      date: `${year}-05-01`,
      nameEl: 'Πρωτομαγιά',
      nameEn: 'Labour Day',
      greetingEl: 'Καλή Πρωτομαγιά! Σας ευχόμαστε ένα υπέροχο Μάιο γεμάτο δημιουργικότητα.',
      greetingEn: 'Happy May Day! Wishing you a wonderful and creative month ahead.',
    },
    {
      date: `${year}-08-15`,
      nameEl: 'Κοίμηση της Θεοτόκου',
      nameEn: 'Assumption of Mary',
      greetingEl: 'Χρόνια πολλά! Σας ευχόμαστε καλό καλοκαίρι και ξεκούραση.',
      greetingEn: 'Happy Assumption Day! Wishing you a wonderful summer.',
    },
    {
      date: `${year}-10-28`,
      nameEl: 'Ημέρα του Όχι',
      nameEn: 'Ohi Day',
      greetingEl: 'Χρόνια πολλά για τη γιορτή της 28ης Οκτωβρίου!',
      greetingEn: 'Happy Ohi Day! Celebrating courage and national pride.',
    },
    {
      date: `${year}-12-25`,
      nameEl: 'Χριστούγεννα',
      nameEn: 'Christmas',
      greetingEl:
        'Καλά Χριστούγεννα! Σας ευχόμαστε χαρά, αγάπη και δημιουργικές στιγμές δίπλα στους αγαπημένους σας.',
      greetingEn:
        'Merry Christmas! Wishing you joy, love, and creative moments with your loved ones.',
    },
    {
      date: `${year}-12-26`,
      nameEl: 'Σύναξη της Θεοτόκου',
      nameEn: 'Day after Christmas',
      greetingEl: 'Χρόνια πολλά! Καλές γιορτές και ξεκούραση.',
      greetingEn: 'Happy Holidays! Enjoy the festive season.',
    },

    // Variable holidays based on Orthodox Easter
    {
      date: formatDate(addDays(easter, -48)),
      nameEl: 'Καθαρά Δευτέρα',
      nameEn: 'Clean Monday',
      greetingEl: 'Καλή Σαρακοστή! Σας ευχόμαστε καλή δύναμη και αισιοδοξία.',
      greetingEn: 'Happy Clean Monday! Wishing you strength and optimism for the Lenten season.',
    },
    {
      date: formatDate(addDays(easter, -2)),
      nameEl: 'Μεγάλη Παρασκευή',
      nameEn: 'Good Friday',
      greetingEl: 'Καλό Πάσχα! Σας ευχόμαστε ήρεμες και γαλήνιες γιορτές.',
      greetingEn: 'Wishing you a peaceful Good Friday and a blessed Easter.',
    },
    {
      date: formatDate(easter),
      nameEl: 'Πάσχα',
      nameEn: 'Easter Sunday',
      greetingEl: 'Χριστός Ανέστη! Καλό Πάσχα με υγεία, χαρά και αγάπη.',
      greetingEn: 'Happy Easter! Wishing you joy, health, and love.',
    },
    {
      date: formatDate(addDays(easter, 1)),
      nameEl: 'Δευτέρα του Πάσχα',
      nameEn: 'Easter Monday',
      greetingEl: 'Χρόνια πολλά! Καλή ξεκούραση και χαρούμενες γιορτές.',
      greetingEn: 'Happy Easter Monday! Enjoy the holiday.',
    },
    {
      date: formatDate(addDays(easter, 50)),
      nameEl: 'Αγίου Πνεύματος',
      nameEn: 'Whit Monday',
      greetingEl: 'Χρόνια πολλά για του Αγίου Πνεύματος!',
      greetingEn: 'Happy Whit Monday!',
    },
  ];

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Check if today is a Greek holiday. Uses Athens timezone (Europe/Athens).
 */
export function isGreekHolidayToday(): { isHoliday: boolean; holiday?: HolidayInfo } {
  const now = new Date();
  // Get today's date in Athens timezone
  const athensDate = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' }); // YYYY-MM-DD format
  const year = parseInt(athensDate.split('-')[0], 10);

  const holidays = getGreekHolidays(year);
  const holiday = holidays.find((h) => h.date === athensDate);

  return holiday ? { isHoliday: true, holiday } : { isHoliday: false };
}
