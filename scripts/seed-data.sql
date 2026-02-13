-- =============================================================================
-- Devre Media System - Demo Seed Data
-- =============================================================================
-- Τρέξε αυτό στο Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Admin User ID: 28c1112b-c764-4a46-84a4-446e5dc30d35
-- Client User ID: 436aff98-00c5-48b3-bed8-bce380a01501
-- =============================================================================

-- Απενεργοποίηση RLS προσωρινά για seed
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables DISABLE ROW LEVEL SECURITY;
ALTER TABLE video_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE filming_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_lists DISABLE ROW LEVEL SECURITY;
ALTER TABLE shot_lists DISABLE ROW LEVEL SECURITY;
ALTER TABLE concept_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Καθαρισμός (αντίστροφη σειρά dependencies)
TRUNCATE TABLE video_annotations CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE activity_log CASCADE;
TRUNCATE TABLE concept_notes CASCADE;
TRUNCATE TABLE shot_lists CASCADE;
TRUNCATE TABLE equipment_lists CASCADE;
TRUNCATE TABLE filming_requests CASCADE;
TRUNCATE TABLE contracts CASCADE;
TRUNCATE TABLE contract_templates CASCADE;
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE deliverables CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE clients CASCADE;

-- =============================================================================
DO $$
DECLARE
  -- User IDs (ήδη υπάρχουν στο auth)
  admin_id uuid := '28c1112b-c764-4a46-84a4-446e5dc30d35';
  client_id uuid := '436aff98-00c5-48b3-bed8-bce380a01501';

  -- Client IDs
  c1 uuid := gen_random_uuid();
  c2 uuid := gen_random_uuid();
  c3 uuid := gen_random_uuid();
  c4 uuid := gen_random_uuid();
  c5 uuid := gen_random_uuid();

  -- Project IDs
  p1 uuid := gen_random_uuid();
  p2 uuid := gen_random_uuid();
  p3 uuid := gen_random_uuid();
  p4 uuid := gen_random_uuid();
  p5 uuid := gen_random_uuid();
  p6 uuid := gen_random_uuid();
  p7 uuid := gen_random_uuid();
  p8 uuid := gen_random_uuid();

  -- Deliverable IDs
  d1 uuid := gen_random_uuid();
  d2 uuid := gen_random_uuid();
  d3 uuid := gen_random_uuid();
  d4 uuid := gen_random_uuid();
  d5 uuid := gen_random_uuid();

  -- Invoice IDs
  inv1 uuid := gen_random_uuid();
  inv2 uuid := gen_random_uuid();
  inv3 uuid := gen_random_uuid();
  inv4 uuid := gen_random_uuid();
  inv5 uuid := gen_random_uuid();

  -- Contract Template IDs
  tmpl1 uuid := gen_random_uuid();
  tmpl2 uuid := gen_random_uuid();

  -- Contract IDs
  con1 uuid := gen_random_uuid();
  con2 uuid := gen_random_uuid();
  con3 uuid := gen_random_uuid();

  -- Filming Request IDs
  fr1 uuid := gen_random_uuid();
  fr2 uuid := gen_random_uuid();

BEGIN

  -- =========================================================================
  -- CLIENTS
  -- =========================================================================
  INSERT INTO clients (id, user_id, company_name, contact_name, email, phone, address, vat_number, notes, status, created_at, updated_at) VALUES
  (c1, client_id, 'Hellas Foods SA', 'Dimitris Papadopoulos', 'client@demo.gr', '+30 210 555 1234', 'Λεωφόρος Κηφισίας 115, Μαρούσι 15124', 'EL123456789', 'Μεγάλη εταιρεία τροφίμων. Τακτικός πελάτης εταιρικών βίντεο. Πληρώνει εγκαίρως.', 'active', '2024-06-15T10:00:00Z', '2026-02-08T14:00:00Z'),
  (c2, NULL, 'Aegean Travel Group', 'Μαρία Γεωργίου', 'maria@aegeantravel.gr', '+30 210 555 5678', 'Πανεπιστημίου 32, Αθήνα 10679', 'EL987654321', 'Ταξιδιωτικό γραφείο. Χρειάζεται seasonal content για νησιά.', 'active', '2024-09-20T09:00:00Z', '2026-02-05T11:00:00Z'),
  (c3, NULL, 'TechStart Athens', 'Νίκος Πετρίδης', 'nikos@techstart.gr', '+30 210 555 9012', 'Ερμού 45, Σύνταγμα, Αθήνα 10563', 'EL456789123', 'Tech startup incubator. Event coverage και social media content.', 'active', '2025-01-10T16:00:00Z', '2026-01-28T09:00:00Z'),
  (c4, NULL, 'Olympic Events & Catering', 'Σοφία Κωνσταντίνου', 'sofia@olympicevents.gr', '+30 210 555 3456', 'Βουλιαγμένης 200, Γλυφάδα 16674', 'EL789123456', 'Εταιρεία catering. Προηγούμενος πελάτης, ανενεργός τώρα. Εκκρεμεί πληρωμή.', 'inactive', '2023-11-05T13:00:00Z', '2025-08-15T10:00:00Z'),
  (c5, NULL, 'Marina Bay Hotel', 'Αλέξης Δήμου', 'alexis@marinabay.gr', '+30 22910 55789', 'Ακτή Ποσειδώνος 12, Πειραιάς 18533', 'EL321654987', 'Luxury hotel. Ενδιαφέρεται για promotional video. Follow up σχεδιασμένο.', 'lead', '2026-01-28T11:00:00Z', '2026-02-05T15:00:00Z');

  -- =========================================================================
  -- PROJECTS
  -- =========================================================================
  INSERT INTO projects (id, client_id, title, description, project_type, status, priority, start_date, deadline, budget, created_at, updated_at) VALUES
  (p1, c1, 'Spring Product Launch 2026', 'Εταιρικό βίντεο για νέα οργανική σειρά προϊόντων. Περιλαμβάνει γυρίσματα εργοστασίου, product shots και testimonials πελατών.', 'corporate_video', 'editing', 'high', '2026-01-15', '2026-02-28', 12500.00, '2026-01-10T09:00:00Z', '2026-02-08T16:00:00Z'),
  (p2, c2, 'Summer Islands Campaign', 'Social media video series με ελληνικά νησιά. 6 short-form videos για Instagram και TikTok.', 'social_media_content', 'pre_production', 'urgent', '2026-02-10', '2026-03-15', 8500.00, '2026-02-01T10:00:00Z', '2026-02-10T12:00:00Z'),
  (p3, c3, 'Startup Pitch Day 2026', 'Event coverage ετήσιου startup pitch competition. Multi-camera setup, συνεντεύξεις, highlights reel.', 'event_coverage', 'briefing', 'medium', '2026-03-20', '2026-04-05', 6000.00, '2026-02-05T14:00:00Z', '2026-02-05T14:00:00Z'),
  (p4, c1, 'Company Anniversary Documentary', 'Ντοκιμαντέρ 50ης επετείου. Ψηφιοποίηση παλιού υλικού, συνεντεύξεις ιδρυτών και εργαζομένων.', 'documentary', 'review', 'medium', '2025-11-01', '2026-02-15', 18000.00, '2025-10-20T09:00:00Z', '2026-02-09T17:00:00Z'),
  (p5, c2, 'Winter Ski Resort Promo', 'Commercial για χειμερινά πακέτα σκι. Drone footage, action shots, οικογενειακές στιγμές.', 'commercial', 'delivered', 'high', '2025-12-01', '2026-01-10', 9500.00, '2025-11-25T09:00:00Z', '2026-01-12T15:00:00Z'),
  (p6, c3, 'Monthly Tech Talks - February', 'Multi-camera recording μηνιαίου tech talk event. Live streaming + edited upload.', 'event_coverage', 'filming', 'medium', '2026-02-08', '2026-02-12', 3200.00, '2026-02-01T09:00:00Z', '2026-02-09T12:00:00Z'),
  (p7, c5, 'Hotel Tour & Amenities Video', 'Luxury hotel promotional video. Room tours, amenities, sunset views, restaurant showcase.', 'commercial', 'pre_production', 'low', '2026-02-12', '2026-03-10', 7500.00, '2026-02-10T10:00:00Z', '2026-02-10T10:00:00Z'),
  (p8, c1, 'Safety Training Series', 'Εσωτερικά εκπαιδευτικά βίντεο για κανόνες ασφαλείας εργοστασίου. 4 modules.', 'corporate_video', 'revisions', 'high', '2026-01-20', '2026-02-20', 5500.00, '2026-01-15T09:00:00Z', '2026-02-11T16:00:00Z');

  -- =========================================================================
  -- TASKS (20)
  -- =========================================================================
  INSERT INTO tasks (id, project_id, assigned_to, title, description, status, priority, due_date, sort_order, created_at, updated_at) VALUES
  -- p1: Spring Product Launch (editing)
  (gen_random_uuid(), p1, admin_id, 'Review rough cut with client', 'Κλείσε meeting και πάρε feedback στο τρέχον edit.', 'in_progress', 'high', '2026-02-14', 1, '2026-02-08T09:00:00Z', '2026-02-10T11:00:00Z'),
  (gen_random_uuid(), p1, NULL, 'Color grading', 'Εφαρμογή color grading σύμφωνα με brand guidelines.', 'todo', 'medium', '2026-02-18', 2, '2026-02-08T09:00:00Z', '2026-02-08T09:00:00Z'),
  (gen_random_uuid(), p1, admin_id, 'Sound mixing and mastering', 'Τελικό audio mix με μουσική και voiceover.', 'todo', 'medium', '2026-02-20', 3, '2026-02-08T09:00:00Z', '2026-02-08T09:00:00Z'),
  (gen_random_uuid(), p1, NULL, 'Factory B-roll footage captured', 'Γύρισμα 2 ωρών B-roll στο εργοστάσιο.', 'done', 'high', '2026-01-25', 0, '2026-01-20T09:00:00Z', '2026-01-26T18:00:00Z'),
  -- p2: Summer Islands (pre_production)
  (gen_random_uuid(), p2, admin_id, 'Scout locations in Santorini', 'Επίσκεψη Σαντορίνης για location scouting.', 'in_progress', 'urgent', '2026-02-15', 1, '2026-02-10T09:00:00Z', '2026-02-11T10:00:00Z'),
  (gen_random_uuid(), p2, admin_id, 'Finalize shot list', 'Ολοκλήρωση αναλυτικού shot list για 6 νησιά.', 'review', 'high', '2026-02-18', 2, '2026-02-10T09:00:00Z', '2026-02-11T10:00:00Z'),
  (gen_random_uuid(), p2, NULL, 'Book drone pilot', 'Πρόσληψη αδειοδοτημένου χειριστή drone.', 'todo', 'high', '2026-02-20', 3, '2026-02-10T09:00:00Z', '2026-02-10T09:00:00Z'),
  (gen_random_uuid(), p2, NULL, 'Initial client meeting completed', 'Συνάντηση με πελάτη για vision και deliverables.', 'done', 'urgent', '2026-02-05', 0, '2026-02-01T09:00:00Z', '2026-02-05T17:00:00Z'),
  -- p3: Startup Pitch Day (briefing)
  (gen_random_uuid(), p3, NULL, 'Venue visit and technical assessment', 'Επίσκεψη στον χώρο - αξιολόγηση φωτισμού, ρεύματος, ήχου.', 'todo', 'high', '2026-02-25', 1, '2026-02-05T09:00:00Z', '2026-02-05T09:00:00Z'),
  (gen_random_uuid(), p3, admin_id, 'Create equipment checklist', 'Λίστα εξοπλισμού multi-camera setup.', 'in_progress', 'medium', '2026-02-20', 2, '2026-02-05T09:00:00Z', '2026-02-11T10:00:00Z'),
  -- p4: Anniversary Documentary (review)
  (gen_random_uuid(), p4, admin_id, 'Client review - final cut', 'Αποστολή final cut για έγκριση πελάτη.', 'review', 'high', '2026-02-12', 1, '2026-02-09T09:00:00Z', '2026-02-09T09:00:00Z'),
  (gen_random_uuid(), p4, NULL, 'Archive footage restoration', 'Ψηφιοποίηση και αποκατάσταση φιλμ 8mm.', 'done', 'high', '2025-12-15', 0, '2025-11-10T09:00:00Z', '2025-12-18T17:00:00Z'),
  -- p6: Tech Talks (filming)
  (gen_random_uuid(), p6, admin_id, 'Set up live stream', 'Ρύθμιση live streaming στο YouTube. Test σύνδεσης.', 'in_progress', 'urgent', '2026-02-11', 1, '2026-02-09T09:00:00Z', '2026-02-11T10:00:00Z'),
  (gen_random_uuid(), p6, NULL, 'Audio check with venue', 'Δοκιμή audio feed από venue mixer.', 'todo', 'high', '2026-02-11', 2, '2026-02-09T09:00:00Z', '2026-02-09T09:00:00Z'),
  -- p7: Hotel Tour (pre_production)
  (gen_random_uuid(), p7, admin_id, 'Schedule filming dates', 'Συντονισμός με διεύθυνση ξενοδοχείου.', 'in_progress', 'medium', '2026-02-15', 1, '2026-02-10T09:00:00Z', '2026-02-11T10:00:00Z'),
  (gen_random_uuid(), p7, NULL, 'Draft storyboard', 'Δημιουργία visual storyboard για room tours.', 'todo', 'medium', '2026-02-18', 2, '2026-02-10T09:00:00Z', '2026-02-10T09:00:00Z'),
  -- p8: Safety Training (revisions)
  (gen_random_uuid(), p8, admin_id, 'Implement client feedback on Module 2', 'Ενημέρωση Module 2 βάσει σχολίων safety manager.', 'in_progress', 'high', '2026-02-13', 1, '2026-02-11T09:00:00Z', '2026-02-11T09:00:00Z'),
  (gen_random_uuid(), p8, NULL, 'Re-record voiceover for Module 4', 'Πελάτης ζήτησε πιο καθαρή προφορά τεχνικών όρων.', 'todo', 'medium', '2026-02-15', 2, '2026-02-11T09:00:00Z', '2026-02-11T09:00:00Z'),
  (gen_random_uuid(), p8, NULL, 'Modules 1-4 filmed and edited', 'Ολοκλήρωση 4 modules, σταλμένα για review.', 'done', 'high', '2026-02-05', 0, '2026-01-25T09:00:00Z', '2026-02-08T17:00:00Z'),
  (gen_random_uuid(), p5, NULL, 'Final delivery to client', 'Παράδοση τελικών αρχείων Ski Resort Promo.', 'done', 'high', '2026-01-10', 0, '2025-12-20T09:00:00Z', '2026-01-10T15:00:00Z');

  -- =========================================================================
  -- DELIVERABLES (5)
  -- =========================================================================
  INSERT INTO deliverables (id, project_id, title, description, file_path, file_size, file_type, version, status, download_count, expires_at, uploaded_by, created_at) VALUES
  (d1, p5, 'Winter Ski Resort Promo - Final Cut', 'Τελική εγκεκριμένη έκδοση για broadcast και social media.', 'deliverables/winter-ski-promo-final-v3.mp4', 2147483648, 'video/mp4', 3, 'final', 8, NULL, admin_id, '2026-01-10T14:00:00Z'),
  (d2, p4, '50th Anniversary Documentary - Review Cut', 'Πλήρες documentary cut για final client review.', 'deliverables/anniversary-doc-review-v2.mp4', 4294967296, 'video/mp4', 2, 'pending_review', 3, '2026-02-25T23:59:59Z', admin_id, '2026-02-09T17:00:00Z'),
  (d3, p1, 'Product Launch Video - Rough Cut', 'Πρώτο assembly για feedback πελάτη.', 'deliverables/spring-launch-rough-v1.mp4', 1610612736, 'video/mp4', 1, 'revision_requested', 5, '2026-02-20T23:59:59Z', admin_id, '2026-02-08T17:00:00Z'),
  (d4, p8, 'Safety Module 1 - Equipment Handling', 'Πρώτο εκπαιδευτικό module - ασφάλεια εξοπλισμού.', 'deliverables/safety-module-1-v2.mp4', 858993459, 'video/mp4', 2, 'approved', 12, NULL, admin_id, '2026-02-05T14:00:00Z'),
  (d5, p8, 'Safety Module 2 - Emergency Procedures', 'Δεύτερο εκπαιδευτικό module - αντιμετώπιση εκτάκτων.', 'deliverables/safety-module-2-v1.mp4', 943718400, 'video/mp4', 1, 'revision_requested', 2, '2026-02-18T23:59:59Z', admin_id, '2026-02-11T09:00:00Z');

  -- =========================================================================
  -- VIDEO ANNOTATIONS (5)
  -- =========================================================================
  INSERT INTO video_annotations (id, deliverable_id, user_id, timestamp_seconds, content, resolved, created_at) VALUES
  (gen_random_uuid(), d2, client_id, 45.5, 'Μπορούμε να βάλουμε το λογότυπο εδώ με ένα subtle animation;', false, '2026-02-10T10:30:00Z'),
  (gen_random_uuid(), d2, admin_id, 125.2, 'Τα audio levels χρειάζονται ρύθμιση - το voiceover είναι πολύ χαμηλά.', true, '2026-02-09T14:15:00Z'),
  (gen_random_uuid(), d3, client_id, 78.0, 'Το product shot πρέπει να είναι 3-4 δευτερόλεπτα μεγαλύτερο. Τώρα περνάει πολύ γρήγορα.', false, '2026-02-09T16:20:00Z'),
  (gen_random_uuid(), d3, client_id, 156.8, 'Αυτό το transition είναι τέλειο! Μπορούμε να χρησιμοποιήσουμε αυτό το style παντού;', false, '2026-02-09T16:25:00Z'),
  (gen_random_uuid(), d5, admin_id, 234.5, 'Χρειάζεται re-record αυτού του section με πιο καθαρή προφορά.', false, '2026-02-11T09:00:00Z');

  -- =========================================================================
  -- INVOICES (5)
  -- =========================================================================
  INSERT INTO invoices (id, invoice_number, client_id, project_id, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, currency, notes, line_items, payment_method, paid_at, stripe_payment_intent_id, created_at, updated_at) VALUES
  (inv1, 'INV-2026-001', c1, p1, 'sent', '2026-02-01', '2026-02-15', 10080.65, 24.00, 2419.35, 12500.00, 'EUR', 'Όροι πληρωμής: 15 ημέρες. Τραπεζικό έμβασμα ή κάρτα.',
    '[{"description":"Pre-production & planning","quantity":1,"unit":"package","rate":1500,"amount":1500},{"description":"Filming days (2 days)","quantity":2,"unit":"day","rate":2500,"amount":5000},{"description":"Video editing & post-production","quantity":1,"unit":"package","rate":3000,"amount":3000},{"description":"Color grading","quantity":1,"unit":"package","rate":580.65,"amount":580.65}]'::jsonb,
    NULL, NULL, NULL, '2026-02-01T09:00:00Z', '2026-02-01T09:00:00Z'),
  (inv2, 'INV-2026-002', c2, p5, 'paid', '2026-01-05', '2026-01-20', 7661.29, 24.00, 1838.71, 9500.00, 'EUR', 'Ευχαριστούμε!',
    '[{"description":"Ski resort filming package","quantity":1,"unit":"package","rate":5500,"amount":5500},{"description":"Drone aerial footage","quantity":1,"unit":"package","rate":1800,"amount":1800},{"description":"Editing & color grading","quantity":1,"unit":"package","rate":361.29,"amount":361.29}]'::jsonb,
    'stripe', '2026-01-18T14:32:00Z', 'pi_mock_payment_001', '2026-01-05T10:00:00Z', '2026-01-18T14:32:00Z'),
  (inv3, 'INV-2025-089', c1, p4, 'overdue', '2025-12-20', '2026-01-05', 14516.13, 24.00, 3483.87, 18000.00, 'EUR', 'ΛΗΞΙΠΡΟΘΕΣΜΟ - Παρακαλώ εξοφλήστε άμεσα.',
    '[{"description":"Documentary production","quantity":1,"unit":"package","rate":12000,"amount":12000},{"description":"Archive footage restoration","quantity":8,"unit":"hours","rate":150,"amount":1200},{"description":"Additional interviews","quantity":1,"unit":"package","rate":1316.13,"amount":1316.13}]'::jsonb,
    NULL, NULL, NULL, '2025-12-20T10:00:00Z', '2026-01-06T08:00:00Z'),
  (inv4, 'INV-2026-003', c3, p6, 'viewed', '2026-02-08', '2026-02-22', 2580.65, 24.00, 619.35, 3200.00, 'EUR', 'Monthly tech talk recording and streaming.',
    '[{"description":"Multi-camera recording","quantity":1,"unit":"event","rate":1500,"amount":1500},{"description":"Live streaming setup","quantity":1,"unit":"event","rate":800,"amount":800},{"description":"Video editing & upload","quantity":1,"unit":"package","rate":280.65,"amount":280.65}]'::jsonb,
    NULL, NULL, NULL, '2026-02-08T17:00:00Z', '2026-02-10T11:00:00Z'),
  (inv5, 'DRAFT-2026-004', c2, p2, 'draft', '2026-02-11', '2026-02-25', 6854.84, 24.00, 1645.16, 8500.00, 'EUR', 'Draft - εκκρεμεί επιβεβαίωση scope.',
    '[{"description":"Social media video series (6 videos)","quantity":6,"unit":"video","rate":900,"amount":5400},{"description":"Travel & accommodation expenses","quantity":1,"unit":"package","rate":1454.84,"amount":1454.84}]'::jsonb,
    NULL, NULL, NULL, '2026-02-11T09:00:00Z', '2026-02-11T09:00:00Z');

  -- =========================================================================
  -- EXPENSES (3)
  -- =========================================================================
  INSERT INTO expenses (id, project_id, category, description, amount, date, receipt_path, created_at) VALUES
  (gen_random_uuid(), p5, 'Travel', 'Καύσιμα και διόδια για Ski Resort shoot', 185.50, '2025-12-15', 'receipts/fuel-dec-15.pdf', '2025-12-16T09:00:00Z'),
  (gen_random_uuid(), p2, 'Equipment Rental', 'Ενοικίαση drone (3 ημέρες) - DJI Mavic 3 Pro', 450.00, '2026-02-10', 'receipts/drone-rental-feb.pdf', '2026-02-10T09:00:00Z'),
  (gen_random_uuid(), p1, 'Catering', 'Catering συνεργείου 2ήμερο γύρισμα (6 άτομα)', 280.00, '2026-01-22', 'receipts/catering-jan-22.jpg', '2026-01-23T09:00:00Z');

  -- =========================================================================
  -- MESSAGES (5)
  -- =========================================================================
  INSERT INTO messages (id, project_id, sender_id, content, attachments, read_by, created_at) VALUES
  (gen_random_uuid(), p1, client_id, 'Γεια! Είδα το rough cut. Γενικά πολύ καλό! Άφησα annotations σε συγκεκριμένα σημεία. Κυρίως: μπορούμε να επεκτείνουμε το product closeup στο 1:18;', '[]'::jsonb, to_jsonb(ARRAY[admin_id]), '2026-02-09T16:30:00Z'),
  (gen_random_uuid(), p1, admin_id, 'Ευχαριστώ για το feedback! Ναι, μπορούμε σίγουρα να επεκτείνουμε εκείνο το shot. Θα φτιάξω και τα υπόλοιπα annotations. Νέα version μέχρι Πέμπτη.', '[]'::jsonb, to_jsonb(ARRAY[client_id]), '2026-02-10T09:15:00Z'),
  (gen_random_uuid(), p4, admin_id, 'Το review cut του ντοκιμαντέρ ανέβηκε! Δες στα deliverables. Περιμένω τα σχόλιά σου.', '[{"name":"Anniversary_Doc_Notes.pdf","url":"attachments/anniversary-notes.pdf","size":245760}]'::jsonb, '[]'::jsonb, '2026-02-09T17:45:00Z'),
  (gen_random_uuid(), p2, admin_id, 'Heads up - θα είμαι Σαντορίνη 13-15 Φεβ για location scouting. Θα σου στείλω φωτό από τα σημεία που εξετάζουμε!', '[]'::jsonb, '[]'::jsonb, '2026-02-11T11:20:00Z'),
  (gen_random_uuid(), p8, client_id, 'Module 1 εγκρίθηκε! Για το Module 2, ο safety manager μας σημείωσε κάποιους τεχνικούς όρους που χρειάζονται καθαρότερη προφορά. Άφησα annotations.', '[]'::jsonb, to_jsonb(ARRAY[admin_id]), '2026-02-11T10:00:00Z');

  -- =========================================================================
  -- CONTRACT TEMPLATES (2)
  -- =========================================================================
  INSERT INTO contract_templates (id, title, content, placeholders, created_at) VALUES
  (tmpl1, 'Standard Production Agreement',
    E'<h1>ΣΥΜΦΩΝΙΑ ΠΑΡΑΓΩΓΗΣ ΒΙΝΤΕΟ</h1>\n<p>Η παρούσα συμφωνία (\"Σύμβαση\") συνάπτεται στις {{contract_date}} μεταξύ:</p>\n<p><strong>ΠΑΡΑΓΩΓΟΣ:</strong> Devre Media<br/>Διεύθυνση: Λεωφ. Συγγρού 234, Αθήνα 17672<br/>ΑΦΜ: EL999888777</p>\n<p><strong>ΠΕΛΑΤΗΣ:</strong> {{client_name}}<br/>Διεύθυνση: {{client_address}}<br/>ΑΦΜ: {{client_vat}}</p>\n<h2>1. ΕΡΓΟ</h2>\n<p>Τίτλος: <strong>{{project_title}}</strong></p>\n<p>{{project_description}}</p>\n<h2>2. ΧΡΟΝΟΔΙΑΓΡΑΜΜΑ</h2>\n<p>Έναρξη: {{start_date}}<br/>Παράδοση: {{deadline}}</p>\n<h2>3. ΑΜΟΙΒΗ</h2>\n<p>Συνολικό κόστος: €{{project_budget}}<br/>50% προκαταβολή, 50% στην παράδοση.</p>\n<h2>4. ΑΝΑΘΕΩΡΗΣΕΙΣ</h2>\n<p>Έως 2 κύκλοι αναθεωρήσεων. Επιπλέον: €150/ώρα.</p>\n<h2>5. ΠΝΕΥΜΑΤΙΚΑ ΔΙΚΑΙΩΜΑΤΑ</h2>\n<p>Μετά την πλήρη εξόφληση, τα δικαιώματα μεταβιβάζονται στον Πελάτη.</p>\n<p><strong>Υπογραφή Πελάτη:</strong> ___________________ Ημερομηνία: ___________</p>',
    '[{"key":"contract_date","label":"Ημερομηνία"},{"key":"client_name","label":"Όνομα Πελάτη"},{"key":"client_address","label":"Διεύθυνση"},{"key":"client_vat","label":"ΑΦΜ"},{"key":"project_title","label":"Τίτλος Έργου"},{"key":"project_description","label":"Περιγραφή"},{"key":"start_date","label":"Έναρξη"},{"key":"deadline","label":"Παράδοση"},{"key":"project_budget","label":"Προϋπολογισμός"}]'::jsonb,
    '2024-05-10T10:00:00Z'),
  (tmpl2, 'Event Coverage Agreement',
    E'<h1>ΣΥΜΦΩΝΙΑ ΚΑΛΥΨΗΣ ΕΚΔΗΛΩΣΗΣ</h1>\n<p>Σύμβαση ημερομηνίας {{contract_date}} μεταξύ:</p>\n<p><strong>ΒΙΝΤΕΟΓΡΑΦΟΣ:</strong> Devre Media</p>\n<p><strong>ΠΕΛΑΤΗΣ:</strong> {{client_name}}<br/>Email: {{client_email}}<br/>Τηλ: {{client_phone}}</p>\n<h2>ΕΚΔΗΛΩΣΗ</h2>\n<p>Τίτλος: {{event_name}}<br/>Ημερομηνία: {{event_date}}<br/>Τοποθεσία: {{event_location}}</p>\n<h2>ΥΠΗΡΕΣΙΕΣ</h2>\n<ul><li>{{coverage_hours}} ώρες κάλυψης</li><li>Multi-camera setup</li><li>Highlights reel</li></ul>\n<h2>ΚΟΣΤΟΣ</h2>\n<p>Σύνολο: €{{total_fee}}<br/>Προκαταβολή 50%: €{{deposit}}</p>\n<p><strong>Υπογραφή:</strong> ___________________ Ημερομηνία: ___________</p>',
    '[{"key":"contract_date","label":"Ημερομηνία"},{"key":"client_name","label":"Πελάτης"},{"key":"client_email","label":"Email"},{"key":"client_phone","label":"Τηλέφωνο"},{"key":"event_name","label":"Εκδήλωση"},{"key":"event_date","label":"Ημ/νία Εκδήλωσης"},{"key":"event_location","label":"Τοποθεσία"},{"key":"coverage_hours","label":"Ώρες Κάλυψης"},{"key":"total_fee","label":"Σύνολο"},{"key":"deposit","label":"Προκαταβολή"}]'::jsonb,
    '2024-07-18T10:00:00Z');

  -- =========================================================================
  -- CONTRACTS (3)
  -- =========================================================================
  INSERT INTO contracts (id, project_id, client_id, title, content, template_id, status, sent_at, viewed_at, signed_at, signature_data, pdf_path, expires_at, created_at) VALUES
  (con1, p1, c1, 'Spring Product Launch - Production Agreement',
    E'<h1>ΣΥΜΦΩΝΙΑ ΠΑΡΑΓΩΓΗΣ ΒΙΝΤΕΟ</h1>\n<p>Ημερομηνία: 8 Ιανουαρίου 2026</p>\n<p><strong>ΠΑΡΑΓΩΓΟΣ:</strong> Devre Media</p>\n<p><strong>ΠΕΛΑΤΗΣ:</strong> Hellas Foods SA<br/>ΑΦΜ: EL123456789</p>\n<h2>ΕΡΓΟ</h2>\n<p>Spring Product Launch 2026 - €12,500</p>\n<p>Υπεγράφη: 10/01/2026</p>',
    tmpl1, 'signed', '2026-01-08T10:00:00Z', '2026-01-08T14:30:00Z', '2026-01-10T09:15:00Z',
    '{"signature_svg":"data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=","ip":"94.68.xxx.xxx"}'::jsonb,
    'contracts/spring-launch-signed.pdf', NULL, '2026-01-08T10:00:00Z'),
  (con2, p3, c3, 'Startup Pitch Day 2026 - Event Coverage',
    E'<h1>ΣΥΜΦΩΝΙΑ ΚΑΛΥΨΗΣ ΕΚΔΗΛΩΣΗΣ</h1>\n<p>Ημερομηνία: 5 Φεβρουαρίου 2026</p>\n<p><strong>ΠΕΛΑΤΗΣ:</strong> TechStart Athens</p>\n<h2>ΕΚΔΗΛΩΣΗ</h2>\n<p>Startup Pitch Day 2026, 20 Μαρτίου 2026, Technopolis Γκάζι</p>\n<p>8 ώρες κάλυψης, 3 κάμερες, €6,000</p>',
    tmpl2, 'sent', '2026-02-05T15:20:00Z', NULL, NULL, NULL, NULL, '2026-03-05T23:59:59Z', '2026-02-05T15:00:00Z'),
  (con3, p2, c2, 'Summer Islands Campaign - Production Agreement',
    E'<h1>ΣΥΜΦΩΝΙΑ ΠΑΡΑΓΩΓΗΣ ΒΙΝΤΕΟ</h1>\n<p>Ημερομηνία: 1 Φεβρουαρίου 2026</p>\n<p><strong>ΠΕΛΑΤΗΣ:</strong> Aegean Travel Group</p>\n<h2>ΕΡΓΟ</h2>\n<p>Summer Islands Campaign - €8,500</p>\n<p>Υπεγράφη: 03/02/2026</p>',
    tmpl1, 'signed', '2026-02-01T11:00:00Z', '2026-02-02T09:45:00Z', '2026-02-03T13:20:00Z',
    '{"signature_svg":"data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=","ip":"95.78.xxx.xxx"}'::jsonb,
    'contracts/summer-islands-signed.pdf', NULL, '2026-02-01T11:00:00Z');

  -- =========================================================================
  -- FILMING REQUESTS (2)
  -- =========================================================================
  INSERT INTO filming_requests (id, client_id, title, description, preferred_dates, location, project_type, budget_range, reference_links, status, admin_notes, converted_project_id, created_at) VALUES
  (fr1, c5, 'Hotel Tour & Amenities Video',
    'Χρειαζόμαστε professional promotional video για το ανακαινισμένο ξενοδοχείο μας. Εστίαση σε δωμάτια, εστιατόριο, spa και θέα ηλιοβασιλέματος. Target: high-end ταξιδιώτες.',
    '["2026-02-15","2026-02-16","2026-02-22"]'::jsonb,
    'Marina Bay Hotel, Ακτή Ποσειδώνος 12, Πειραιάς',
    'commercial', '€7,000 - €8,000',
    '["https://vimeo.com/example-hotel","https://youtube.com/example-resort"]'::jsonb,
    'converted', 'Εξαιρετική ευκαιρία. Σοβαρός πελάτης, καλό budget. Converted σε project.',
    p7, '2026-02-06T16:45:00Z'),
  (fr2, NULL, 'Wedding Videography - June 2026',
    'Ψάχνουμε βιντεογράφο για τον γάμο μας στις 14 Ιουνίου 2026 στη Μύκονο. Θέλουμε cinematic coverage τελετής και δεξίωσης, plus same-day edit. Περίπου 150 καλεσμένοι.',
    '["2026-06-14"]'::jsonb,
    'Μύκονος, Κυκλάδες',
    'event_coverage', '€4,000 - €5,500',
    '["https://instagram.com/weddingvideo_inspiration"]'::jsonb,
    'pending', NULL, NULL, '2026-02-09T19:30:00Z');

  -- =========================================================================
  -- EQUIPMENT LISTS (2)
  -- =========================================================================
  INSERT INTO equipment_lists (id, project_id, items, created_at, updated_at) VALUES
  (gen_random_uuid(), p2,
    '[{"id":"eq1","category":"Cameras","name":"Sony A7S III","quantity":2,"notes":"Primary cameras","checked":true},{"id":"eq2","category":"Cameras","name":"DJI Mavic 3 Pro","quantity":1,"notes":"Drone - rented","checked":false},{"id":"eq3","category":"Lenses","name":"Sony 24-70mm f/2.8 GM","quantity":2,"notes":"","checked":true},{"id":"eq4","category":"Lenses","name":"Sony 70-200mm f/2.8 GM","quantity":1,"notes":"","checked":true},{"id":"eq5","category":"Support","name":"DJI Ronin RS3 Pro","quantity":1,"notes":"Gimbal","checked":true},{"id":"eq6","category":"Support","name":"Manfrotto Tripod","quantity":2,"notes":"","checked":true},{"id":"eq7","category":"Audio","name":"Rode Wireless GO II","quantity":2,"notes":"Wireless lav mics","checked":false},{"id":"eq8","category":"Accessories","name":"ND Filters Set","quantity":1,"notes":"Variable ND","checked":true},{"id":"eq9","category":"Storage","name":"CFexpress 256GB","quantity":6,"notes":"","checked":true}]'::jsonb,
    '2026-02-10T09:00:00Z', '2026-02-11T09:00:00Z'),
  (gen_random_uuid(), p6,
    '[{"id":"eq1","category":"Cameras","name":"Canon C70","quantity":3,"notes":"Multi-camera setup","checked":true},{"id":"eq2","category":"Lenses","name":"Canon RF 24-105mm f/4","quantity":3,"notes":"","checked":true},{"id":"eq3","category":"Audio","name":"Shure SM58","quantity":2,"notes":"For Q&A","checked":true},{"id":"eq4","category":"Audio","name":"XLR Cables 20ft","quantity":5,"notes":"","checked":true},{"id":"eq5","category":"Streaming","name":"Blackmagic ATEM Mini Pro","quantity":1,"notes":"Live switcher","checked":true},{"id":"eq6","category":"Streaming","name":"HDMI Cables 25ft","quantity":4,"notes":"","checked":true},{"id":"eq7","category":"Support","name":"Tripods","quantity":3,"notes":"Heavy duty","checked":true}]'::jsonb,
    '2026-02-09T09:00:00Z', '2026-02-11T09:00:00Z');

  -- =========================================================================
  -- SHOT LISTS (2)
  -- =========================================================================
  INSERT INTO shot_lists (id, project_id, shots, created_at, updated_at) VALUES
  (gen_random_uuid(), p1,
    '[{"id":"s1","scene":"Opening","shot_number":1,"description":"Aerial drone shot εξωτερικού εργοστασίου στην ανατολή","shot_type":"Wide","camera_movement":"Slow reveal","duration_seconds":8,"notes":"Golden hour essential","status":"completed","priority":"high"},{"id":"s2","scene":"Production Line","shot_number":2,"description":"Εργαζόμενοι στη γραμμή οργανικών προϊόντων","shot_type":"Medium","camera_movement":"Gimbal tracking","duration_seconds":12,"notes":"Δείξε καθαριότητα και προσοχή","status":"completed","priority":"high"},{"id":"s3","scene":"Product Showcase","shot_number":3,"description":"Νέα οργανική σειρά σε τραπέζι","shot_type":"Close-up","camera_movement":"Slow dolly","duration_seconds":10,"notes":"Studio lighting","status":"in_progress","priority":"high"},{"id":"s4","scene":"Testimonials","shot_number":4,"description":"Συνέντευξη πελάτη - οικογένεια μαγειρεύει","shot_type":"Medium Close-up","camera_movement":"Static","duration_seconds":20,"notes":"Κουζίνα, φυσικό φως","status":"pending","priority":"medium"}]'::jsonb,
    '2026-01-12T09:00:00Z', '2026-02-08T09:00:00Z'),
  (gen_random_uuid(), p7,
    '[{"id":"s1","scene":"Exterior","shot_number":1,"description":"Ξενοδοχείο από τη μαρίνα στο golden hour","shot_type":"Wide","camera_movement":"Drone orbit","duration_seconds":12,"notes":"Γιοτ στο foreground","status":"pending","priority":"high"},{"id":"s2","scene":"Lobby","shot_number":2,"description":"Grand lobby entrance και reception","shot_type":"Wide","camera_movement":"Gimbal push-in","duration_seconds":8,"notes":"Πολυέλαιος και μάρμαρα","status":"pending","priority":"high"},{"id":"s3","scene":"Rooms","shot_number":3,"description":"Suite overview - σαλόνι","shot_type":"Wide","camera_movement":"Slow pan","duration_seconds":10,"notes":"","status":"pending","priority":"high"},{"id":"s4","scene":"Amenities","shot_number":4,"description":"Rooftop infinity pool στο ηλιοβασίλεμα","shot_type":"Wide","camera_movement":"Static then drone pull-back","duration_seconds":15,"notes":"KEY SHOT","status":"pending","priority":"urgent"},{"id":"s5","scene":"Restaurant","shot_number":5,"description":"Chef ετοιμάζει signature πιάτο","shot_type":"Close-up","camera_movement":"Gimbal follow","duration_seconds":12,"notes":"Συντονισμός με executive chef","status":"pending","priority":"medium"}]'::jsonb,
    '2026-02-10T09:00:00Z', '2026-02-10T09:00:00Z');

  -- =========================================================================
  -- CONCEPT NOTES (3)
  -- =========================================================================
  INSERT INTO concept_notes (id, project_id, title, content, attachments, created_at, updated_at) VALUES
  (gen_random_uuid(), p2, 'Creative Vision - Island Series',
    E'<h2>Γενικό Concept</h2><p>Δημιουργία dreamy, aspirational visual journey μέσα από τα ομορφότερα ελληνικά νησιά.</p><h3>Visual Style</h3><ul><li><strong>Χρώματα:</strong> Πλούσια μπλε, ζεστά χρυσά, λευκό</li><li><strong>Mood:</strong> Ρομαντικό, γαλήνιο, περιπετειώδες</li><li><strong>Pacing:</strong> Αργό, στοχαστικό</li></ul><h3>Ιδέες Shot</h3><ul><li>Golden hour blue domes</li><li>Υποβρύχια πλάνα σε κρυστάλλινα νερά</li><li>Τοπικοί τεχνίτες</li><li>Δείπνο με θέα Αιγαίο</li></ul>',
    '[{"name":"Islands_Mood_Board.pdf","url":"attachments/islands-moodboard.pdf","size":3145728}]'::jsonb,
    '2026-02-03T09:00:00Z', '2026-02-10T09:00:00Z'),
  (gen_random_uuid(), p1, 'Brand Guidelines & Messaging',
    E'<h2>Hellas Foods Brand Identity</h2><h3>Key Messages</h3><ul><li>50 χρόνια ποιότητας και παράδοσης</li><li>Νέα organic σειρά = καινοτομία με σεβασμό στην κληρονομιά</li><li>"Από ελληνικό χώμα σε ελληνικά τραπέζια"</li></ul><h3>Brand Colors</h3><ul><li>Green #2D5016, Gold #DAA520, White</li></ul><h3>Tone</h3><p>Professional αλλά ζεστό. Ανθρώπινη πλευρά παραγωγής + quality control.</p>',
    '[{"name":"Brand_Guidelines.pdf","url":"attachments/hellas-brand-guide.pdf","size":2097152}]'::jsonb,
    '2026-01-10T09:00:00Z', '2026-01-12T09:00:00Z'),
  (gen_random_uuid(), p4, 'Documentary Structure',
    E'<h2>50η Επέτειος - Δομή Ντοκιμαντέρ</h2><h3>Πράξη 1: Η Αρχή (1976-1990)</h3><ul><li>Συνεντεύξεις ιδρυτή</li><li>Restored 8mm footage</li></ul><h3>Πράξη 2: Ανάπτυξη (1990-2010)</h3><ul><li>Επέκταση σε νέες αγορές</li><li>Κρίση 2008 - πώς προσαρμόστηκαν</li></ul><h3>Πράξη 3: Σήμερα</h3><ul><li>Βιωσιμότητα και organic μετάβαση</li><li>Σύγχρονες εγκαταστάσεις</li><li>Όραμα για τα επόμενα 50 χρόνια</li></ul>',
    '[]'::jsonb,
    '2025-11-05T09:00:00Z', '2025-11-20T09:00:00Z');

  -- =========================================================================
  -- ACTIVITY LOG (7)
  -- =========================================================================
  INSERT INTO activity_log (id, user_id, action, entity_type, entity_id, metadata, created_at) VALUES
  (gen_random_uuid(), admin_id, 'uploaded_deliverable', 'deliverable', d2, '{"project":"Anniversary Documentary","title":"Review Cut"}'::jsonb, '2026-02-09T17:45:00Z'),
  (gen_random_uuid(), client_id, 'viewed_invoice', 'invoice', inv4, '{"invoice_number":"INV-2026-003","amount":"€3,200"}'::jsonb, '2026-02-10T11:22:00Z'),
  (gen_random_uuid(), admin_id, 'created_project', 'project', p7, '{"title":"Hotel Tour","client":"Marina Bay Hotel"}'::jsonb, '2026-02-10T14:00:00Z'),
  (gen_random_uuid(), client_id, 'signed_contract', 'contract', con1, '{"title":"Spring Product Launch Agreement"}'::jsonb, '2026-01-10T09:15:00Z'),
  (gen_random_uuid(), admin_id, 'sent_invoice', 'invoice', inv1, '{"invoice_number":"INV-2026-001","amount":"€12,500"}'::jsonb, '2026-02-01T10:30:00Z'),
  (gen_random_uuid(), admin_id, 'converted_request', 'filming_request', fr1, '{"title":"Hotel Tour","converted":"project"}'::jsonb, '2026-02-10T13:55:00Z'),
  (gen_random_uuid(), admin_id, 'payment_received', 'invoice', inv2, '{"invoice_number":"INV-2026-002","amount":"€9,500"}'::jsonb, '2026-01-18T14:32:00Z');

  -- =========================================================================
  -- NOTIFICATIONS (6)
  -- =========================================================================
  INSERT INTO notifications (id, user_id, type, title, body, read, action_url, created_at) VALUES
  (gen_random_uuid(), admin_id, 'invoice_overdue', 'Ληξιπρόθεσμο Τιμολόγιο', 'Τιμολόγιο INV-2025-089 Hellas Foods SA ληξιπρόθεσμο (€18,000)', false, '/admin/invoices/' || inv3::text, '2026-01-06T08:00:00Z'),
  (gen_random_uuid(), admin_id, 'new_message', 'Νέο Μήνυμα', 'Ο Dimitris Papadopoulos έστειλε μήνυμα στο "Spring Product Launch 2026"', true, '/admin/projects/' || p1::text || '/messages', '2026-02-09T16:30:00Z'),
  (gen_random_uuid(), client_id, 'deliverable_uploaded', 'Νέο Deliverable', 'Anniversary Documentary - Review Cut είναι έτοιμο για review', false, '/client/projects/' || p4::text || '/deliverables', '2026-02-09T17:45:00Z'),
  (gen_random_uuid(), admin_id, 'contract_signed', 'Σύμβαση Υπεγράφη', 'Η Aegean Travel Group υπέγραψε τη σύμβαση "Summer Islands Campaign"', true, '/admin/contracts/' || con3::text, '2026-02-03T13:20:00Z'),
  (gen_random_uuid(), admin_id, 'new_filming_request', 'Νέο Αίτημα Γυρίσματος', 'Wedding Videography αίτημα για 14 Ιουνίου 2026 στη Μύκονο', false, '/admin/filming-requests/' || fr2::text, '2026-02-09T19:30:00Z'),
  (gen_random_uuid(), client_id, 'invoice_sent', 'Νέο Τιμολόγιο', 'Τιμολόγιο INV-2026-001 έτοιμο για πληρωμή (€12,500)', true, '/client/invoices/' || inv1::text, '2026-02-01T10:30:00Z');

END $$;

-- Επαναφορά RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE filming_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shot_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ΤΕΛΟΣ SEED DATA
-- =============================================================================
-- Σύνοψη:
-- 5 clients | 8 projects | 20 tasks | 5 deliverables | 5 annotations
-- 5 invoices | 3 expenses | 5 messages | 2 templates | 3 contracts
-- 2 filming requests | 2 equipment lists | 2 shot lists | 3 concept notes
-- 7 activity log | 6 notifications
--
-- Login:
-- Admin: admin@devremedia.gr / Admin123!
-- Client: client@demo.gr / Client123!
-- =============================================================================
