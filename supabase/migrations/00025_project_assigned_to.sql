-- Add assigned_to column to projects (employee responsible for this production)
ALTER TABLE public.projects
  ADD COLUMN assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index for employee lookups
CREATE INDEX idx_projects_assigned_to ON public.projects(assigned_to);

-- Update employee RLS: can also see projects directly assigned to them
DROP POLICY IF EXISTS "employees_select_projects_with_tasks" ON public.projects;

CREATE POLICY "employees_select_projects_with_tasks" ON public.projects
  FOR SELECT TO authenticated
  USING (
    (
      EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.project_id = projects.id
        AND tasks.assigned_to = auth.uid()
      )
      OR projects.assigned_to = auth.uid()
    )
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );

-- Also allow employees to see deliverables for projects assigned to them
DROP POLICY IF EXISTS "employees_select_deliverables" ON public.deliverables;

CREATE POLICY "employees_select_deliverables" ON public.deliverables
  FOR SELECT TO authenticated
  USING (
    (
      EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.project_id = deliverables.project_id
        AND tasks.assigned_to = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = deliverables.project_id
        AND projects.assigned_to = auth.uid()
      )
    )
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );

-- Same for employee deliverable inserts
DROP POLICY IF EXISTS "employees_insert_deliverables" ON public.deliverables;

CREATE POLICY "employees_insert_deliverables" ON public.deliverables
  FOR INSERT TO authenticated
  WITH CHECK (
    (
      EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.project_id = deliverables.project_id
        AND tasks.assigned_to = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = deliverables.project_id
        AND projects.assigned_to = auth.uid()
      )
    )
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'employee')
  );
