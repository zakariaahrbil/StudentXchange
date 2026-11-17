alter table skills drop constraint if exists skills_name_key;
alter table skills add column if not exists owner_id uuid;
alter table skills add constraint skills_owner_fk foreign key (owner_id) references users;
create unique index if not exists skills_owner_name_unique
    on skills (owner_id, lower(name));
