-- Table for logging caselaw searches (Sprint-1)
create table if not exists caselaw_searches (
    id uuid primary key default gen_random_uuid(),
    user_id text not null,
    query text not null,
    search_type text not null,
    timestamp timestamptz not null default now(),
    results_count int not null,
    execution_time_ms float not null
);
