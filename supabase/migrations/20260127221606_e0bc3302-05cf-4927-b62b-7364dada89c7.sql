-- Enable realtime for manager_notifications table
ALTER TABLE public.manager_notifications REPLICA IDENTITY FULL;

-- Ensure the table is in the realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.manager_notifications;

-- Enable realtime for directorate_notifications table
ALTER TABLE public.directorate_notifications REPLICA IDENTITY FULL;

-- Ensure the table is in the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.directorate_notifications;