create or replace function public.cleanup_stale_players(
  p_game_id uuid,
  p_cutoff_seconds integer default 60
)
returns integer
language plpgsql
security definer
as $$
declare
  v_deleted integer := 0;
begin
  delete from public.game_players gp
  where gp.game_id = p_game_id
    and coalesce(gp.last_seen_at, gp.joined_at) < now() - make_interval(secs => p_cutoff_seconds);

  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

