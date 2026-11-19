create table bookings (
    id uuid not null,
    buyer_id uuid not null,
    skill_id uuid not null,
    skill_owner_id uuid not null,
    price bigint not null,
    status varchar(20) not null check (status in ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
    created_at timestamp(6) with time zone not null,
    updated_at timestamp(6) with time zone not null,
    primary key (id),
    constraint bookings_buyer_fk foreign key (buyer_id) references users,
    constraint bookings_skill_fk foreign key (skill_id) references skills,
    constraint bookings_owner_fk foreign key (skill_owner_id) references users
);

create index bookings_buyer_idx on bookings (buyer_id);
create index bookings_owner_idx on bookings (skill_owner_id);
create index bookings_skill_idx on bookings (skill_id);
