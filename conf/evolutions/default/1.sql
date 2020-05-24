# --- First database schema

# --- !Ups

set ignorecase true;

create table user (
  id                        varchar2(200),
  login                     varchar2(200),
  password                  varchar2(200),
  constraint pk_user primary key (id))
;

create table company (
  id                        varchar2(200),
  company_name              varchar2(200),
  email_address             varchar2(200),
  phone_number              varchar2(10),
  constraint pk_company primary key (id))
;

create table car(
  id                        varchar2(200),
  model                     varchar2(200),
  brand                     varchar2(200),
  generation                varchar2(200),
  prod_year                 varchar2(200),
  body                      varchar2(200),
  fuel                      varchar2(200),
  mileage                   varchar2(10),
  engine                    varchar2(200),
  gearbox                   varchar2(200),
  color                     varchar2(200),
  price                     bigint,
  company_id                varchar2(200),
  status                    varchar2(6),
  constraint pk_car primary key (id),
  constraint fk_car_company foreign key(company_id) references company(id))
;

# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists user;
drop table if exists company;
drop table if exists car;