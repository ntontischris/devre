-- =============================================================================
-- Devre Media System - Seed Data
-- =============================================================================
-- This file contains comprehensive seed data for development and testing
-- PostgreSQL dialect for Supabase
--
-- Notes:
-- - All auth.users FK references are set to NULL (no auth users seeded)
-- - Clients have user_id=NULL (portal access not linked)
-- - Uses realistic Greek videography business data
-- - Dates are set around early 2026 (Q1-Q2)
-- =============================================================================

-- Clear existing data (in reverse order of dependencies)
TRUNCATE TABLE video_annotations CASCADE;
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE concept_notes CASCADE;
TRUNCATE TABLE shot_lists CASCADE;
TRUNCATE TABLE equipment_lists CASCADE;
TRUNCATE TABLE filming_requests CASCADE;
TRUNCATE TABLE contracts CASCADE;
TRUNCATE TABLE contract_templates CASCADE;
TRUNCATE TABLE deliverables CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE clients CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE activity_log CASCADE;

-- =============================================================================
-- SEED DATA INSERTION
-- =============================================================================

DO $$
DECLARE
  -- Client IDs
  client1_id uuid := gen_random_uuid(); -- Hellas Foods SA
  client2_id uuid := gen_random_uuid(); -- Aegean Travel Group
  client3_id uuid := gen_random_uuid(); -- TechStart Athens
  client4_id uuid := gen_random_uuid(); -- Olympic Events & Catering
  client5_id uuid := gen_random_uuid(); -- Marina Bay Hotel

  -- Project IDs
  project1_id uuid := gen_random_uuid(); -- Hellas Foods - Corporate Video
  project2_id uuid := gen_random_uuid(); -- Aegean Travel - Summer Campaign
  project3_id uuid := gen_random_uuid(); -- TechStart - Event Coverage
  project4_id uuid := gen_random_uuid(); -- Olympic Events - Wedding Showreel
  project5_id uuid := gen_random_uuid(); -- Marina Bay - Promotional Video
  project6_id uuid := gen_random_uuid(); -- Hellas Foods - Product Launch
  project7_id uuid := gen_random_uuid(); -- Aegean Travel - Documentary
  project8_id uuid := gen_random_uuid(); -- TechStart - Social Media Content

  -- Task IDs
  task1_id uuid := gen_random_uuid();
  task2_id uuid := gen_random_uuid();
  task3_id uuid := gen_random_uuid();
  task4_id uuid := gen_random_uuid();
  task5_id uuid := gen_random_uuid();
  task6_id uuid := gen_random_uuid();
  task7_id uuid := gen_random_uuid();
  task8_id uuid := gen_random_uuid();
  task9_id uuid := gen_random_uuid();
  task10_id uuid := gen_random_uuid();
  task11_id uuid := gen_random_uuid();
  task12_id uuid := gen_random_uuid();
  task13_id uuid := gen_random_uuid();
  task14_id uuid := gen_random_uuid();
  task15_id uuid := gen_random_uuid();
  task16_id uuid := gen_random_uuid();
  task17_id uuid := gen_random_uuid();
  task18_id uuid := gen_random_uuid();
  task19_id uuid := gen_random_uuid();
  task20_id uuid := gen_random_uuid();

  -- Deliverable IDs
  deliverable1_id uuid := gen_random_uuid();
  deliverable2_id uuid := gen_random_uuid();
  deliverable3_id uuid := gen_random_uuid();
  deliverable4_id uuid := gen_random_uuid();
  deliverable5_id uuid := gen_random_uuid();

  -- Invoice IDs
  invoice1_id uuid := gen_random_uuid();
  invoice2_id uuid := gen_random_uuid();
  invoice3_id uuid := gen_random_uuid();
  invoice4_id uuid := gen_random_uuid();
  invoice5_id uuid := gen_random_uuid();

  -- Contract Template IDs
  template1_id uuid := gen_random_uuid();
  template2_id uuid := gen_random_uuid();

  -- Contract IDs
  contract1_id uuid := gen_random_uuid();
  contract2_id uuid := gen_random_uuid();
  contract3_id uuid := gen_random_uuid();

  -- Filming Request IDs
  filming_req1_id uuid := gen_random_uuid();
  filming_req2_id uuid := gen_random_uuid();

  -- Equipment List IDs
  equipment1_id uuid := gen_random_uuid();
  equipment2_id uuid := gen_random_uuid();

  -- Shot List IDs
  shot_list1_id uuid := gen_random_uuid();
  shot_list2_id uuid := gen_random_uuid();

  -- Concept Note IDs
  concept1_id uuid := gen_random_uuid();
  concept2_id uuid := gen_random_uuid();
  concept3_id uuid := gen_random_uuid();

BEGIN

  -- ===========================================================================
  -- CLIENTS
  -- ===========================================================================
  INSERT INTO clients (
    id, user_id, company_name, contact_name, email, phone,
    address, vat_number, avatar_url, notes, status,
    created_at, updated_at
  ) VALUES
  (
    client1_id,
    NULL, -- Portal access not linked
    'Hellas Foods SA',
    'Dimitris Papadopoulos',
    'dimitris.p@hellasfoods.gr',
    '+30 210 5551234',
    'Leoforos Kifisias 123, 15125 Marousi, Athens',
    'EL123456789',
    NULL,
    'Major food manufacturer. Long-term client. Produces olive oil, dairy products, and packaged foods. Very professional, pays on time.',
    'active',
    '2025-08-15 10:30:00+00',
    '2026-01-20 14:15:00+00'
  ),
  (
    client2_id,
    NULL,
    'Aegean Travel Group',
    'Sofia Konstantinou',
    'sofia@aegeantravel.gr',
    '+30 210 7778888',
    'Akti Miaouli 47, 18538 Piraeus',
    'EL987654321',
    NULL,
    'Travel agency specializing in Greek island tours. Needs seasonal content. Summer campaign is their priority.',
    'active',
    '2025-09-20 09:00:00+00',
    '2026-02-05 11:30:00+00'
  ),
  (
    client3_id,
    NULL,
    'TechStart Athens',
    'Alexandros Georgiou',
    'alex@techstart.io',
    '+30 211 4002000',
    'Pireos 100, 11854 Gazi, Athens',
    'EL555444333',
    NULL,
    'Tech startup accelerator. Hosts quarterly demo days. Modern, fast-paced, prefers quick turnarounds.',
    'active',
    '2025-11-10 16:45:00+00',
    '2026-01-28 09:20:00+00'
  ),
  (
    client4_id,
    NULL,
    'Olympic Events & Catering',
    'Maria Nikolaou',
    'maria@olympicevents.gr',
    '+30 210 3334455',
    'Vas. Sofias 89, 11521 Athens',
    'EL222333444',
    NULL,
    'High-end event planning and catering. Weddings, corporate events. Last invoice overdue - follow up needed.',
    'inactive',
    '2025-07-05 13:20:00+00',
    '2025-12-10 10:00:00+00'
  ),
  (
    client5_id,
    NULL,
    'Marina Bay Hotel',
    'Yiannis Stavrou',
    'y.stavrou@marinabay.gr',
    '+30 2310 888999',
    'Megalou Alexandrou 3, 54640 Thessaloniki',
    'EL777888999',
    NULL,
    'Boutique luxury hotel in Thessaloniki. Interested in promotional video. Budget confirmation pending.',
    'lead',
    '2026-01-25 11:15:00+00',
    '2026-02-08 15:45:00+00'
  );

  -- ===========================================================================
  -- PROJECTS
  -- ===========================================================================
  INSERT INTO projects (
    id, client_id, title, description, project_type, status, priority,
    start_date, deadline, budget, created_at, updated_at
  ) VALUES
  (
    project1_id,
    client1_id,
    'Hellas Foods Corporate Video 2026',
    'Corporate video showcasing company history, values, and manufacturing process. To be used for investor relations and trade shows. Target length: 3-4 minutes. Greek and English versions required.',
    'corporate_video',
    'editing',
    'high',
    '2026-01-10',
    '2026-03-15',
    8500.00,
    '2026-01-05 09:00:00+00',
    '2026-02-10 16:30:00+00'
  ),
  (
    project2_id,
    client2_id,
    'Summer 2026 Islands Campaign',
    'Series of 10 short videos (15-30 seconds each) showcasing different Greek islands: Santorini, Mykonos, Crete, Rhodes, Corfu. For Instagram, TikTok, and YouTube. Bright, energetic, aspirational tone.',
    'social_media_content',
    'filming',
    'urgent',
    '2026-02-01',
    '2026-04-20',
    15000.00,
    '2026-01-20 10:30:00+00',
    '2026-02-09 12:00:00+00'
  ),
  (
    project3_id,
    client3_id,
    'TechStart Demo Day Q1 2026',
    'Event coverage of startup pitch competition. 12 startups presenting. Need highlight reel (5 min) and individual startup segments. Fast turnaround required.',
    'event_coverage',
    'review',
    'high',
    '2026-01-15',
    '2026-02-20',
    4500.00,
    '2026-01-10 14:00:00+00',
    '2026-02-08 18:45:00+00'
  ),
  (
    project4_id,
    client4_id,
    'Olympic Events Wedding Showreel',
    'Compilation showreel from 8 luxury weddings filmed in 2025. Showcase venues, decor, and catering. For website and social media. Elegant, romantic style.',
    'commercial',
    'revisions',
    'medium',
    '2025-12-01',
    '2026-02-28',
    3200.00,
    '2025-11-28 11:15:00+00',
    '2026-02-07 09:30:00+00'
  ),
  (
    project5_id,
    client5_id,
    'Marina Bay Hotel Promotional Video',
    'Luxury hotel promotional video. Showcase rooms, restaurant, spa, sea views. Target audience: international tourists. 2-3 minutes. Cinematic, high-end feel.',
    'commercial',
    'briefing',
    'medium',
    '2026-02-20',
    '2026-04-30',
    6800.00,
    '2026-02-01 13:45:00+00',
    '2026-02-09 10:20:00+00'
  ),
  (
    project6_id,
    client1_id,
    'New Product Line Launch - Organic Olive Oil',
    'Product launch video for premium organic olive oil line. Visit olive groves in Kalamata, interview farmers, showcase bottling process. 2 minutes.',
    'commercial',
    'pre_production',
    'high',
    '2026-02-15',
    '2026-04-10',
    7200.00,
    '2026-02-05 08:30:00+00',
    '2026-02-10 11:00:00+00'
  ),
  (
    project7_id,
    client2_id,
    'Greek Island Heritage Documentary',
    'Mini-documentary (15 minutes) about traditional island life and crafts. Focus on Naxos and Paros. Interviews with locals, artisans, fishermen. For YouTube and tourism board.',
    'documentary',
    'delivered',
    'low',
    '2025-10-01',
    '2025-12-31',
    12000.00,
    '2025-09-25 09:00:00+00',
    '2026-01-05 15:30:00+00'
  ),
  (
    project8_id,
    client3_id,
    'TechStart Social Media - February Content',
    'Monthly social media content package: 8 short videos (30-60 seconds) interviewing founders, team culture shots, office tours. Vertical format for Instagram Stories/Reels.',
    'social_media_content',
    'in_progress',
    'medium',
    '2026-02-01',
    '2026-02-25',
    2800.00,
    '2026-01-28 12:00:00+00',
    '2026-02-10 14:15:00+00'
  );

  -- ===========================================================================
  -- TASKS
  -- ===========================================================================
  INSERT INTO tasks (
    id, project_id, assigned_to, title, description, status, priority,
    due_date, sort_order, created_at, updated_at
  ) VALUES
  -- Project 1: Hellas Foods Corporate Video (editing stage)
  (
    task1_id, project1_id, NULL,
    'Color grade all footage',
    'Apply consistent color grading across all scenes. Match company brand colors (blue and gold accents). Export LUTs for client approval.',
    'in_progress', 'high', '2026-02-14', 1,
    '2026-02-08 09:00:00+00', '2026-02-10 11:30:00+00'
  ),
  (
    task2_id, project1_id, NULL,
    'Create Greek voiceover script',
    'Translate final English script to Greek. Hire voiceover artist. Record and sync with visuals.',
    'todo', 'high', '2026-02-18', 2,
    '2026-02-08 09:15:00+00', '2026-02-08 09:15:00+00'
  ),
  (
    task3_id, project1_id, NULL,
    'Add motion graphics and lower thirds',
    'Create animated logo intro, section titles, employee name lower thirds. Use company brand guidelines.',
    'in_progress', 'medium', '2026-02-16', 3,
    '2026-02-09 10:00:00+00', '2026-02-10 15:20:00+00'
  ),
  (
    task4_id, project1_id, NULL,
    'Export English and Greek versions',
    'Export both language versions in multiple formats: 4K, 1080p, web-optimized. Deliver via Vimeo private link.',
    'todo', 'high', '2026-03-10', 4,
    '2026-02-08 09:30:00+00', '2026-02-08 09:30:00+00'
  ),

  -- Project 2: Summer Islands Campaign (filming stage)
  (
    task5_id, project2_id, NULL,
    'Book flights and accommodation - Santorini',
    'Arrange travel for 3-day shoot in Santorini (Feb 12-14). Book drone-friendly hotels.',
    'done', 'urgent', '2026-02-08', 1,
    '2026-01-25 14:00:00+00', '2026-02-07 16:45:00+00'
  ),
  (
    task6_id, project2_id, NULL,
    'Film Santorini content',
    'Capture sunrise in Oia, sunset caldera views, white architecture, beach clubs, local cuisine. 4K drone footage.',
    'done', 'urgent', '2026-02-14', 2,
    '2026-01-25 14:15:00+00', '2026-02-08 19:00:00+00'
  ),
  (
    task7_id, project2_id, NULL,
    'Book travel - Mykonos',
    'Arrange flights and accommodation for Mykonos shoot (Feb 18-20).',
    'in_progress', 'urgent', '2026-02-11', 3,
    '2026-02-05 10:00:00+00', '2026-02-10 09:30:00+00'
  ),
  (
    task8_id, project2_id, NULL,
    'Secure drone permits - Mykonos',
    'Apply for CAA drone flight permits for coastal areas and archaeological sites.',
    'in_progress', 'high', '2026-02-12', 4,
    '2026-02-05 10:30:00+00', '2026-02-10 11:00:00+00'
  ),

  -- Project 3: TechStart Demo Day (review stage)
  (
    task9_id, project3_id, NULL,
    'Client review - highlight reel',
    'Send 5-minute highlight reel to client for feedback. Awaiting response by Feb 12.',
    'review', 'high', '2026-02-12', 1,
    '2026-02-08 11:00:00+00', '2026-02-08 17:30:00+00'
  ),
  (
    task10_id, project3_id, NULL,
    'Edit individual startup segments',
    'Cut 12 separate 2-3 minute segments for each startup. Include their pitch and Q&A highlights.',
    'in_progress', 'medium', '2026-02-15', 2,
    '2026-02-06 09:00:00+00', '2026-02-09 14:00:00+00'
  ),
  (
    task11_id, project3_id, NULL,
    'Add startup logos and graphics',
    'Create animated lower thirds with startup names and founders. Include logo bumpers.',
    'todo', 'medium', '2026-02-17', 3,
    '2026-02-08 11:30:00+00', '2026-02-08 11:30:00+00'
  ),

  -- Project 4: Wedding Showreel (revisions stage)
  (
    task12_id, project4_id, NULL,
    'Implement client revision notes',
    'Client wants more venue shots, less dancing. Adjust pacing in middle section. Remove song at 2:15 mark.',
    'in_progress', 'medium', '2026-02-13', 1,
    '2026-02-07 10:00:00+00', '2026-02-10 10:30:00+00'
  ),
  (
    task13_id, project4_id, NULL,
    'Clear music licensing for new track',
    'Original track rejected by client. Source new royalty-free elegant track. Verify commercial use license.',
    'in_progress', 'high', '2026-02-14', 2,
    '2026-02-07 10:15:00+00', '2026-02-09 16:00:00+00'
  ),

  -- Project 5: Marina Bay (briefing stage)
  (
    task14_id, project5_id, NULL,
    'Schedule briefing call with client',
    'Book video call to discuss creative vision, shot list, timeline. Prepare moodboard.',
    'todo', 'high', '2026-02-13', 1,
    '2026-02-09 15:00:00+00', '2026-02-09 15:00:00+00'
  ),
  (
    task15_id, project5_id, NULL,
    'Research hotel and create moodboard',
    'Review hotel website, TripAdvisor photos. Create Pinterest moodboard with reference videos.',
    'todo', 'medium', '2026-02-14', 2,
    '2026-02-09 15:15:00+00', '2026-02-09 15:15:00+00'
  ),

  -- Project 6: Organic Olive Oil (pre-production)
  (
    task16_id, project6_id, NULL,
    'Scout olive grove locations in Kalamata',
    'Visit 3 potential olive grove locations. Check lighting, access for equipment, interview farmers.',
    'todo', 'high', '2026-02-18', 1,
    '2026-02-10 09:00:00+00', '2026-02-10 09:00:00+00'
  ),
  (
    task17_id, project6_id, NULL,
    'Finalize shooting script',
    'Work with client to finalize script. Get approval on narration text and shot sequence.',
    'todo', 'high', '2026-02-20', 2,
    '2026-02-10 09:15:00+00', '2026-02-10 09:15:00+00'
  ),

  -- Project 8: TechStart Social Media (in progress)
  (
    task18_id, project8_id, NULL,
    'Film founder interviews (batch 1)',
    'Interview 4 startup founders at TechStart office. 15 min each. Capture vertical and horizontal.',
    'done', 'medium', '2026-02-06', 1,
    '2026-02-01 10:00:00+00', '2026-02-07 18:00:00+00'
  ),
  (
    task19_id, project8_id, NULL,
    'Edit first 4 vertical videos',
    'Cut down interviews to 45-60 second clips. Add captions, TechStart branding, music.',
    'in_progress', 'medium', '2026-02-12', 2,
    '2026-02-08 09:00:00+00', '2026-02-10 14:00:00+00'
  ),
  (
    task20_id, project8_id, NULL,
    'Capture B-roll around office',
    'Get shots of workspace, team collaborating, coffee breaks, whiteboard sessions. Natural, candid style.',
    'todo', 'low', '2026-02-14', 3,
    '2026-02-08 09:30:00+00', '2026-02-08 09:30:00+00'
  );

  -- ===========================================================================
  -- DELIVERABLES
  -- ===========================================================================
  INSERT INTO deliverables (
    id, project_id, title, description, file_path, file_size, file_type,
    version, status, download_count, expires_at, uploaded_by, created_at
  ) VALUES
  (
    deliverable1_id, project1_id,
    'Hellas Foods Corporate Video - Draft v2',
    'Second draft of corporate video. Rough cut with all scenes, no color grading yet. English voiceover temp track.',
    '/deliverables/2026/02/hellas-foods-corporate-v2-draft.mp4',
    1847234560, -- ~1.72 GB
    'video/mp4',
    2,
    'approved',
    3,
    '2026-04-15 23:59:59+00',
    NULL, -- No auth user
    '2026-02-05 17:30:00+00'
  ),
  (
    deliverable2_id, project2_id,
    'Santorini Raw Footage',
    'All raw 4K footage from Santorini shoot (Feb 12-14). Includes drone, gimbal, and static shots. 87 clips total.',
    '/deliverables/2026/02/santorini-raw-footage.zip',
    52428800000, -- ~48.8 GB
    'application/zip',
    1,
    'pending_review',
    1,
    '2026-03-31 23:59:59+00',
    NULL,
    '2026-02-09 08:15:00+00'
  ),
  (
    deliverable3_id, project3_id,
    'TechStart Demo Day Highlight Reel v1',
    'First cut of 5-minute highlight reel. Includes best moments from all 12 pitches, audience reactions, and venue atmosphere.',
    '/deliverables/2026/02/techstart-demo-day-highlights-v1.mp4',
    892674048, -- ~851 MB
    'video/mp4',
    1,
    'revision_requested',
    5,
    '2026-03-20 23:59:59+00',
    NULL,
    '2026-02-08 16:45:00+00'
  ),
  (
    deliverable4_id, project7_id,
    'Greek Island Heritage Documentary - Final',
    'Final approved version of 15-minute documentary. 4K export with burned-in English subtitles. Color graded.',
    '/deliverables/2026/01/island-heritage-documentary-final.mp4',
    3221225472, -- ~3 GB
    'video/mp4',
    3,
    'final',
    12,
    NULL, -- No expiry for final deliverable
    NULL,
    '2026-01-05 14:20:00+00'
  ),
  (
    deliverable5_id, project4_id,
    'Olympic Events Wedding Showreel v3',
    'Third revision after client feedback. Adjusted pacing, more venue shots, new music track.',
    '/deliverables/2026/02/wedding-showreel-v3.mp4',
    734003200, -- ~700 MB
    'video/mp4',
    3,
    'pending_review',
    2,
    '2026-03-31 23:59:59+00',
    NULL,
    '2026-02-10 12:30:00+00'
  );

  -- ===========================================================================
  -- VIDEO ANNOTATIONS
  -- ===========================================================================
  INSERT INTO video_annotations (
    id, deliverable_id, user_id, timestamp_seconds, content, resolved, created_at
  ) VALUES
  (
    gen_random_uuid(), deliverable1_id, NULL,
    45.50,
    'Great transition here! Love the drone shot coming into the factory.',
    true,
    '2026-02-06 10:30:00+00'
  ),
  (
    gen_random_uuid(), deliverable1_id, NULL,
    128.75,
    'Can we add a lower third with the CEO''s name and title when he starts speaking?',
    false,
    '2026-02-06 10:45:00+00'
  ),
  (
    gen_random_uuid(), deliverable3_id, NULL,
    87.20,
    'This startup pitch is too long. Can we cut to just the key point about their revenue model?',
    false,
    '2026-02-09 11:15:00+00'
  ),
  (
    gen_random_uuid(), deliverable3_id, NULL,
    245.00,
    'Audio levels drop here. Needs to be normalized.',
    false,
    '2026-02-09 11:30:00+00'
  ),
  (
    gen_random_uuid(), deliverable5_id, NULL,
    62.30,
    'Perfect! This is exactly the elegant feel we were looking for.',
    true,
    '2026-02-10 15:20:00+00'
  );

  -- ===========================================================================
  -- INVOICES
  -- ===========================================================================
  INSERT INTO invoices (
    id, invoice_number, client_id, project_id, status, issue_date, due_date,
    subtotal, tax_rate, tax_amount, total, currency, notes, line_items,
    payment_method, paid_at, stripe_payment_intent_id, created_at, updated_at
  ) VALUES
  (
    invoice1_id,
    'INV-2026-001',
    client1_id, project1_id,
    'sent',
    '2026-02-01', '2026-03-03', -- 30 days payment terms
    6854.84, 24.00, 1645.16, 8500.00, 'EUR',
    'Payment terms: 30 days. Bank transfer details provided separately.',
    '[
      {"description": "Corporate video production - filming", "quantity": 2, "unit": "days", "rate": 1200.00, "amount": 2400.00},
      {"description": "Corporate video production - editing", "quantity": 5, "unit": "days", "rate": 800.00, "amount": 4000.00},
      {"description": "Voiceover recording (Greek and English)", "quantity": 1, "unit": "service", "rate": 450.00, "amount": 450.00},
      {"description": "Motion graphics and animation", "quantity": 1, "unit": "service", "rate": 650.00, "amount": 650.00}
    ]'::jsonb,
    NULL, NULL, NULL,
    '2026-02-01 09:00:00+00', '2026-02-01 09:00:00+00'
  ),
  (
    invoice2_id,
    'INV-2026-002',
    client2_id, project7_id,
    'paid',
    '2025-12-20', '2026-01-19',
    9677.42, 24.00, 2322.58, 12000.00, 'EUR',
    'Final invoice for documentary project. Includes travel expenses to islands.',
    '[
      {"description": "Documentary filming - Naxos (3 days)", "quantity": 3, "unit": "days", "rate": 1500.00, "amount": 4500.00},
      {"description": "Documentary filming - Paros (2 days)", "quantity": 2, "unit": "days", "rate": 1500.00, "amount": 3000.00},
      {"description": "Post-production and editing", "quantity": 8, "unit": "days", "rate": 800.00, "amount": 6400.00},
      {"description": "Drone footage", "quantity": 1, "unit": "service", "rate": 800.00, "amount": 800.00},
      {"description": "Travel expenses (flights, accommodation)", "quantity": 1, "unit": "reimbursement", "rate": -1700.00, "amount": -1700.00}
    ]'::jsonb,
    'bank_transfer',
    '2026-01-15 14:30:00+00',
    NULL,
    '2025-12-20 10:00:00+00', '2026-01-15 14:30:00+00'
  ),
  (
    invoice3_id,
    'INV-2026-003',
    client3_id, project3_id,
    'viewed',
    '2026-02-08', '2026-03-10',
    3629.03, 24.00, 870.97, 4500.00, 'EUR',
    'Event coverage - TechStart Demo Day Q1 2026.',
    '[
      {"description": "Event coverage filming (full day)", "quantity": 1, "unit": "day", "rate": 1800.00, "amount": 1800.00},
      {"description": "Highlight reel editing (5 minutes)", "quantity": 1, "unit": "service", "rate": 1200.00, "amount": 1200.00},
      {"description": "Individual startup segments editing", "quantity": 12, "unit": "segments", "rate": 120.00, "amount": 1440.00}
    ]'::jsonb,
    NULL, NULL, NULL,
    '2026-02-08 17:00:00+00', '2026-02-09 09:20:00+00'
  ),
  (
    invoice4_id,
    'INV-2025-087',
    client4_id, project4_id,
    'overdue',
    '2025-12-15', '2026-01-14', -- Now overdue
    2580.65, 24.00, 619.35, 3200.00, 'EUR',
    'Wedding showreel compilation. Payment is now overdue - please remit immediately.',
    '[
      {"description": "Footage review and selection", "quantity": 2, "unit": "days", "rate": 600.00, "amount": 1200.00},
      {"description": "Editing and color grading", "quantity": 4, "unit": "days", "rate": 700.00, "amount": 2800.00}
    ]'::jsonb,
    NULL, NULL, NULL,
    '2025-12-15 11:30:00+00', '2026-01-20 09:00:00+00'
  ),
  (
    invoice5_id,
    'INV-2026-004',
    client3_id, project8_id,
    'draft',
    '2026-02-10', '2026-03-12',
    2258.06, 24.00, 541.94, 2800.00, 'EUR',
    'Monthly social media content package - February 2026.',
    '[
      {"description": "Social media content - filming", "quantity": 1, "unit": "day", "rate": 900.00, "amount": 900.00},
      {"description": "Video editing - 8 short videos", "quantity": 8, "unit": "videos", "rate": 180.00, "amount": 1440.00},
      {"description": "Vertical format optimization", "quantity": 1, "unit": "service", "rate": 280.00, "amount": 280.00}
    ]'::jsonb,
    NULL, NULL, NULL,
    '2026-02-10 16:45:00+00', '2026-02-10 16:45:00+00'
  );

  -- ===========================================================================
  -- EXPENSES
  -- ===========================================================================
  INSERT INTO expenses (
    id, project_id, category, description, amount, date, receipt_path, created_at
  ) VALUES
  (
    gen_random_uuid(), project2_id,
    'Travel',
    'Flight tickets Athens-Santorini-Athens (3 crew members)',
    847.50,
    '2026-02-10',
    '/receipts/2026/02/aegean-airlines-santorini.pdf',
    '2026-02-10 18:30:00+00'
  ),
  (
    gen_random_uuid(), project2_id,
    'Accommodation',
    'Hotel in Oia, Santorini - 2 nights, 2 rooms',
    680.00,
    '2026-02-11',
    '/receipts/2026/02/hotel-santorini.pdf',
    '2026-02-11 09:15:00+00'
  ),
  (
    gen_random_uuid(), project6_id,
    'Equipment Rental',
    'DJI Ronin 4D camera system rental - 3 days',
    450.00,
    '2026-02-09',
    '/receipts/2026/02/camera-rental-kalamata.pdf',
    '2026-02-09 14:00:00+00'
  );

  -- ===========================================================================
  -- MESSAGES
  -- ===========================================================================
  INSERT INTO messages (
    id, project_id, sender_id, content, attachments, read_by, created_at
  ) VALUES
  (
    gen_random_uuid(), project1_id, NULL,
    'Hi team! Just reviewed the v2 draft. Overall looks fantastic. A few minor notes: 1) Can we add a lower third when the CEO speaks at 2:08? 2) The transition at 3:45 feels a bit abrupt. 3) Love the drone footage! When can we expect the color graded version?',
    '[]'::jsonb,
    '[]'::jsonb,
    '2026-02-06 11:30:00+00'
  ),
  (
    gen_random_uuid(), project3_id, NULL,
    'Quick update: Client loved the highlight reel! They want us to make the individual segments a bit shorter though - max 2 minutes each instead of 3. Can we trim the Q&A sections? I''ll send detailed notes by EOD.',
    '[]'::jsonb,
    '[]'::jsonb,
    '2026-02-09 14:15:00+00'
  ),
  (
    gen_random_uuid(), project2_id, NULL,
    'Santorini shoot wrapped! Got amazing sunset footage yesterday. Weather was perfect. Uploading all raw files now (might take a few hours - 50GB). Next stop: Mykonos on the 18th. I''ve attached the travel schedule and shot list.',
    '[
      {"name": "mykonos-schedule.pdf", "url": "/attachments/2026/02/mykonos-schedule.pdf", "size": 245760},
      {"name": "shot-list-mykonos.xlsx", "url": "/attachments/2026/02/shot-list-mykonos.xlsx", "size": 82944}
    ]'::jsonb,
    '[]'::jsonb,
    '2026-02-09 09:30:00+00'
  );

  -- ===========================================================================
  -- CONTRACT TEMPLATES
  -- ===========================================================================
  INSERT INTO contract_templates (
    id, title, content, placeholders, created_at
  ) VALUES
  (
    template1_id,
    'Standard Video Production Agreement',
    E'VIDEO PRODUCTION SERVICES AGREEMENT\n\nThis Agreement is entered into on {{contract_date}} between:\n\n**SERVICE PROVIDER:**\nDevre Media Production\nAddress: {{company_address}}\nVAT: {{company_vat}}\n\n**CLIENT:**\n{{client_company_name}}\nRepresented by: {{client_contact_name}}\nAddress: {{client_address}}\nVAT: {{client_vat}}\n\n**PROJECT DETAILS:**\nProject Title: {{project_title}}\nProject Type: {{project_type}}\nDelivery Date: {{project_deadline}}\nTotal Budget: {{project_budget}} EUR\n\n**SCOPE OF WORK:**\n{{scope_of_work}}\n\n**PAYMENT TERMS:**\n- 50% deposit upon contract signing: {{deposit_amount}} EUR\n- 50% upon final delivery: {{final_payment}} EUR\n- Payment terms: 30 days from invoice date\n- Late payments subject to 2% monthly interest\n\n**INTELLECTUAL PROPERTY:**\nUpon full payment, all rights to the final deliverables transfer to the Client. Raw footage and project files remain property of Devre Media unless otherwise negotiated.\n\n**REVISIONS:**\nUp to {{revision_rounds}} rounds of revisions included. Additional revisions billed at {{hourly_rate}} EUR/hour.\n\n**CANCELLATION:**\nClient may cancel with 7 days written notice. Deposit is non-refundable. Work completed to date will be billed.\n\n**SIGNATURES:**\n\nFor Devre Media Production: ___________________ Date: ___________\n\nFor Client: ___________________ Date: ___________',
    '[
      {"key": "contract_date", "label": "Contract Date", "type": "date"},
      {"key": "company_address", "label": "Company Address", "type": "text"},
      {"key": "company_vat", "label": "Company VAT", "type": "text"},
      {"key": "client_company_name", "label": "Client Company Name", "type": "text"},
      {"key": "client_contact_name", "label": "Client Contact Name", "type": "text"},
      {"key": "client_address", "label": "Client Address", "type": "text"},
      {"key": "client_vat", "label": "Client VAT", "type": "text"},
      {"key": "project_title", "label": "Project Title", "type": "text"},
      {"key": "project_type", "label": "Project Type", "type": "text"},
      {"key": "project_deadline", "label": "Project Deadline", "type": "date"},
      {"key": "project_budget", "label": "Total Budget", "type": "number"},
      {"key": "scope_of_work", "label": "Scope of Work", "type": "textarea"},
      {"key": "deposit_amount", "label": "Deposit Amount (50%)", "type": "number"},
      {"key": "final_payment", "label": "Final Payment (50%)", "type": "number"},
      {"key": "revision_rounds", "label": "Revision Rounds Included", "type": "number"},
      {"key": "hourly_rate", "label": "Hourly Rate for Extra Work", "type": "number"}
    ]'::jsonb,
    '2025-06-10 10:00:00+00'
  ),
  (
    template2_id,
    'Wedding/Event Coverage Agreement',
    E'EVENT VIDEOGRAPHY AGREEMENT\n\nThis Agreement is made on {{contract_date}} between:\n\n**VIDEOGRAPHER:**\nDevre Media Production\nVAT: {{company_vat}}\n\n**CLIENT:**\n{{client_name}}\nEmail: {{client_email}}\nPhone: {{client_phone}}\n\n**EVENT DETAILS:**\nEvent Type: {{event_type}}\nEvent Date: {{event_date}}\nEvent Time: {{event_time}}\nVenue: {{event_venue}}\nEstimated Coverage Hours: {{coverage_hours}}\n\n**DELIVERABLES:**\n{{deliverables_list}}\n\nEstimated delivery: {{delivery_timeframe}} after event date.\n\n**PACKAGE & PRICING:**\nPackage: {{package_name}}\nTotal Fee: {{total_fee}} EUR\n\n**PAYMENT SCHEDULE:**\n- Booking deposit (30%): {{deposit}} EUR - Due upon signing\n- Balance (70%): {{balance}} EUR - Due 7 days before event\n\n**IMPORTANT TERMS:**\n- Weather/Force Majeure: Outdoor portions subject to weather. No refunds for weather delays, reschedule available.\n- Timeline: Client must provide detailed event timeline 14 days before event.\n- Meal: If coverage exceeds 6 hours, vendor meal must be provided.\n- Venue Access: Client responsible for ensuring videographer access to all areas.\n- Backup: We maintain backup equipment, but technical failure may limit coverage.\n\n**CANCELLATION BY CLIENT:**\n- More than 90 days before: Full refund minus 100 EUR admin fee\n- 60-90 days: 50% refund\n- Less than 60 days: No refund\n\n**USAGE RIGHTS:**\nDevre Media may use final video for portfolio/marketing. Client may request exclusion.\n\nClient Signature: ___________________ Date: ___________\n\nVideographer Signature: ___________________ Date: ___________',
    '[
      {"key": "contract_date", "label": "Contract Date", "type": "date"},
      {"key": "company_vat", "label": "Company VAT", "type": "text"},
      {"key": "client_name", "label": "Client Name", "type": "text"},
      {"key": "client_email", "label": "Client Email", "type": "email"},
      {"key": "client_phone", "label": "Client Phone", "type": "text"},
      {"key": "event_type", "label": "Event Type", "type": "text"},
      {"key": "event_date", "label": "Event Date", "type": "date"},
      {"key": "event_time", "label": "Event Time", "type": "text"},
      {"key": "event_venue", "label": "Event Venue", "type": "text"},
      {"key": "coverage_hours", "label": "Coverage Hours", "type": "number"},
      {"key": "deliverables_list", "label": "Deliverables", "type": "textarea"},
      {"key": "delivery_timeframe", "label": "Delivery Timeframe", "type": "text"},
      {"key": "package_name", "label": "Package Name", "type": "text"},
      {"key": "total_fee", "label": "Total Fee", "type": "number"},
      {"key": "deposit", "label": "Deposit (30%)", "type": "number"},
      {"key": "balance", "label": "Balance (70%)", "type": "number"}
    ]'::jsonb,
    '2025-07-22 14:30:00+00'
  );

  -- ===========================================================================
  -- CONTRACTS
  -- ===========================================================================
  INSERT INTO contracts (
    id, project_id, client_id, title, content, template_id, status,
    sent_at, viewed_at, signed_at, signature_data, pdf_path, expires_at, created_at
  ) VALUES
  (
    contract1_id, project1_id, client1_id,
    'Hellas Foods Corporate Video - Production Agreement',
    E'VIDEO PRODUCTION SERVICES AGREEMENT\n\nThis Agreement is entered into on January 5, 2026 between:\n\n**SERVICE PROVIDER:**\nDevre Media Production\nAddress: Pireos 100, 11854 Athens, Greece\nVAT: EL999888777\n\n**CLIENT:**\nHellas Foods SA\nRepresented by: Dimitris Papadopoulos\nAddress: Leoforos Kifisias 123, 15125 Marousi, Athens\nVAT: EL123456789\n\n**PROJECT DETAILS:**\nProject Title: Hellas Foods Corporate Video 2026\nProject Type: Corporate Video\nDelivery Date: March 15, 2026\nTotal Budget: 8,500.00 EUR\n\n**SCOPE OF WORK:**\n- Pre-production planning and location scouting\n- 2 days of on-site filming at company facilities\n- Interviews with CEO and key staff members\n- B-roll of manufacturing process and facilities\n- Professional voiceover in Greek and English\n- Post-production editing, color grading, motion graphics\n- Final deliverables in 4K and 1080p formats\n- Music licensing and sound design\n\n**PAYMENT TERMS:**\n- 50% deposit upon contract signing: 4,250.00 EUR\n- 50% upon final delivery: 4,250.00 EUR\n- Payment terms: 30 days from invoice date\n- Late payments subject to 2% monthly interest\n\n**INTELLECTUAL PROPERTY:**\nUpon full payment, all rights to the final deliverables transfer to the Client. Raw footage and project files remain property of Devre Media unless otherwise negotiated.\n\n**REVISIONS:**\nUp to 2 rounds of revisions included. Additional revisions billed at 120.00 EUR/hour.\n\n**CANCELLATION:**\nClient may cancel with 7 days written notice. Deposit is non-refundable. Work completed to date will be billed.\n\n**SIGNATURES:**\n\nFor Devre Media Production: [SIGNED] Date: 05/01/2026\n\nFor Client: [SIGNED] Date: 05/01/2026',
    template1_id,
    'signed',
    '2026-01-03 09:00:00+00',
    '2026-01-03 14:30:00+00',
    '2026-01-05 11:20:00+00',
    '{
      "client_signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "client_name": "Dimitris Papadopoulos",
      "client_ip": "84.205.192.143",
      "signed_at": "2026-01-05T11:20:15.321Z"
    }'::jsonb,
    '/contracts/2026/01/hellas-foods-corporate-video-signed.pdf',
    NULL,
    '2026-01-02 16:00:00+00'
  ),
  (
    contract2_id, project2_id, client2_id,
    'Aegean Travel - Summer 2026 Islands Campaign Agreement',
    E'VIDEO PRODUCTION SERVICES AGREEMENT\n\nThis Agreement is entered into on January 20, 2026 between:\n\n**SERVICE PROVIDER:**\nDevre Media Production\nAddress: Pireos 100, 11854 Athens, Greece\nVAT: EL999888777\n\n**CLIENT:**\nAegean Travel Group\nRepresented by: Sofia Konstantinou\nAddress: Akti Miaouli 47, 18538 Piraeus\nVAT: EL987654321\n\n**PROJECT DETAILS:**\nProject Title: Summer 2026 Islands Campaign\nProject Type: Social Media Content (Series)\nDelivery Date: April 20, 2026\nTotal Budget: 15,000.00 EUR\n\n**SCOPE OF WORK:**\n- Location scouting and shoot planning for 5 islands\n- Travel to and filming in: Santorini, Mykonos, Crete, Rhodes, Corfu\n- 10 short-form videos (15-30 seconds each)\n- Vertical format optimized for Instagram/TikTok/YouTube Shorts\n- Drone footage, gimbal work, and static beauty shots\n- Post-production with music, captions, and branding\n- Travel expenses for crew included in budget\n\n**PAYMENT TERMS:**\n- 50% deposit upon contract signing: 7,500.00 EUR\n- 50% upon final delivery: 7,500.00 EUR\n- Payment terms: 30 days from invoice date\n- Late payments subject to 2% monthly interest\n\n**INTELLECTUAL PROPERTY:**\nUpon full payment, all rights to the final deliverables transfer to the Client. Raw footage and project files remain property of Devre Media unless otherwise negotiated.\n\n**REVISIONS:**\nUp to 3 rounds of revisions included. Additional revisions billed at 120.00 EUR/hour.\n\n**CANCELLATION:**\nClient may cancel with 7 days written notice. Deposit is non-refundable. Work completed to date will be billed.\n\n**SIGNATURES:**\n\nFor Devre Media Production: [SIGNED] Date: 20/01/2026\n\nFor Client: [SIGNED] Date: 21/01/2026',
    template1_id,
    'signed',
    '2026-01-18 10:00:00+00',
    '2026-01-20 09:15:00+00',
    '2026-01-21 16:45:00+00',
    '{
      "client_signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "client_name": "Sofia Konstantinou",
      "client_ip": "185.18.218.74",
      "signed_at": "2026-01-21T16:45:33.128Z"
    }'::jsonb,
    '/contracts/2026/01/aegean-travel-summer-campaign-signed.pdf',
    NULL,
    '2026-01-16 13:30:00+00'
  ),
  (
    contract3_id, project5_id, client5_id,
    'Marina Bay Hotel - Promotional Video Agreement',
    E'VIDEO PRODUCTION SERVICES AGREEMENT\n\nThis Agreement is entered into on February 10, 2026 between:\n\n**SERVICE PROVIDER:**\nDevre Media Production\nAddress: Pireos 100, 11854 Athens, Greece\nVAT: EL999888777\n\n**CLIENT:**\nMarina Bay Hotel\nRepresented by: Yiannis Stavrou\nAddress: Megalou Alexandrou 3, 54640 Thessaloniki\nVAT: EL777888999\n\n**PROJECT DETAILS:**\nProject Title: Marina Bay Hotel Promotional Video\nProject Type: Commercial/Promotional\nDelivery Date: April 30, 2026\nTotal Budget: 6,800.00 EUR\n\n**SCOPE OF WORK:**\n- 2-day shoot at hotel property in Thessaloniki\n- Showcase rooms, restaurant, spa, and sea views\n- Drone aerial footage of location and surroundings\n- Interviews with hotel manager (optional)\n- Cinematic B-roll of amenities and guest experiences\n- Post-production editing, color grading\n- Licensed music and sound design\n- Final 2-3 minute video in multiple formats (16:9, 9:16, 1:1)\n\n**PAYMENT TERMS:**\n- 50% deposit upon contract signing: 3,400.00 EUR\n- 50% upon final delivery: 3,400.00 EUR\n- Payment terms: 30 days from invoice date\n- Late payments subject to 2% monthly interest\n\n**INTELLECTUAL PROPERTY:**\nUpon full payment, all rights to the final deliverables transfer to the Client. Raw footage and project files remain property of Devre Media unless otherwise negotiated.\n\n**REVISIONS:**\nUp to 2 rounds of revisions included. Additional revisions billed at 120.00 EUR/hour.\n\n**CANCELLATION:**\nClient may cancel with 7 days written notice. Deposit is non-refundable. Work completed to date will be billed.\n\n**SIGNATURES:**\n\nFor Devre Media Production: ___________________ Date: ___________\n\nFor Client: ___________________ Date: ___________',
    template1_id,
    'sent',
    '2026-02-10 15:00:00+00',
    NULL, NULL, NULL,
    '/contracts/2026/02/marina-bay-hotel-promo-draft.pdf',
    '2026-02-24 23:59:59+00', -- Expires in 14 days
    '2026-02-09 17:30:00+00'
  );

  -- ===========================================================================
  -- FILMING REQUESTS
  -- ===========================================================================
  INSERT INTO filming_requests (
    id, client_id, title, description, preferred_dates, location, project_type,
    budget_range, reference_links, status, admin_notes, converted_project_id, created_at
  ) VALUES
  (
    filming_req1_id, client5_id,
    'Marina Bay Hotel Promotional Video',
    'We are a newly renovated boutique hotel in Thessaloniki seeking a high-quality promotional video. We want to showcase our modern rooms, rooftop restaurant with sea views, spa facilities, and the overall luxury experience. Target audience is international tourists (European and American markets). We would like the video to feel cinematic and upscale, similar to luxury hotel videos on YouTube. Preferred length 2-3 minutes.',
    '["2026-02-20", "2026-02-21", "2026-02-27", "2026-02-28", "2026-03-05"]'::jsonb,
    'Marina Bay Hotel, Megalou Alexandrou 3, Thessaloniki 54640',
    'commercial',
    '5,000 - 8,000 EUR',
    '[
      {"title": "Reference: Four Seasons Hotel Video", "url": "https://youtube.com/watch?v=example1"},
      {"title": "Style inspiration: Santorini Luxury Hotels", "url": "https://youtube.com/watch?v=example2"}
    ]'::jsonb,
    'converted',
    'Great lead! Had initial call on Feb 1st. Client is professional and has clear vision. Budget approved at 6,800 EUR. Converted to project and contract sent.',
    project5_id,
    '2026-01-25 11:15:00+00'
  ),
  (
    filming_req2_id, NULL,
    'Wedding Videography - June 2026',
    'Hello, we are getting married on June 14, 2026 in Athens and are looking for a wedding videographer. The ceremony will be at St. Paul''s Anglican Church in the morning, followed by reception at a venue in Vouliagmeni (by the coast). We would like full-day coverage, around 8-10 hours. We want a cinematic highlight video (5-10 minutes) and also full ceremony footage. We love emotional, storytelling style videos. Our budget is flexible but ideally under 4,000 EUR. Please let us know your availability and packages!',
    '["2026-06-14"]'::jsonb,
    'St. Paul''s Anglican Church, Athens & Reception venue in Vouliagmeni',
    'other',
    'Under 4,000 EUR',
    '[
      {"title": "Style we love", "url": "https://instagram.com/weddingvideographer"}
    ]'::jsonb,
    'pending',
    NULL,
    NULL,
    '2026-02-08 19:30:00+00'
  );

  -- ===========================================================================
  -- EQUIPMENT LISTS
  -- ===========================================================================
  INSERT INTO equipment_lists (
    id, project_id, items, created_at, updated_at
  ) VALUES
  (
    equipment1_id, project2_id,
    '[
      {
        "id": "eq1",
        "category": "Camera",
        "name": "Sony FX6",
        "quantity": 1,
        "notes": "Main A-cam",
        "checked": true
      },
      {
        "id": "eq2",
        "category": "Camera",
        "name": "Sony A7S III",
        "quantity": 1,
        "notes": "B-cam / gimbal",
        "checked": true
      },
      {
        "id": "eq3",
        "category": "Lens",
        "name": "Sony 24-70mm f/2.8 GM",
        "quantity": 1,
        "notes": "",
        "checked": true
      },
      {
        "id": "eq4",
        "category": "Lens",
        "name": "Sony 70-200mm f/2.8 GM",
        "quantity": 1,
        "notes": "",
        "checked": true
      },
      {
        "id": "eq5",
        "category": "Drone",
        "name": "DJI Mavic 3 Cine",
        "quantity": 1,
        "notes": "For aerial shots",
        "checked": true
      },
      {
        "id": "eq6",
        "category": "Drone",
        "name": "Extra drone batteries (x4)",
        "quantity": 4,
        "notes": "",
        "checked": true
      },
      {
        "id": "eq7",
        "category": "Stabilization",
        "name": "DJI Ronin RS3",
        "quantity": 1,
        "notes": "Gimbal for A7S III",
        "checked": true
      },
      {
        "id": "eq8",
        "category": "Audio",
        "name": "Rode Wireless GO II",
        "quantity": 1,
        "notes": "For interviews",
        "checked": false
      },
      {
        "id": "eq9",
        "category": "Support",
        "name": "Carbon fiber tripod",
        "quantity": 1,
        "notes": "",
        "checked": true
      },
      {
        "id": "eq10",
        "category": "Support",
        "name": "ND filters set",
        "quantity": 1,
        "notes": "Essential for bright Greek sun",
        "checked": true
      },
      {
        "id": "eq11",
        "category": "Storage",
        "name": "CFexpress cards (256GB x3)",
        "quantity": 3,
        "notes": "",
        "checked": true
      },
      {
        "id": "eq12",
        "category": "Storage",
        "name": "Portable SSD (2TB)",
        "quantity": 1,
        "notes": "For backing up footage on location",
        "checked": true
      },
      {
        "id": "eq13",
        "category": "Power",
        "name": "V-mount batteries (x6)",
        "quantity": 6,
        "notes": "",
        "checked": true
      },
      {
        "id": "eq14",
        "category": "Lighting",
        "name": "Aputure MC RGB lights (x2)",
        "quantity": 2,
        "notes": "For evening/interior shots",
        "checked": false
      }
    ]'::jsonb,
    '2026-02-05 10:00:00+00',
    '2026-02-10 08:30:00+00'
  ),
  (
    equipment2_id, project6_id,
    '[
      {
        "id": "eq1",
        "category": "Camera",
        "name": "DJI Ronin 4D (rented)",
        "quantity": 1,
        "notes": "High-end cinema camera for product shots",
        "checked": false
      },
      {
        "id": "eq2",
        "category": "Camera",
        "name": "Sony FX6",
        "quantity": 1,
        "notes": "For interviews and B-roll",
        "checked": false
      },
      {
        "id": "eq3",
        "category": "Lens",
        "name": "Sony 16-35mm f/2.8 GM",
        "quantity": 1,
        "notes": "Wide shots of olive groves",
        "checked": false
      },
      {
        "id": "eq4",
        "category": "Lens",
        "name": "Sony 24-70mm f/2.8 GM",
        "quantity": 1,
        "notes": "",
        "checked": false
      },
      {
        "id": "eq5",
        "category": "Lens",
        "name": "Sony 85mm f/1.4 GM",
        "quantity": 1,
        "notes": "For product close-ups",
        "checked": false
      },
      {
        "id": "eq6",
        "category": "Drone",
        "name": "DJI Mavic 3 Cine",
        "quantity": 1,
        "notes": "",
        "checked": false
      },
      {
        "id": "eq7",
        "category": "Audio",
        "name": "Sennheiser MKH 416 shotgun mic",
        "quantity": 1,
        "notes": "For farmer interviews",
        "checked": false
      },
      {
        "id": "eq8",
        "category": "Audio",
        "name": "Rode Wireless GO II",
        "quantity": 2,
        "notes": "Lav mics for interviews",
        "checked": false
      },
      {
        "id": "eq9",
        "category": "Lighting",
        "name": "Aputure 600d Pro",
        "quantity": 1,
        "notes": "For interior bottling facility",
        "checked": false
      },
      {
        "id": "eq10",
        "category": "Lighting",
        "name": "Aputure Light Dome II",
        "quantity": 1,
        "notes": "Soft light for interviews",
        "checked": false
      }
    ]'::jsonb,
    '2026-02-10 09:30:00+00',
    '2026-02-10 09:30:00+00'
  );

  -- ===========================================================================
  -- SHOT LISTS
  -- ===========================================================================
  INSERT INTO shot_lists (
    id, project_id, shots, created_at, updated_at
  ) VALUES
  (
    shot_list1_id, project2_id,
    '[
      {
        "id": "shot1",
        "scene": "Santorini - Oia Village",
        "shot_number": 1,
        "description": "Sunrise over Oia - wide aerial drone shot of white buildings and blue domes",
        "shot_type": "Drone - Wide",
        "camera_movement": "Slow push in",
        "duration_seconds": 8,
        "notes": "Golden hour essential. Shoot between 6:30-7:00am",
        "status": "completed",
        "priority": "high"
      },
      {
        "id": "shot2",
        "scene": "Santorini - Oia Village",
        "shot_number": 2,
        "description": "Narrow alleyway with colorful bougainvillea flowers",
        "shot_type": "Gimbal - Medium",
        "camera_movement": "Walking POV through alley",
        "duration_seconds": 6,
        "notes": "Look for pink/magenta flowers",
        "status": "completed",
        "priority": "medium"
      },
      {
        "id": "shot3",
        "scene": "Santorini - Caldera",
        "shot_number": 3,
        "description": "Sunset over caldera with cruise ship in background",
        "shot_type": "Drone - Wide",
        "camera_movement": "Orbit around viewpoint",
        "duration_seconds": 10,
        "notes": "Shoot from Fira viewpoint. 7:00-7:30pm",
        "status": "completed",
        "priority": "high"
      },
      {
        "id": "shot4",
        "scene": "Santorini - Beach",
        "shot_number": 4,
        "description": "Red Beach - unique red volcanic sand and cliffs",
        "shot_type": "Static - Wide",
        "camera_movement": "None",
        "duration_seconds": 5,
        "notes": "Midday for color contrast",
        "status": "completed",
        "priority": "medium"
      },
      {
        "id": "shot5",
        "scene": "Santorini - Food",
        "shot_number": 5,
        "description": "Traditional Greek food - close-up of fresh seafood platter",
        "shot_type": "Handheld - Close-up",
        "camera_movement": "Slow reveal/tilt up",
        "duration_seconds": 4,
        "notes": "Arrange with taverna in Oia",
        "status": "completed",
        "priority": "low"
      },
      {
        "id": "shot6",
        "scene": "Mykonos - Windmills",
        "shot_number": 6,
        "description": "Iconic Mykonos windmills at sunset",
        "shot_type": "Drone - Medium",
        "camera_movement": "Lateral tracking",
        "duration_seconds": 7,
        "notes": "Schedule for Feb 19, 6:30pm",
        "status": "pending",
        "priority": "high"
      },
      {
        "id": "shot7",
        "scene": "Mykonos - Little Venice",
        "shot_number": 7,
        "description": "Colorful houses by the water with waves crashing",
        "shot_type": "Gimbal - Wide",
        "camera_movement": "Slow lateral pan",
        "duration_seconds": 8,
        "notes": "Best during golden hour or blue hour",
        "status": "pending",
        "priority": "high"
      },
      {
        "id": "shot8",
        "scene": "Mykonos - Beach Club",
        "shot_number": 8,
        "description": "Beach club scene - people enjoying, umbrellas, turquoise water",
        "shot_type": "Drone - High Angle",
        "camera_movement": "Top-down orbit",
        "duration_seconds": 6,
        "notes": "Paradise Beach or Super Paradise Beach",
        "status": "pending",
        "priority": "medium"
      }
    ]'::jsonb,
    '2026-02-05 11:00:00+00',
    '2026-02-10 07:45:00+00'
  ),
  (
    shot_list2_id, project6_id,
    '[
      {
        "id": "shot1",
        "scene": "Olive Grove - Establishing",
        "shot_number": 1,
        "description": "Wide aerial of olive grove landscape in Kalamata region",
        "shot_type": "Drone - Wide",
        "camera_movement": "Forward tracking over trees",
        "duration_seconds": 10,
        "notes": "Morning light preferred. Show scale of grove",
        "status": "pending",
        "priority": "high"
      },
      {
        "id": "shot2",
        "scene": "Olive Grove - Trees",
        "shot_number": 2,
        "description": "Close-up of ancient olive tree trunk and branches",
        "shot_type": "Static - Close-up",
        "camera_movement": "Slow tilt up trunk",
        "duration_seconds": 5,
        "notes": "Find oldest, most characterful tree",
        "status": "pending",
        "priority": "medium"
      },
      {
        "id": "shot3",
        "scene": "Harvest",
        "shot_number": 3,
        "description": "Farmers harvesting olives - hands picking/shaking branches",
        "shot_type": "Handheld - Medium/Close-up",
        "camera_movement": "Documentary style",
        "duration_seconds": 8,
        "notes": "Get permission from workers. Show traditional methods",
        "status": "pending",
        "priority": "high"
      },
      {
        "id": "shot4",
        "scene": "Farmer Interview",
        "shot_number": 4,
        "description": "Interview with farmer about organic practices",
        "shot_type": "Static - Medium Close-up",
        "camera_movement": "None",
        "duration_seconds": 30,
        "notes": "Set up in grove with soft natural light. Use 85mm lens for shallow DOF",
        "status": "pending",
        "priority": "high"
      },
      {
        "id": "shot5",
        "scene": "Bottling Facility",
        "shot_number": 5,
        "description": "Bottling line - bottles being filled with golden olive oil",
        "shot_type": "Gimbal - Tracking",
        "camera_movement": "Follow bottles along conveyor",
        "duration_seconds": 6,
        "notes": "Coordinate with factory schedule",
        "status": "pending",
        "priority": "medium"
      },
      {
        "id": "shot6",
        "scene": "Product",
        "shot_number": 6,
        "description": "Final product shots - bottles with label, oil being poured",
        "shot_type": "Static - Close-up",
        "camera_movement": "None",
        "duration_seconds": 4,
        "notes": "Studio-style lighting. Emphasize premium quality",
        "status": "pending",
        "priority": "high"
      }
    ]'::jsonb,
    '2026-02-10 10:00:00+00',
    '2026-02-10 10:00:00+00'
  );

  -- ===========================================================================
  -- CONCEPT NOTES
  -- ===========================================================================
  INSERT INTO concept_notes (
    id, project_id, title, content, attachments, created_at, updated_at
  ) VALUES
  (
    concept1_id, project2_id,
    'Summer Islands Campaign - Creative Direction',
    E'**Overall Vision:**\nCreate a series of bite-sized visual poems that capture the essence of each Greek island. Each video should feel like a postcard come to life - aspirational yet authentic.\n\n**Visual Style:**\n- Bright, saturated colors (but not over-processed)\n- Golden hour and blue hour preferred for most shots\n- Smooth camera movements (gimbal/drone)\n- Mix of wide establishing shots and intimate details\n- Vertical 9:16 format optimized for mobile viewing\n\n**Tone & Mood:**\n- Romantic and dreamy\n- Sense of discovery and wanderlust\n- Luxurious but approachable\n- Celebrate local culture, not just tourists\n\n**Music Direction:**\n- Upbeat but not overwhelming\n- Mix of electronic/chill beats with Greek instrumental elements\n- 120-130 BPM range\n- Consider different music for each island to match character\n\n**Key Elements for Each Island:**\n\n1. **Santorini** - Iconic white & blue architecture, caldera sunset, romantic vibes\n2. **Mykonos** - Party energy, windmills, Little Venice, beach clubs\n3. **Crete** - Ancient history, Samaria Gorge, traditional villages, authentic cuisine\n4. **Rhodes** - Medieval Old Town, pristine beaches, contrast old/new\n5. **Corfu** - Lush greenery, Venetian influence, turquoise waters\n\n**Reference Videos:**\n- @droneguru_greece (Instagram) - love the aerial style\n- @greekislandvibes (TikTok) - pacing and music choices\n- Peter McKinnon travel videos - color grading inspiration\n\n**Deliverable Specs:**\n- Format: 9:16 (1080x1920)\n- Length: 15-30 seconds per video\n- Frame rate: 24fps (cinematic) or 30fps (social media smooth)\n- Include captions/text overlays with island names\n- End card with Aegean Travel logo and CTA',
    '[
      {"name": "moodboard-islands.pdf", "url": "/attachments/concept/moodboard-islands.pdf", "type": "application/pdf"},
      {"name": "color-palette.png", "url": "/attachments/concept/color-palette.png", "type": "image/png"}
    ]'::jsonb,
    '2026-01-22 15:30:00+00',
    '2026-02-04 11:20:00+00'
  ),
  (
    concept2_id, project1_id,
    'Hellas Foods Corporate Video - Story Arc',
    E'**Narrative Structure:**\n\nThe video should tell the story of Hellas Foods as a journey from tradition to innovation, family values to modern business excellence.\n\n**Act 1: Heritage (0:00-0:45)**\n- Open with archival photos/footage of company founding in 1978\n- Voice of founder or current CEO talking about humble beginnings\n- Transition to present-day exterior of facilities\n- Theme: "From small family business to industry leader"\n\n**Act 2: People & Process (0:45-2:00)**\n- Showcase the manufacturing process - modern, clean, efficient\n- Focus on people: workers on production line, quality control team\n- Interviews with long-term employees (loyalty, pride in work)\n- Show the care and attention that goes into each product\n- Theme: "Quality through dedication and expertise"\n\n**Act 3: Products & Values (2:00-2:45)**\n- Beautiful product shots: olive oil, dairy, packaged goods\n- Connection to Greek land and ingredients\n- Sustainability practices\n- Innovation: new organic product lines\n- Theme: "Tradition meets innovation"\n\n**Act 4: Future Vision (2:45-3:15)**\n- CEO speaking about company vision and values\n- International reach: products being shipped globally\n- Community involvement: supporting local farmers\n- End on inspirational note about future growth\n- Theme: "Growing together, nourishing the world"\n\n**Visual Style:**\n- Corporate but warm (avoid sterile/cold corporate feel)\n- Mix of interview, B-roll, and drone shots\n- Clean, modern color grade with slight warmth\n- Professional but human\n\n**Music:**\n- Orchestral/cinematic underscore\n- Builds from gentle/intimate to inspiring/epic\n- Greek instrumentation subtly woven in?\n\n**Key Messages:**\n- Family values at scale\n- Quality and tradition\n- Innovation and growth\n- Pride in Greek heritage\n- Trusted by customers for generations',
    '[]'::jsonb,
    '2026-01-08 10:00:00+00',
    '2026-01-15 14:30:00+00'
  ),
  (
    concept3_id, project5_id,
    'Marina Bay Hotel - Luxury Positioning',
    E'**Brand Positioning:**\nMarina Bay Hotel should be positioned as the hidden gem of Thessaloniki - intimate luxury with a local soul. Not trying to compete with mega-resorts, but offering discerning travelers an authentic yet upscale experience.\n\n**Target Audience:**\n- Age: 35-60\n- Demographics: International tourists (European, American)\n- Psychographics: Experienced travelers who value authenticity over ostentation\n- They want luxury but not generic "luxury hotel"\n- Interested in local culture, cuisine, and experiences\n\n**Video Strategy:**\n\n**Opening Hook (0:00-0:05)**\n- Sunrise over Thermaic Gulf from rooftop\n- Immediate "wow" moment to stop scroll\n\n**Experience Showcase (0:05-1:30)**\n- Guest journey through hotel\n- Room reveal with sea view\n- Breakfast on terrace with local pastries\n- Spa treatment (Mediterranean-inspired)\n- Rooftop restaurant dinner at golden hour\n- Show the EXPERIENCE not just the rooms\n\n**Location Context (1:30-2:00)**\n- Thessaloniki''s White Tower (iconic landmark nearby)\n- Marina/waterfront location\n- Proximity to Old Town, restaurants, nightlife\n- "Your home base for exploring Thessaloniki"\n\n**Emotional Payoff (2:00-2:30)**\n- Couple or solo traveler enjoying sunset from rooftop\n- Sense of discovery and relaxation\n- Tagline: "Where the Aegean meets luxury"\n\n**Visual Language:**\n- Cinematic but not over-produced\n- Natural light emphasized\n- Mediterranean color palette: blues, whites, warm terracotta\n- Slow, deliberate camera movements\n- Showcase texture: linens, marble, sea, food\n\n**What to Avoid:**\n- Generic hotel video cliches (empty room pans)\n- Over-reliance on drone shots\n- Sterile/cold feeling\n- Looking like a chain hotel\n\n**References:**\n- Soho House brand videos (upscale but cool)\n- Luxury Greek island hotel promos\n- Kinfolk magazine aesthetic\n\n**Deliverables:**\n- 2:30 main video (16:9)\n- 60-second edit for social media\n- 30-second teaser (vertical for Stories)\n- Stills gallery for website',
    '[
      {"name": "hotel-moodboard.pdf", "url": "/attachments/concept/marina-bay-moodboard.pdf", "type": "application/pdf"}
    ]'::jsonb,
    '2026-02-09 16:00:00+00',
    '2026-02-09 16:00:00+00'
  );

  -- ===========================================================================
  -- ACTIVITY LOG
  -- ===========================================================================
  INSERT INTO activity_log (
    id, user_id, action, entity_type, entity_id, metadata, created_at
  ) VALUES
  (
    gen_random_uuid(), NULL,
    'created',
    'project',
    project1_id,
    '{"project_title": "Hellas Foods Corporate Video 2026", "client_name": "Hellas Foods SA"}'::jsonb,
    '2026-01-05 09:00:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'uploaded',
    'deliverable',
    deliverable1_id,
    '{"deliverable_title": "Hellas Foods Corporate Video - Draft v2", "file_size": "1.72 GB"}'::jsonb,
    '2026-02-05 17:30:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'status_changed',
    'project',
    project3_id,
    '{"project_title": "TechStart Demo Day Q1 2026", "old_status": "editing", "new_status": "review"}'::jsonb,
    '2026-02-08 11:00:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'signed',
    'contract',
    contract2_id,
    '{"contract_title": "Aegean Travel - Summer 2026 Islands Campaign Agreement", "client_name": "Aegean Travel Group"}'::jsonb,
    '2026-01-21 16:45:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'sent',
    'invoice',
    invoice1_id,
    '{"invoice_number": "INV-2026-001", "total": 8500.00, "client_name": "Hellas Foods SA"}'::jsonb,
    '2026-02-01 09:00:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'payment_received',
    'invoice',
    invoice2_id,
    '{"invoice_number": "INV-2026-002", "total": 12000.00, "payment_method": "bank_transfer"}'::jsonb,
    '2026-01-15 14:30:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'task_completed',
    'task',
    task5_id,
    '{"task_title": "Book flights and accommodation - Santorini", "project_title": "Summer 2026 Islands Campaign"}'::jsonb,
    '2026-02-07 16:45:00+00'
  );

  -- ===========================================================================
  -- NOTIFICATIONS
  -- ===========================================================================
  INSERT INTO notifications (
    id, user_id, type, title, body, read, action_url, created_at
  ) VALUES
  (
    gen_random_uuid(), NULL,
    'invoice_overdue',
    'Invoice Overdue: INV-2025-087',
    'Invoice for Olympic Events & Catering (Wedding showreel) is now overdue. Amount: 3,200.00 EUR. Please follow up with client.',
    false,
    '/invoices/' || invoice4_id::text,
    '2026-01-15 08:00:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'project_deadline_approaching',
    'Project Deadline Approaching',
    'Project "TechStart Demo Day Q1 2026" deadline is in 10 days (Feb 20). Current status: Review.',
    false,
    '/projects/' || project3_id::text,
    '2026-02-10 09:00:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'contract_signed',
    'Contract Signed: Aegean Travel',
    'Sofia Konstantinou has signed the contract for "Summer 2026 Islands Campaign". Project can now proceed.',
    true,
    '/contracts/' || contract2_id::text,
    '2026-01-21 16:45:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'new_filming_request',
    'New Filming Request',
    'New filming request received: "Wedding Videography - June 2026". Review and respond to lead.',
    false,
    '/filming-requests/' || filming_req2_id::text,
    '2026-02-08 19:30:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'deliverable_viewed',
    'Client Viewed Deliverable',
    'Client has viewed "TechStart Demo Day Highlight Reel v1". Awaiting feedback.',
    true,
    '/deliverables/' || deliverable3_id::text,
    '2026-02-09 10:15:00+00'
  ),
  (
    gen_random_uuid(), NULL,
    'task_assigned',
    'New Task Assigned',
    'Task "Color grade all footage" has been assigned to you for project "Hellas Foods Corporate Video 2026".',
    true,
    '/tasks/' || task1_id::text,
    '2026-02-08 09:00:00+00'
  );

END $$;

-- =============================================================================
-- SEED DATA COMPLETE
-- =============================================================================
-- Summary:
-- - 5 clients (3 active, 1 inactive, 1 lead)
-- - 8 projects (various statuses and types)
-- - 20 tasks across projects
-- - 5 deliverables with video annotations
-- - 5 invoices (draft, sent, viewed, paid, overdue)
-- - 3 expenses
-- - 3 messages
-- - 2 contract templates
-- - 3 contracts (2 signed, 1 sent)
-- - 2 filming requests (1 converted, 1 pending)
-- - 2 equipment lists with detailed items
-- - 2 shot lists with detailed shots
-- - 3 concept notes with creative direction
-- - 7 activity log entries
-- - 6 notifications
--
-- All data uses realistic Greek videography business scenarios.
-- Dates are set around early 2026 (January-February).
-- =============================================================================
