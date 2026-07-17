-- RHARK CMS Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- ─── Extensions ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Roles ─────────────────────────────────────────────────────────────────────
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Permissions ───────────────────────────────────────────────────────────────
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, resource, action)
);

-- ─── Users (extends Supabase auth.users) ───────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role_id UUID REFERENCES roles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── News Categories ───────────────────────────────────────────────────────────
CREATE TABLE news_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── News ──────────────────────────────────────────────────────────────────────
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  publish_date TIMESTAMPTZ,
  seo_title VARCHAR(500),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Albums ────────────────────────────────────────────────────────────────────
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Gallery ───────────────────────────────────────────────────────────────────
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Departments ───────────────────────────────────────────────────────────────
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Team Members ──────────────────────────────────────────────────────────────
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_url TEXT,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  department_id UUID REFERENCES departments(id),
  biography TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin VARCHAR(500),
  facebook VARCHAR(500),
  x VARCHAR(500),
  instagram VARCHAR(500),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Projects ──────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  location VARCHAR(255),
  county VARCHAR(100),
  description TEXT,
  objectives TEXT[] DEFAULT '{}',
  budget DECIMAL(15,2),
  funding_partner VARCHAR(255),
  start_date DATE,
  end_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'on-hold')),
  project_images TEXT[] DEFAULT '{}',
  documents TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Events ────────────────────────────────────────────────────────────────────
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poster_url TEXT,
  title VARCHAR(500) NOT NULL,
  venue VARCHAR(500),
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT,
  registration_link TEXT,
  google_map_url TEXT,
  capacity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Document Categories ───────────────────────────────────────────────────────
CREATE TABLE document_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Documents ─────────────────────────────────────────────────────────────────
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES document_categories(id),
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size BIGINT NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Volunteers ────────────────────────────────────────────────────────────────
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  county VARCHAR(100) NOT NULL,
  skills TEXT,
  availability TEXT,
  motivation TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Donations ─────────────────────────────────────────────────────────────────
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id VARCHAR(255) NOT NULL UNIQUE,
  donor_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'cancelled')),
  is_recurring BOOLEAN DEFAULT false,
  campaign_id VARCHAR(255),
  message TEXT,
  mpesa_receipt_number VARCHAR(255),
  mpesa_checkout_request_id VARCHAR(255),
  merchant_request_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contact Messages ──────────────────────────────────────────────────────────
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  organization VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  inquiry_type VARCHAR(50) DEFAULT 'general',
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Newsletter Subscribers ────────────────────────────────────────────────────
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Media Library ─────────────────────────────────────────────────────────────
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  size BIGINT NOT NULL,
  folder VARCHAR(100),
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Settings ──────────────────────────────────────────────────────────────────
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Activity Logs ─────────────────────────────────────────────────────────────
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_publish_date ON news(publish_date DESC);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_gallery_album ON gallery(album_id);
CREATE INDEX idx_members_department ON members(department_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_display_order ON members(display_order);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_transaction ON donations(transaction_id);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX idx_media_library_folder ON media_library(folder);

-- ─── Seed Default Roles ────────────────────────────────────────────────────────
INSERT INTO roles (name, slug, description, is_system) VALUES
  ('Super Admin', 'super-admin', 'Full system access', true),
  ('Executive Director', 'executive-director', 'Strategic oversight and management', true),
  ('Communications Officer', 'communications-officer', 'Manage news, gallery, and public content', true),
  ('Finance Officer', 'finance-officer', 'Manage donations and financial reports', true),
  ('Volunteer Manager', 'volunteer-manager', 'Manage volunteer applications', true),
  ('Editor', 'editor', 'Create and edit content', true);

-- ─── Seed Default Permissions ──────────────────────────────────────────────────
-- Super Admin gets all permissions via application logic
-- Other roles get granular permissions defined in the application

-- ─── Seed Default Settings ─────────────────────────────────────────────────────
INSERT INTO settings (key, value) VALUES
  ('organization_name', '"RHARK"'),
  ('organization_tagline', '"Reproductive Health Action and Rights Kenya"'),
  ('organization_email', '"info@rhark.org"'),
  ('organization_phone', '"+254"'),
  ('organization_address', '"Siaya County, Kenya"'),
  ('social_facebook', '"https://facebook.com/rharkenya"'),
  ('social_twitter', '"https://twitter.com/rharkenya"'),
  ('social_instagram', '"https://instagram.com/rharkenya"'),
  ('social_linkedin', '"https://linkedin.com/company/rharkenya"'),
  ('mission', '"To advance reproductive health rights and gender equality"'),
  ('vision', '"A society where every person enjoys reproductive health and rights"');

-- ─── Seed Default News Categories ──────────────────────────────────────────────
INSERT INTO news_categories (name, slug, description) VALUES
  ('News', 'news', 'General news and updates'),
  ('Press Release', 'press-release', 'Official press releases'),
  ('Blog', 'blog', 'Blog posts and articles'),
  ('Success Story', 'success-story', 'Beneficiary success stories'),
  ('Announcement', 'announcement', 'Announcements and notices');

-- ─── Seed Default Document Categories ──────────────────────────────────────────
INSERT INTO document_categories (name, slug, description) VALUES
  ('Annual Reports', 'annual-reports', 'Annual organizational reports'),
  ('Policies', 'policies', 'Organizational policies'),
  ('Research Papers', 'research-papers', 'Research publications'),
  ('Financial Reports', 'financial-reports', 'Financial statements and reports'),
  ('Strategic Plans', 'strategic-plans', 'Strategic planning documents'),
  ('Meeting Minutes', 'meeting-minutes', 'Meeting minutes and notes'),
  ('Training Manuals', 'training-manuals', 'Training and reference materials'),
  ('Forms', 'forms', 'Application and registration forms');

-- ─── Seed Default Departments ──────────────────────────────────────────────────
INSERT INTO departments (name, slug, description) VALUES
  ('Leadership', 'leadership', 'Executive leadership team'),
  ('Programs', 'programs', 'Program implementation team'),
  ('Finance', 'finance', 'Finance and accounting'),
  ('Communications', 'communications', 'Communications and media'),
  ('Operations', 'operations', 'Operations and administration'),
  ('Board', 'board', 'Board of directors');

-- ─── Auto-create user profile on signup ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Enable Row Level Security ─────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies ──────────────────────────────────────────────────────────────
-- Authenticated users can read all public data
CREATE POLICY "Authenticated users can read all tables"
  ON news FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON gallery FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON members FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON projects FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON events FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON documents FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON volunteers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON donations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON contact_messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON newsletter_subscribers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON media_library FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tables"
  ON settings FOR SELECT TO authenticated USING (true);

-- Public can read published content
CREATE POLICY "Public can read published news"
  ON news FOR SELECT TO anon USING (status = 'published' AND publish_date <= NOW());

CREATE POLICY "Public can read gallery"
  ON gallery FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read albums"
  ON albums FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read active members"
  ON members FOR SELECT TO anon USING (status = 'active');

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read events"
  ON events FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read documents"
  ON documents FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read settings"
  ON settings FOR SELECT TO anon USING (true);