-- Migration: Employee RLS policies

-- Employees can view their assigned tasks
CREATE POLICY "employees_select_own_tasks" ON tasks
  FOR SELECT TO authenticated
  USING (
    assigned_to = auth.uid()
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );

-- Employees can update status on their assigned tasks
CREATE POLICY "employees_update_own_tasks" ON tasks
  FOR UPDATE TO authenticated
  USING (
    assigned_to = auth.uid()
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  )
  WITH CHECK (
    assigned_to = auth.uid()
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );

-- Employees can view projects they have tasks in
CREATE POLICY "employees_select_projects_with_tasks" ON projects
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.project_id = projects.id
      AND tasks.assigned_to = auth.uid()
    )
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );

-- Employees can view deliverables for projects they work on
CREATE POLICY "employees_select_deliverables" ON deliverables
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.project_id = deliverables.project_id
      AND tasks.assigned_to = auth.uid()
    )
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );

-- Employees can insert deliverables for projects they work on
CREATE POLICY "employees_insert_deliverables" ON deliverables
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.project_id = deliverables.project_id
      AND tasks.assigned_to = auth.uid()
    )
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );
