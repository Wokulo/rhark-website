-- ─── Programmes CMS Table ──────────────────────────────────────────
-- Editable programmes for the Staff Portal.

CREATE TABLE IF NOT EXISTS programmes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  short_title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'Heart',
  color VARCHAR(20) NOT NULL DEFAULT 'primary',
  image_url TEXT,
  objectives TEXT[] DEFAULT '{}',
  target_beneficiaries TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_programmes_slug ON programmes(slug);
CREATE INDEX IF NOT EXISTS idx_programmes_visible ON programmes(is_visible);
CREATE INDEX IF NOT EXISTS idx_programmes_sort_order ON programmes(sort_order);

-- ─── RLS ──────────────────────────────────────────────────────────────
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;

-- Authenticated staff can read all programmes
CREATE POLICY "Authenticated staff can read programmes"
  ON programmes FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated staff can insert programmes
CREATE POLICY "Authenticated staff can insert programmes"
  ON programmes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated staff can update programmes
CREATE POLICY "Authenticated staff can update programmes"
  ON programmes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated staff can delete programmes
CREATE POLICY "Authenticated staff can delete programmes"
  ON programmes FOR DELETE
  TO authenticated
  USING (true);

-- ─── Seed Default Programmes ─────────────────────────────────────────
INSERT INTO programmes (slug, title, short_title, description, icon, color, image_url, objectives, target_beneficiaries, sort_order, is_visible) VALUES
  ('srhr', 'Sexual and Reproductive Health and Rights', 'SRHR', 'Advancing access to comprehensive sexual and reproductive health information, services, and rights for young people and women in Siaya County.', 'Heart', 'primary', '/images/programs/srhr.jpg', ARRAY['Increase access to SRHR information and services', 'Reduce unmet need for family planning', 'Strengthen community health systems'], ARRAY['Youth', 'Women', 'Adolescents'], 1, true),
  ('mental-health', 'Mental Health and Wellness', 'Mental Health', 'Promoting mental health awareness, reducing stigma, and connecting community members to psychosocial support services.', 'Brain', 'secondary', '/images/programs/mental-health.jpg', ARRAY['Reduce mental health stigma in communities', 'Train community health workers in psychosocial support', 'Establish peer support networks'], ARRAY['Youth', 'Women', 'Community Leaders'], 2, true),
  ('hiv-teen-pregnancy', 'HIV/AIDS and Teen Pregnancy Prevention', 'HIV & Teen Pregnancy', 'Comprehensive prevention programmes targeting adolescents and youth to reduce HIV transmission and teenage pregnancy rates.', 'Shield', 'accent', '/images/programs/hiv-prevention.jpg', ARRAY['Reduce new HIV infections among youth', 'Decrease teenage pregnancy rates', 'Increase uptake of HIV testing and counselling'], ARRAY['Adolescents', 'Youth', 'Schools'], 3, true),
  ('gender-equality', 'Gender Equality and Empowerment', 'Gender Equality', 'Challenging harmful gender norms, promoting women''s rights, and empowering girls and women to participate fully in society.', 'Users', 'primary', '/images/programs/gender-equality.jpg', ARRAY['Eliminate gender-based violence', 'Increase women''s economic empowerment', 'Promote girls'' education and retention'], ARRAY['Women', 'Girls', 'Community Leaders'], 4, true),
  ('governance-policy', 'Governance and Policy Engagement', 'Governance & Policy', 'Engaging government institutions and policymakers to create enabling environments for SRHR and gender equality.', 'Landmark', 'secondary', '/images/programs/governance.jpg', ARRAY['Influence county health policies', 'Strengthen accountability mechanisms', 'Build civil society capacity for advocacy'], ARRAY['Government Institutions', 'Community Leaders', 'Development Partners'], 5, true),
  ('climate-justice', 'Climate Justice', 'Climate Justice', 'Addressing the intersection of climate change and reproductive health, empowering communities to adapt and advocate for environmental justice.', 'Leaf', 'accent', '/images/programs/climate-justice.jpg', ARRAY['Build community climate resilience', 'Link climate change to SRHR outcomes', 'Advocate for climate justice policies'], ARRAY['Rural Communities', 'Youth', 'Women'], 6, true),
  ('deep-canvassing', 'Deep Canvassing', 'Deep Canvassing', 'RHARK conducts structured community conversations that build trust, encourage empathy, and promote informed dialogue on sexual and reproductive health, gender equality, HIV prevention, and social inclusion.', 'MessageCircle', 'secondary', '/images/programs/deep-canvassing.jpg', ARRAY['Build trust and empathy within communities', 'Promote informed dialogue on SRHR and gender equality', 'Foster social inclusion and reduce stigma'], ARRAY['Community Members', 'Youth', 'Women'], 7, true),
  ('inschool-cse', 'In-School Comprehensive Sexuality Education (CSE) Sessions', 'In-School CSE', 'RHARK delivers age-appropriate, evidence-based sexuality education in schools to equip learners with accurate information, life skills, and healthy decision-making while promoting dignity, respect, and responsible behavior.', 'BookOpen', 'primary', '/images/programs/inschool-cse.jpg', ARRAY['Deliver age-appropriate sexuality education in schools', 'Equip learners with life skills and accurate information', 'Promote dignity, respect, and responsible behavior'], ARRAY['Learners', 'Teachers', 'Schools'], 8, true),
  ('community-safe-space', 'Community Safe Spaces', 'Community Safe Spaces', 'RHARK establishes inclusive and supportive safe spaces where young people, women, and vulnerable community members can access mentorship, psychosocial support, health information, referrals, and meaningful dialogue without fear of stigma or discrimination.', 'Home', 'accent', '/images/programs/community-safe-space.jpg', ARRAY['Establish inclusive and supportive community safe spaces', 'Provide mentorship, psychosocial support, and referrals', 'Enable meaningful dialogue free from stigma and discrimination'], ARRAY['Young People', 'Women', 'Vulnerable Groups'], 9, true),
  ('gumzo-chuoni', 'Gumzo Chuoni / Campus Vibes', 'Gumzo Chuoni', 'RHARK engages university and college students through interactive campus dialogues, peer education, mentorship, health awareness campaigns, and youth-led discussions that promote leadership, innovation, and positive health behaviors.', 'GraduationCap', 'primary', '/images/programs/gumzo-chuoni.jpg', ARRAY('Engage university and college students in interactive campus dialogues', 'Build peer education and mentorship networks on campus', 'Promote leadership, innovation, and positive health behaviors'), ARRAY['University Students', 'College Students', 'Youth'], 10, true);