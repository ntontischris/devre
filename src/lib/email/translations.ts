type Locale = 'el' | 'en';

interface FilmingReminderStrings {
  subject: string;
  greeting: (name: string) => string;
  body: (packageName: string, deliverables: string) => string;
  cta: string;
  footer: string;
}

interface InvoiceNotificationStrings {
  subject: (invoiceNumber: string) => string;
  greeting: (name: string) => string;
  body: (invoiceNumber: string, total: string, dueDate: string) => string;
  cta: string;
}

interface ProjectCompletedStrings {
  subject: (projectTitle: string) => string;
  greeting: (name: string) => string;
  body: (projectTitle: string, count: number) => string;
  cta: string;
}

interface HolidayGreetingStrings {
  subject: (holidayName: string) => string;
  greeting: (name: string) => string;
  signoff: string;
}

interface BaseStrings {
  companyTagline: string;
  unsubscribeHint: string;
}

interface EmailTranslations {
  base: BaseStrings;
  filmingReminder: FilmingReminderStrings;
  invoiceNotification: InvoiceNotificationStrings;
  projectCompleted: ProjectCompletedStrings;
  holidayGreeting: HolidayGreetingStrings;
}

const el: EmailTranslations = {
  base: {
    companyTagline: 'Video Production & Creative Content',
    unsubscribeHint: 'Αν δεν θέλετε να λαμβάνετε αυτά τα emails, επικοινωνήστε μαζί μας.',
  },
  filmingReminder: {
    subject: 'Προγραμματισμός γυρισμάτων — Επόμενος μήνας',
    greeting: (name) => `Γεια σου ${name},`,
    body: (packageName, deliverables) =>
      `Ήρθε η ώρα να κλείσεις τις ημερομηνίες για τα γυρίσματα του επόμενου μήνα. Με βάση το πακέτο σου (${packageName} — ${deliverables}), μπες στην πλατφόρμα για να επιλέξεις τις ημερομηνίες που σε βολεύουν.`,
    cta: 'Κλείσε Ημερομηνίες',
    footer: 'Κλείδωσε εγκαίρως τις ημερομηνίες σου για να εξασφαλίσεις διαθεσιμότητα.',
  },
  invoiceNotification: {
    subject: (num) => `Νέο τιμολόγιο ${num}`,
    greeting: (name) => `Γεια σου ${name},`,
    body: (num, total, dueDate) =>
      `Το τιμολόγιο ${num} εκδόθηκε και είναι διαθέσιμο στην πλατφόρμα. Ποσό: ${total}. Ημερομηνία λήξης: ${dueDate}.`,
    cta: 'Δες το Τιμολόγιο',
  },
  projectCompleted: {
    subject: (title) => `Τα παραδοτέα του "${title}" είναι έτοιμα`,
    greeting: (name) => `Γεια σου ${name},`,
    body: (title, count) =>
      `Τα παραδοτέα για το project "${title}" (${count} αρχεί${count === 1 ? 'ο' : 'α'}) είναι πλέον διαθέσιμα στην πλατφόρμα. Μπες για να τα δεις και να τα κατεβάσεις.`,
    cta: 'Δες τα Αρχεία',
  },
  holidayGreeting: {
    subject: (holiday) => `${holiday} — Ευχές από τη Devre Media`,
    greeting: (name) => `Αγαπητέ/ή ${name},`,
    signoff: 'Με εκτίμηση,\nΗ ομάδα της Devre Media',
  },
};

const en: EmailTranslations = {
  base: {
    companyTagline: 'Video Production & Creative Content',
    unsubscribeHint: "If you'd like to stop receiving these emails, please contact us.",
  },
  filmingReminder: {
    subject: 'Filming Schedule — Next Month',
    greeting: (name) => `Hi ${name},`,
    body: (packageName, deliverables) =>
      `It's time to book your filming dates for next month. Based on your package (${packageName} — ${deliverables}), please log in to select your preferred dates.`,
    cta: 'Book Filming Dates',
    footer: 'Book your dates early to ensure availability.',
  },
  invoiceNotification: {
    subject: (num) => `New Invoice ${num}`,
    greeting: (name) => `Hi ${name},`,
    body: (num, total, dueDate) =>
      `Invoice ${num} has been issued and is available on the platform. Amount: ${total}. Due date: ${dueDate}.`,
    cta: 'View Invoice',
  },
  projectCompleted: {
    subject: (title) => `Deliverables for "${title}" are ready`,
    greeting: (name) => `Hi ${name},`,
    body: (title, count) =>
      `The deliverables for project "${title}" (${count} file${count === 1 ? '' : 's'}) are now available on the platform. Log in to review and download them.`,
    cta: 'View Deliverables',
  },
  holidayGreeting: {
    subject: (holiday) => `${holiday} — Greetings from Devre Media`,
    greeting: (name) => `Dear ${name},`,
    signoff: 'Warm regards,\nThe Devre Media Team',
  },
};

const translations: Record<Locale, EmailTranslations> = { el, en };

export function getEmailTranslations(locale: Locale): EmailTranslations {
  return translations[locale] ?? translations.el;
}
