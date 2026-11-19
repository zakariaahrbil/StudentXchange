alter table skills
    add column description text;

create table reviews (
    id uuid not null,
    booking_id uuid not null unique,
    skill_id uuid not null,
    reviewer_id uuid not null,
    rating integer not null check (rating between 1 and 5),
    comment text not null,
    created_at timestamp(6) with time zone not null,
    primary key (id),
    constraint reviews_booking_fk foreign key (booking_id) references bookings,
    constraint reviews_skill_fk foreign key (skill_id) references skills,
    constraint reviews_reviewer_fk foreign key (reviewer_id) references users
);

create index reviews_skill_idx on reviews (skill_id);
