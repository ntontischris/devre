-- Migration: CRM Lead Pipeline

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  source TEXT NOT NULL DEFAULT 'other' CHECK (source IN ('referral', 'website', 'social_media', 'cold_call', 'event', 'advertisement', 'other')),
  stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  deal_value NUMERIC(12,2),
  probability INTEGER NOT NULL DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  notes TEXT,
  assigned_to UUID NOT NULL REFERENCES auth.users(id),
  lost_reason TEXT,
  expected_close_date DATE,
  last_contacted_at TIMESTAMPTZ,
  converted_to_client_id UUID REFERENCES clients(id),
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lead activities table
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'stage_change', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_expected_close_date ON leads(expected_close_date);
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_user_id ON lead_activities(user_id);

-- Updated_at trigger for leads
CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads

-- Admins can do everything with leads
CREATE POLICY "admins_all_leads" ON leads
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- Salesmen can CRUD their own leads
CREATE POLICY "salesmen_select_own_leads" ON leads
  FOR SELECT TO authenticated
  USING (
    assigned_to = auth.uid()
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  );

CREATE POLICY "salesmen_insert_leads" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (
    assigned_to = auth.uid()
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  );

CREATE POLICY "salesmen_update_own_leads" ON leads
  FOR UPDATE TO authenticated
  USING (
    assigned_to = auth.uid()
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  )
  WITH CHECK (
    assigned_to = auth.uid()
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  );

CREATE POLICY "salesmen_delete_own_leads" ON leads
  FOR DELETE TO authenticated
  USING (
    assigned_to = auth.uid()
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  );

-- RLS Policies for lead_activities

-- Admins can do everything with lead activities
CREATE POLICY "admins_all_lead_activities" ON lead_activities
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- Salesmen can view and create activities for their own leads
CREATE POLICY "salesmen_select_lead_activities" ON lead_activities
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND leads.assigned_to = auth.uid()
    )
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  );

CREATE POLICY "salesmen_insert_lead_activities" ON lead_activities
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND leads.assigned_to = auth.uid()
    )
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'salesman')
  );
