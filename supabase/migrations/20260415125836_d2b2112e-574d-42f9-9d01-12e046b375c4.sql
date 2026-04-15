
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own reports"
ON public.reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT
USING (auth.uid() = user_id);
