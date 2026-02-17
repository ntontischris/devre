/**
 * Knowledge base seed data for the Devre Media chatbot.
 * Each entry has EN + EL content for bilingual RAG.
 */
export type KnowledgeSeedEntry = {
  category: string;
  title: string;
  content: string;
  content_en: string;
  content_el: string;
};

export const KNOWLEDGE_ENTRIES: KnowledgeSeedEntry[] = [
  // ── ABOUT ──
  {
    category: 'about',
    title: 'About Devre Media',
    content: 'Devre Media is a video production and content agency based in Vienna, Austria and Thessaloniki, Greece.',
    content_en:
      'Devre Media is a video production and advertising content agency based in Vienna, Austria and Thessaloniki, Greece. We combine the speed of modern digital production with the quality standards of traditional cinematography. We specialize in social media videos, corporate films, podcast production, and event coverage. Our lightweight, agile approach means we deliver in days where others take weeks.',
    content_el:
      'Η Devre Media είναι ένα γραφείο παραγωγής βίντεο και διαφημιστικού περιεχομένου με έδρα τη Βιέννη, Αυστρία και τη Θεσσαλονίκη, Ελλάδα. Συνδυάζουμε την ταχύτητα της σύγχρονης ψηφιακής παραγωγής με τα πρότυπα ποιότητας της παραδοσιακής κινηματογράφησης. Εξειδικευόμαστε σε βίντεο social media, εταιρικές ταινίες, παραγωγή podcast και κάλυψη εκδηλώσεων.',
  },
  {
    category: 'about',
    title: 'Our Approach',
    content: 'We sit between expensive cinematographers and phone-content creators.',
    content_en:
      'The market has two extremes: heavy-camera cinematographers who are slow and expensive, and phone-wielding content creators who sacrifice quality. We sit right in the middle. Mobile-first setup means we shoot fast — in 1-2 filming days we produce an entire month of content. Every frame follows real cinematography rules: composition, lighting, color grading. We also plan content strategy, topics, and filming schedules alongside you.',
    content_el:
      'Η αγορά έχει δύο άκρα: βαριούς κινηματογραφιστές που είναι αργοί και ακριβοί, και δημιουργούς περιεχομένου με κινητά που θυσιάζουν την ποιότητα. Εμείς είμαστε ακριβώς στη μέση. Mobile-first setup σημαίνει γρήγορη λήψη — σε 1-2 μέρες γυρίσματα παράγουμε περιεχόμενο για ολόκληρο μήνα. Κάθε καρέ ακολουθεί κανόνες κινηματογράφησης: σύνθεση, φωτισμό, color grading.',
  },
  // ── SERVICES ──
  {
    category: 'services',
    title: 'Social Media Video Production',
    content: 'Monthly social media video packages from 4 to 12+ videos per month.',
    content_en:
      'Social Media Video: Monthly packages of 4-12+ videos per month. Includes brief, filming (1-2 days, up to 6 hours each), full editing, copyright-free music, subtitles, and 1 revision round per video. Content is delivered within 7 business days. Drone footage is included in Growth and Scale packages.',
    content_el:
      'Social Media Video: Μηνιαία πακέτα 4-12+ βίντεο το μήνα. Περιλαμβάνει brief, γυρίσματα (1-2 μέρες, έως 6 ώρες), πλήρη επεξεργασία, royalty-free μουσική, υπότιτλους και 1 γύρο αλλαγών ανά βίντεο. Παράδοση εντός 7 εργάσιμων ημερών. Drone footage περιλαμβάνεται στα πακέτα Growth και Scale.',
  },
  {
    category: 'services',
    title: 'Podcast Production',
    content: 'Full podcast setup with multi-camera recording and editing.',
    content_en:
      'Podcast Production: Full podcast setup with 3-camera recording, professional editing, and short clips for social media promotion. Available in packages of 4-8 episodes per month. We handle the full setup, recording, editing, and delivery of social-ready clips.',
    content_el:
      'Παραγωγή Podcast: Πλήρες setup podcast με 3 κάμερες, επαγγελματική επεξεργασία και σύντομα clips για προώθηση στα social media. Διαθέσιμο σε πακέτα 4-8 επεισοδίων το μήνα. Αναλαμβάνουμε setup, εγγραφή, επεξεργασία και παράδοση social-ready clips.',
  },
  {
    category: 'services',
    title: 'Event Coverage',
    content: 'On-the-spot event video content with same-day delivery.',
    content_en:
      'Event Coverage: On-the-spot event content delivered the same day or by next morning. 3-6 polished videos per event. Drone footage included. Perfect for launches, openings, galas, conferences, and brand events.',
    content_el:
      'Κάλυψη Εκδηλώσεων: Περιεχόμενο εκδηλώσεων που παραδίδεται αυθημερόν ή το επόμενο πρωί. 3-6 επεξεργασμένα βίντεο ανά εκδήλωση. Drone footage περιλαμβάνεται. Ιδανικό για launches, εγκαίνια, galas, συνέδρια και brand events.',
  },
  {
    category: 'services',
    title: 'Corporate & Commercials',
    content: 'Large-scale brand films and commercial productions.',
    content_en:
      'Corporate & Commercials: Large-scale productions including brand films, TV-ready commercials, and corporate presentations. Full scripting, storyboarding, multi-day shoots, and professional post-production. Custom quoted per project. 50/50 payment terms (50% upfront, 50% on delivery).',
    content_el:
      'Εταιρικά & Commercials: Μεγάλης κλίμακας παραγωγές συμπεριλαμβανομένων brand films, διαφημιστικών για TV και εταιρικών παρουσιάσεων. Πλήρες scripting, storyboarding, πολυήμερα γυρίσματα και επαγγελματικό post-production. Custom τιμολόγηση ανά project. Πληρωμή 50/50 (50% προκαταβολή, 50% κατά την παράδοση).',
  },
  {
    category: 'services',
    title: 'Graphic Design',
    content: 'Brand identity, social media graphics, and visual assets.',
    content_en:
      'Graphic Design: Brand identity design, social media graphics, thumbnails, and visual assets that complement your video content perfectly. We create cohesive visual branding across all your channels.',
    content_el:
      'Graphic Design: Σχεδιασμός brand identity, social media graphics, thumbnails και οπτικά assets που συμπληρώνουν τέλεια το video content σας. Δημιουργούμε συνεκτικό visual branding σε όλα τα κανάλια σας.',
  },
  {
    category: 'services',
    title: 'Copywriting',
    content: 'Scripts, captions, and brand messaging for video content.',
    content_en:
      'Copywriting: Compelling scripts, captions, and brand messaging that give your visual content the words it deserves. We write in both Greek and English for international brands.',
    content_el:
      'Copywriting: Δημιουργικά scripts, captions και brand messaging που δίνουν στο οπτικό σας περιεχόμενο τις λέξεις που αξίζει. Γράφουμε σε Ελληνικά και Αγγλικά για διεθνή brands.',
  },
  // ── PRICING ──
  {
    category: 'pricing',
    title: 'Social Media Pricing Packages',
    content: 'Three tiers: Starter (4 videos), Growth (8 videos), Scale (12 videos).',
    content_en:
      'Social Media Video Pricing:\n- Starter: 4 videos/month — 1 filming day (up to 6 hours), full editing, music, subtitles, content brief, 1 revision round\n- Growth (Most Popular): 8 videos/month — 2 filming days, includes drone footage, full editing, music, subtitles, content brief, 1 revision round\n- Scale: 12 videos/month — 2 filming days, includes drone + same-day delivery, full editing, music, subtitles, content brief, 1 revision round\n\nMinimum commitment: 3 months. Exact pricing is customized per client — contact us for a quote.',
    content_el:
      'Τιμοκατάλογος Social Media Video:\n- Starter: 4 βίντεο/μήνα — 1 μέρα γυρισμάτων (έως 6 ώρες), πλήρης επεξεργασία, μουσική, υπότιτλοι, content brief, 1 γύρος αλλαγών\n- Growth (Δημοφιλέστερο): 8 βίντεο/μήνα — 2 μέρες γυρισμάτων, drone footage, πλήρης επεξεργασία, μουσική, υπότιτλοι, content brief, 1 γύρος αλλαγών\n- Scale: 12 βίντεο/μήνα — 2 μέρες γυρισμάτων, drone + same-day delivery, πλήρης επεξεργασία, μουσική, υπότιτλοι, content brief, 1 γύρος αλλαγών\n\nΕλάχιστη δέσμευση: 3 μήνες. Οι ακριβείς τιμές προσαρμόζονται ανά πελάτη — επικοινωνήστε μαζί μας.',
  },
  {
    category: 'pricing',
    title: 'Podcast & Event Pricing',
    content: 'Podcast: 4-8 episodes/month. Events: 3-6 videos per event.',
    content_en:
      'Podcast Packages: 4-8 episodes per month. 3-camera setup, full editing, social media clips included.\nEvent On-the-Spot: 3-6 polished videos from your event, delivered same-day or by next morning.\nCorporate & commercials: Custom quoted per project. 50/50 payment terms.\n\nAll pricing is customized — book a free discovery call for an exact quote.',
    content_el:
      'Πακέτα Podcast: 4-8 επεισόδια/μήνα. 3-camera setup, πλήρης επεξεργασία, social media clips.\nEvent On-the-Spot: 3-6 βίντεο από την εκδήλωσή σας, παράδοση αυθημερόν ή μέχρι το επόμενο πρωί.\nΕταιρικά & commercials: Custom τιμολόγηση ανά project. Πληρωμή 50/50.\n\nΌλες οι τιμές είναι προσαρμοσμένες — κλείστε ένα δωρεάν discovery call για ακριβή τιμή.',
  },
  // ── PROCESS ──
  {
    category: 'process',
    title: 'How We Work - Our Process',
    content: 'Four-step process: Discovery Call, Strategy & Brief, Filming Days, Edit & Deliver.',
    content_en:
      'Our 4-step process:\n1. Discovery Call: 30-45 minute call to learn your business, goals, competitors, and vision\n2. Strategy & Brief: We propose 1-2 tailored packages, plan topics, content calendar, and lock in filming dates\n3. Filming Days: In just 1-2 days of filming (up to 6 hours each), we capture enough material for your entire month\n4. Edit & Deliver: Professional editing, color grading, music, and subtitles. Delivered within 7 business days with 1 revision round\n\nThe discovery call is free and has no obligation.',
    content_el:
      'Η διαδικασία μας σε 4 βήματα:\n1. Discovery Call: 30-45 λεπτά κλήση για να μάθουμε την επιχείρησή σας, τους στόχους, τον ανταγωνισμό και το όραμά σας\n2. Στρατηγική & Brief: Προτείνουμε 1-2 εξατομικευμένα πακέτα, σχεδιάζουμε θέματα, content calendar και κλειδώνουμε ημερομηνίες γυρισμάτων\n3. Μέρες Γυρισμάτων: Σε μόλις 1-2 μέρες γυρισμάτων (έως 6 ώρες), καταγράφουμε αρκετό υλικό για ολόκληρο τον μήνα\n4. Επεξεργασία & Παράδοση: Επαγγελματική επεξεργασία, color grading, μουσική, υπότιτλοι. Παράδοση εντός 7 εργάσιμων ημερών με 1 γύρο αλλαγών\n\nΤο discovery call είναι δωρεάν και χωρίς υποχρέωση.',
  },
  // ── TEAM ──
  {
    category: 'team',
    title: 'Our Team',
    content: 'Haris Devrentlis (Editing Director) and Angelos Devrentlis (Managing Director).',
    content_en:
      'The Devre Media Team:\n- Haris Devrentlis — Editing Director: Master of post-production with an eye for cinematic storytelling. Haris transforms raw footage into compelling visual narratives that captivate audiences and elevate brands.\n- Angelos Devrentlis — Managing Director: The strategic mind behind Devre Media. Angelos handles client relationships, content strategy, and ensures every project exceeds expectations from brief to final cut.\n\nWe are a small, dedicated team that treats every project as our own.',
    content_el:
      'Η Ομάδα Devre Media:\n- Χάρης Δεβρεντλής — Editing Director: Ειδικός στο post-production με μάτι για κινηματογραφική αφήγηση. Ο Χάρης μετατρέπει raw footage σε συναρπαστικές οπτικές αφηγήσεις.\n- Άγγελος Δεβρεντλής — Managing Director: Ο στρατηγικός νους πίσω από την Devre Media. Ο Άγγελος διαχειρίζεται σχέσεις πελατών, content strategy και διασφαλίζει ότι κάθε project ξεπερνά τις προσδοκίες.\n\nΕίμαστε μια μικρή, αφοσιωμένη ομάδα που αντιμετωπίζει κάθε project σαν δικό της.',
  },
  // ── CONTACT ──
  {
    category: 'contact',
    title: 'Contact Information',
    content: 'Vienna and Thessaloniki offices with phone and email.',
    content_en:
      'Contact Devre Media:\n- Vienna Office: Meidlgasse 25, 1110 Vienna, Austria\n- Greece Office: Thessaloniki, Greece\n- Phone (Austria): +43 670 650 2131\n- Phone (Greece): +30 6984 592 968\n- Email: devremedia@gmail.com\n- Instagram: @devre.media\n- TikTok: @devre.media\n- LinkedIn: Devre Media\n- YouTube: @devremedia\n\nWe are available for projects across Europe and internationally.',
    content_el:
      'Επικοινωνία με Devre Media:\n- Γραφείο Βιέννης: Meidlgasse 25, 1110 Vienna, Αυστρία\n- Γραφείο Ελλάδας: Θεσσαλονίκη, Ελλάδα\n- Τηλέφωνο (Αυστρία): +43 670 650 2131\n- Τηλέφωνο (Ελλάδα): +30 6984 592 968\n- Email: devremedia@gmail.com\n- Instagram: @devre.media\n- TikTok: @devre.media\n- LinkedIn: Devre Media\n- YouTube: @devremedia\n\nΕίμαστε διαθέσιμοι για projects σε όλη την Ευρώπη και διεθνώς.',
  },
  // ── FAQ ──
  {
    category: 'faq',
    title: 'Delivery Timeline',
    content: 'Standard delivery is 7 business days. Events delivered same-day.',
    content_en:
      'Delivery timelines:\n- Social media videos: 7 business days after filming\n- Podcast episodes: 7 business days after recording\n- Event coverage: Same-day or by next morning\n- Corporate/commercials: Timeline discussed per project\n\nEach video includes 1 revision round. Additional revisions can be arranged.',
    content_el:
      'Χρόνοι παράδοσης:\n- Social media βίντεο: 7 εργάσιμες ημέρες μετά τα γυρίσματα\n- Podcast επεισόδια: 7 εργάσιμες ημέρες μετά την εγγραφή\n- Κάλυψη εκδηλώσεων: Αυθημερόν ή μέχρι το επόμενο πρωί\n- Εταιρικά/commercials: Ο χρόνος συζητείται ανά project\n\nΚάθε βίντεο περιλαμβάνει 1 γύρο αλλαγών. Πρόσθετες αλλαγές μπορούν να κανονιστούν.',
  },
  {
    category: 'faq',
    title: 'Minimum Commitment',
    content: 'Minimum 3-month commitment for monthly packages.',
    content_en:
      'We require a minimum 3-month commitment for monthly social media and podcast packages. This is because real brand building takes time — consistency is key to growing your audience and building a recognizable brand. We prefer annual collaborations over one-off projects, investing in understanding your brand deeply.',
    content_el:
      'Απαιτούμε ελάχιστη δέσμευση 3 μηνών για μηνιαία πακέτα social media και podcast. Αυτό γιατί το πραγματικό brand building χρειάζεται χρόνο — η συνέπεια είναι το κλειδί για την ανάπτυξη του κοινού σας. Προτιμούμε ετήσιες συνεργασίες από μεμονωμένα projects.',
  },
  {
    category: 'faq',
    title: 'What is included in every package',
    content: 'All packages include drone footage, music, subtitles, and content strategy.',
    content_en:
      'Every Devre Media package includes:\n- Drone footage (always included, not an upsell)\n- Copyright-free music\n- Subtitles\n- Content strategy and topic planning\n- Professional color grading\n- 1 revision round per video\n\nWe handle everything from strategy to final cut under one roof.',
    content_el:
      'Κάθε πακέτο Devre Media περιλαμβάνει:\n- Drone footage (πάντα περιλαμβάνεται, δεν είναι upsell)\n- Royalty-free μουσική\n- Υπότιτλους\n- Content strategy και σχεδιασμό θεμάτων\n- Επαγγελματικό color grading\n- 1 γύρο αλλαγών ανά βίντεο\n\nΑναλαμβάνουμε τα πάντα από strategy μέχρι final cut κάτω από μία στέγη.',
  },
  // ── CLIENTS / CASE STUDIES ──
  {
    category: 'clients',
    title: 'Notable Clients and Case Studies',
    content: 'Working with UFC, ADCC, Technomat, REMAX, and many more.',
    content_en:
      'Our notable clients and case studies:\n- Mavri Thalassa: Full content partnership with 60 reels, 3 vlogs, and 6 podcast episodes per month — the go-to brand in the Thessaloniki food scene\n- Technomat: Started with 4 videos/month, scaled to 8 within months due to strong performance\n- Ophthalmica: 8 videos/month building the image of a cutting-edge medical clinic\n\nWe also work with UFC, AJP, ADCC, Alpha Jiu-Jitsu, Almeco, Stammdesign, RE/MAX, Sunteak, Ariston, 1516 Brewing, Cincin Catering, and more. 200+ projects delivered for 50+ brands.',
    content_el:
      'Αξιοσημείωτοι πελάτες:\n- Μαύρη Θάλασσα: Πλήρης συνεργασία περιεχομένου με 60 reels, 3 vlogs και 6 podcast επεισόδια/μήνα\n- Technomat: Ξεκίνησε με 4 βίντεο/μήνα, κλιμακώθηκε σε 8 λόγω ισχυρής απόδοσης\n- Ophthalmica: 8 βίντεο/μήνα χτίζοντας την εικόνα κορυφαίας ιατρικής κλινικής\n\nΣυνεργαζόμαστε επίσης με UFC, AJP, ADCC, Almeco, RE/MAX, Sunteak, Ariston και πολλά ακόμα. 200+ projects για 50+ brands.',
  },
  // ── WHY US ──
  {
    category: 'why_us',
    title: 'Why Choose Devre Media',
    content: 'Cinematic quality, fast delivery, long-term partnerships, drone included.',
    content_en:
      'Why choose Devre Media:\n1. Cinematic aesthetics: Every piece follows professional cinematography rules — your brand deserves more than phone-shot clips\n2. Speed without compromise: Social and podcasts delivered in 7 business days, events same-day\n3. Long-term partnership: We prefer annual collaborations, investing deeply in your brand\n4. Clear terms, no surprises: Contracts, defined revision rounds, transparent payment schedules\n5. Content strategy included: We plan topics, scripts, and posting calendars together\n6. Drone always included: Aerial footage is standard, not an upsell\n\n3+ years in the game, 200+ projects delivered.',
    content_el:
      'Γιατί να επιλέξετε τη Devre Media:\n1. Κινηματογραφική αισθητική: Κάθε κομμάτι ακολουθεί κανόνες κινηματογράφησης\n2. Ταχύτητα χωρίς συμβιβασμούς: Social και podcasts σε 7 εργάσιμες, events αυθημερόν\n3. Μακροχρόνια συνεργασία: Προτιμούμε ετήσιες συνεργασίες, επενδύοντας στο brand σας\n4. Σαφείς όροι, χωρίς εκπλήξεις: Συμβόλαια, καθορισμένοι γύροι αλλαγών, διαφανή πληρωμές\n5. Content strategy περιλαμβάνεται: Σχεδιάζουμε θέματα, scripts και posting calendars μαζί\n6. Drone πάντα περιλαμβάνεται: Αεροφωτογραφία στάνταρ, όχι upsell\n\n3+ χρόνια εμπειρίας, 200+ projects.',
  },
];
