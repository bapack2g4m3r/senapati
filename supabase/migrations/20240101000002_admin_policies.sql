-- (Policy "Admins can view all users." dihapus karena menyebabkan infinite recursion 
-- dan public.users sudah bisa di-SELECT oleh semua orang melalui policy "Public profiles are viewable by everyone.")


-- Allow admins to view all members
CREATE POLICY "Admins can view all members." ON public.members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users AS u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Allow admins to update all members
CREATE POLICY "Admins can update all members." ON public.members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users AS u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Allow admins to delete all members
CREATE POLICY "Admins can delete all members." ON public.members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users AS u WHERE u.id = auth.uid() AND u.role = 'admin')
);
