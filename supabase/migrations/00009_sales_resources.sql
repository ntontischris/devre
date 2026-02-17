-- Migration: Sales Resources

-- Sales Resource Categories
CREATE TABLE sales_resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sales Resources
CREATE TABLE sales_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES sales_resource_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sales_resources_category_id ON sales_resources(category_id);

-- Enable RLS
ALTER TABLE sales_resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_resources ENABLE ROW LEVEL SECURITY;

-- RLS: Admins full CRUD on sales_resource_categories
CREATE POLICY "admins_all_sales_resource_categories" ON sales_resource_categories
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- RLS: Salesmen can SELECT sales_resource_categories
CREATE POLICY "salesmen_select_sales_resource_categories" ON sales_resource_categories
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  );

-- RLS: Admins full CRUD on sales_resources
CREATE POLICY "admins_all_sales_resources" ON sales_resources
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- RLS: Salesmen can SELECT sales_resources
CREATE POLICY "salesmen_select_sales_resources" ON sales_resources
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  );

-- Storage bucket for sales resources (run via Supabase dashboard or seed)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('sales-resources', 'sales-resources', false, 52428800, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
