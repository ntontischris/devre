-- Migration: DMS University (Knowledge Base)

-- Knowledge Base Categories
CREATE TABLE kb_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  parent_id UUID REFERENCES kb_categories(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Knowledge Base Articles
CREATE TABLE kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES kb_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  summary TEXT,
  video_urls JSONB NOT NULL DEFAULT '[]',
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full-text search index on title + content
CREATE INDEX idx_kb_articles_fts ON kb_articles
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));

CREATE INDEX idx_kb_articles_category_id ON kb_articles(category_id);
CREATE INDEX idx_kb_articles_published ON kb_articles(published);
CREATE INDEX idx_kb_categories_slug ON kb_categories(slug);
CREATE INDEX idx_kb_articles_slug ON kb_articles(slug);

-- Updated_at triggers
CREATE TRIGGER set_kb_categories_updated_at
  BEFORE UPDATE ON kb_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_kb_articles_updated_at
  BEFORE UPDATE ON kb_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE kb_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;

-- RLS: Admins full CRUD on kb_categories
CREATE POLICY "admins_all_kb_categories" ON kb_categories
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- RLS: Employees can SELECT kb_categories
CREATE POLICY "employees_select_kb_categories" ON kb_categories
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );

-- RLS: Admins full CRUD on kb_articles
CREATE POLICY "admins_all_kb_articles" ON kb_articles
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- RLS: Employees can SELECT published articles only
CREATE POLICY "employees_select_published_articles" ON kb_articles
  FOR SELECT TO authenticated
  USING (
    published = true
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );
