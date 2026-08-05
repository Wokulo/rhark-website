-- ─── Homepage Content CMS Table ───────────────────────────────────────────
-- Stores all editable homepage content for the Staff Portal.
-- Each row represents a single field within a section.

CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT NOT NULL,
  field TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, field)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON homepage_content(section);
CREATE INDEX IF NOT EXISTS idx_homepage_content_active ON homepage_content(is_active);

-- ─── RLS ──────────────────────────────────────────────────────────────────
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Authenticated staff can read all homepage content
CREATE POLICY "Authenticated staff can read homepage content"
  ON homepage_content FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated staff can insert homepage content
CREATE POLICY "Authenticated staff can insert homepage content"
  ON homepage_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated staff can update homepage content
CREATE POLICY "Authenticated staff can update homepage content"
  ON homepage_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated staff can delete homepage content
CREATE POLICY "Authenticated staff can delete homepage content"
  ON homepage_content FOR DELETE
  TO authenticated
  USING (true);

-- ─── Seed Default Homepage Content ────────────────────────────────────────
-- Hero section
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('hero', 'title', '{"en": "Empowering Communities."}', 1),
  ('hero', 'subtitle', '{"en": "Community-Based Organization · Since 2021"}', 2),
  ('hero', 'description', '{"en": "RHARK is a community-based organization in Siaya County, Kenya, dedicated to advancing SRHR, mental health, gender equality, HIV prevention, governance, and climate justice — empowering youth, women, adolescents, persons with disabilities, and rural communities through advocacy, education, and health promotion."}', 3),
  ('hero', 'primary_cta', '{"en": "Learn About RHARK", "href": "/about"}', 4),
  ('hero', 'secondary_cta', '{"en": "Explore Our Programs", "href": "/programmes"}', 5),
  ('hero', 'tertiary_cta', '{"en": "Support Our Mission", "href": "/get-involved/donate"}', 6),
  ('hero', 'video_src', '{"en": "/videos/rhark-story.mp4"}', 7),
  ('hero', 'trust_badge_1', '{"en": "10K+", "label": "People Reached"}', 8),
  ('hero', 'trust_badge_2', '{"en": "50+", "label": "Activities"}', 9),
  ('hero', 'trust_badge_3', '{"en": "5+", "label": "Partners"}', 10);

-- Hero images (stored as JSON array of image paths)
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('hero', 'images', '["/images/hero/DSC_0878.JPG", "/images/hero/photo_2026-07-26_20-07-27.jpg", "/images/hero/photo_2025-11-13_09-32-11.jpg", "/images/hero/IMG-20250212-WA0153.jpg", "/images/hero/IMG-20250131-WA0044.jpg", "/images/hero/IMG-20250130-WA0175.jpg", "/images/hero/IMG-20250130-WA0164.jpg", "/images/hero/IMG-20250129-WA0062.jpg", "/images/hero/hunkgraphy -9019.jpg", "/images/hero/hunkgraphy -8992.jpg", "/images/hero/DSC_1827.jpg", "/images/hero/DSC_0849.JPG", "/images/hero/DSC_0239.JPG", "/images/hero/DSC_0230.JPG", "/images/hero/DSC_0226.JPG", "/images/hero/DSC_0222.JPG"]', 11);

-- Impact stats
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('stats', 'stat_1', '{"value": 5000, "suffix": "+", "label": "Youth Reached", "description": "Young people impacted by our programs", "icon": "Users"}', 1),
  ('stats', 'stat_2', '{"value": 2500, "suffix": "+", "label": "Women Empowered", "description": "Women and girls supported through community initiatives", "icon": "TrendingUp"}', 2),
  ('stats', 'stat_3', '{"value": 120, "suffix": "+", "label": "Community Dialogues", "description": "Dialogues held with youth, parents, leaders, and duty bearers", "icon": "MessageCircle"}', 3),
  ('stats', 'stat_4', '{"value": 45, "suffix": "+", "label": "Schools Engaged", "description": "Schools reached through clubs, talks, and referrals", "icon": "School"}', 4),
  ('stats', 'stat_5', '{"value": 12, "label": "Active Projects", "description": "Ongoing community projects", "icon": "FolderKanban"}', 5),
  ('stats', 'stat_6', '{"value": 8, "label": "Counties Served", "description": "Across Western Kenya", "icon": "MapPin"}', 6),
  ('stats', 'stat_7', '{"value": 30, "suffix": "+", "label": "Partner Organizations", "description": "Funders and implementing partners", "icon": "Handshake"}', 7);

-- Programmes preview (references existing programme slugs)
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('programmes', 'preview_count', '{"en": "6"}', 1),
  ('programmes', 'heading', '{"en": "Integrated approaches to health and rights"}', 2),
  ('programmes', 'subheading', '{"en": "RHARK delivers holistic programmes across six thematic areas to create lasting impact in Siaya County and beyond."}', 3);

-- Partners
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('partners', 'heading', '{"en": "Working together for greater impact"}', 1),
  ('partners', 'partner_1_name', '{"en": "Siaya County Government"}', 2),
  ('partners', 'partner_1_logo', '{"en": "/images/partners/siaya-county-government-logo.webp"}', 3),
  ('partners', 'partner_2_name', '{"en": "World Health Organization (WHO)"}', 4),
  ('partners', 'partner_2_logo', '{"en": "/images/partners/who-logo.png"}', 5),
  ('partners', 'partner_3_name', '{"en": "Jaramogi Oginga Odinga University of Science and Technology (JOOUST)"}', 6),
  ('partners', 'partner_3_logo', '{"en": "/images/partners/jooust-logo.png"}', 7);

-- Projects preview
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('projects', 'heading', '{"en": "Programmes in action"}', 1),
  ('projects', 'project_1_title', '{"en": "Ujana Salama"}', 2),
  ('projects', 'project_1_summary', '{"en": "Safe youth spaces providing SRHR education and counselling for adolescents in Bondo Sub-County."}', 3),
  ('projects', 'project_1_location', '{"en": "Bondo Sub-County, Siaya"}', 4),
  ('projects', 'project_1_beneficiaries', '{"en": "1,200+"}', 5),
  ('projects', 'project_1_status', '{"en": "Active"}', 6),
  ('projects', 'project_1_tag', '{"en": "SRHR"}', 7),
  ('projects', 'project_2_title', '{"en": "Mama na Mtoto"}', 8),
  ('projects', 'project_2_summary', '{"en": "Maternal and newborn health programme supporting pregnant women and new mothers in rural Siaya."}', 9),
  ('projects', 'project_2_location', '{"en": "Siaya County"}', 10),
  ('projects', 'project_2_beneficiaries', '{"en": "800+"}', 11),
  ('projects', 'project_2_status', '{"en": "Active"}', 12),
  ('projects', 'project_2_tag', '{"en": "Maternal Health"}', 13);

-- Homepage announcements
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('announcements', 'heading', '{"en": "Latest Updates"}', 1),
  ('announcements', 'announcement_1_title', '{"en": "RHARK Launches New SRHR Awareness Campaign in Bondo Sub-County"}', 2),
  ('announcements', 'announcement_1_excerpt', '{"en": "RHARK has launched a comprehensive SRHR awareness campaign targeting over 2,000 youth in Bondo Sub-County."}', 3),
  ('announcements', 'announcement_1_date', '{"en": "15 January 2025"}', 4),
  ('announcements', 'announcement_2_title', '{"en": "Community Health Volunteers Trained in Maternal Health Support"}', 5),
  ('announcements', 'announcement_2_excerpt', '{"en": "Forty community health volunteers from across Siaya County completed a five-day training on maternal and newborn health."}', 6),
  ('announcements', 'announcement_2_date', '{"en": "8 January 2025"}', 7),
  ('announcements', 'announcement_3_title', '{"en": "RHARK Partners with County Government on Mental Health Policy"}', 8),
  ('announcements', 'announcement_3_excerpt', '{"en": "RHARK has entered into a memorandum of understanding with the Siaya County Government to co-develop a county-level mental health policy framework."}', 9),
  ('announcements', 'announcement_3_date', '{"en": "2 January 2025"}', 10);

-- Homepage CTA (Get Involved)
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('cta', 'heading', '{"en": "Join the movement for change"}', 1),
  ('cta', 'subheading', '{"en": "There are many ways to support RHARK\'s mission. Every contribution — big or small — makes a difference."}', 2),
  ('cta', 'donate_title', '{"en": "Donate"}', 3),
  ('cta', 'donate_description', '{"en": "Your financial support funds life-changing SRHR programmes, mental health services, and youth empowerment initiatives."}', 4),
  ('cta', 'donate_cta', '{"en": "Donate Now"}', 5),
  ('cta', 'volunteer_title', '{"en": "Volunteer"}', 6),
  ('cta', 'volunteer_description', '{"en": "Join our network of passionate volunteers and contribute your skills to advancing health and rights in Siaya County."}', 7),
  ('cta', 'volunteer_cta', '{"en": "Become a Volunteer"}', 8),
  ('cta', 'internship_title', '{"en": "Internship"}', 9),
  ('cta', 'internship_description', '{"en": "Gain hands-on experience in public health, gender, advocacy, and community development with a leading Kenyan CBO."}', 10),
  ('cta', 'internship_cta', '{"en": "Apply for Internship"}', 11);

-- Footer contact info
INSERT INTO homepage_content (section, field, value, sort_order) VALUES
  ('footer', 'org_name', '{"en": "Reproductive Health Action and Rights Kenya"}', 1),
  ('footer', 'org_abbreviation', '{"en": "RHARK"}', 2),
  ('footer', 'org_founded', '{"en": "2021"}', 3),
  ('footer', 'org_type', '{"en": "Community-Based Organization (CBO)"}', 4),
  ('footer', 'org_county', '{"en": "Siaya County"}', 5),
  ('footer', 'org_address', '{"en": "Ardhi House, DCC\'s Building, along Bondo–Kisumu Highway, Bondo Town"}', 6),
  ('footer', 'org_postal_address', '{"en": "P.O. Box 509–40601, Bondo, Kenya"}', 7),
  ('footer', 'org_email', '{"en": "rharkenya@gmail.com"}', 8),
  ('footer', 'org_phone', '{"en": "+254 733551415"}', 9);