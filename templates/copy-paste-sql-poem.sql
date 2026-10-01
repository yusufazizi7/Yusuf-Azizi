insert into public.early_access_items (
    content_type,
    content_key,
    storage_path,
    release_at,
    active
)
values (
    'poem',
    'REPLACE-WITH-POEM-ID',
    'poems/REPLACE-WITH-POEM-FILE.html',
    '2026-10-15 00:00:00+08',
    true
)
on conflict (content_type, content_key)
do update set
    storage_path = excluded.storage_path,
    release_at = excluded.release_at,
    active = excluded.active;