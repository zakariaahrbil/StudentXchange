delete from skills
where owner_id is null;

alter table skills
    alter column owner_id set not null;
