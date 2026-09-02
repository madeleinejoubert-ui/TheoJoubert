-- Starter service packages (edit names and pricing in the dashboard)
insert into public.services (name, description, price_monthly, sort_order) values
  ('Starter — Social Presence', '2 platforms, 8 posts per month, scheduled and monitored in Metricool, monthly performance summary.', 295, 1),
  ('Growth — Content & Community', '3 platforms, 16 posts per month including Reels/short video, community management, monthly Metricool analytics report and strategy call.', 595, 2),
  ('Premium — Full Social Management', 'Up to 5 platforms, 30+ posts per month, content strategy, paid boost management, competitor benchmarking, fortnightly reporting.', 995, 3);

insert into public.services (name, description, price_oneoff, sort_order) values
  ('Social Media Audit & Strategy', 'One-off audit of existing channels with a 90-day content strategy, benchmarks and Metricool setup.', 450, 4);
