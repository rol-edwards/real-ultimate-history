create roles here

create database history;


use history;

create table people (
	id serial PRIMARY KEY,
	name varchar (128) NOT NULL,
	DOB integer NOT NULL,
	DOD integer NOT NULL,
	Bio text NOT NULL,
	nation varchar (128) NOT NULL,
	role varchar (128) NOT NULL
	)
	
create table events  (
	id  serial NOT NULL,
	name varchar (128) NOT NULL,
	date int NOT NULL,
	description varchar (128) NOT NULL,
	location varchar (128) NOT NULL
)
	

create table people_events  (
	id serial NOT NULL PRIMARY KEY,
	person_id int NOT NULL,
	event_id int NOT NULL,
	role varchar (128) NOT NULL
)
foreign key  (person_id) references people (id),
foreign key  (event_id) references event (id)

create table users  (
	id serial NOT NULL PRIMARY KEY,
	username varchar (128) NOT NULL,
	password varchar (128) NOT NULL,
	loginAttempts int  NOT NULL

)

