
-- Fix 1: financial_transactions - Drop broken anon policy, add proper authenticated policies
DROP POLICY IF EXISTS "Unified anon transaction access" ON public.financial_transactions;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
ON public.financial_transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Staff and admins can view all transactions
CREATE POLICY "Staff and admins can view all transactions"
ON public.financial_transactions
FOR SELECT
TO authenticated
USING (
  is_admin_or_super_admin_user()
  OR is_revenue_staff_user()
  OR is_registry_staff_user()
  OR is_compliance_staff_user()
  OR is_managing_director()
);

-- Users can insert own transactions
CREATE POLICY "Users can insert own transactions"
ON public.financial_transactions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Revenue staff and admins can insert any transaction
CREATE POLICY "Revenue staff can insert transactions"
ON public.financial_transactions
FOR INSERT
TO authenticated
WITH CHECK (is_revenue_staff_user() OR is_admin_or_super_admin_user());

-- Revenue staff and admins can update transactions
CREATE POLICY "Revenue staff can update transactions"
ON public.financial_transactions
FOR UPDATE
TO authenticated
USING (is_revenue_staff_user() OR is_admin_or_super_admin_user());

-- Fix 2: invoices - Drop broken anon policy (authenticated policies already exist)
DROP POLICY IF EXISTS "Unified anon invoice access" ON public.invoices;
