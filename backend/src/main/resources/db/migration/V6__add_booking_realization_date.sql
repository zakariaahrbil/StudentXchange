alter table bookings
    add column realization_at timestamp(6) with time zone;

update bookings
set realization_at = created_at + interval '1 day'
where realization_at is null;

alter table bookings
    alter column realization_at set not null;
