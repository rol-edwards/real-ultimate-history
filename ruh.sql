create roles here

create database history;



use history;

create table people(
	id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(128) NOT NULL,
	DOB int(11) NOT NULL,
	DOD int(11) NOT NULL,
	Bio varchar(128) NOT NULL,
	nation varchar(128) NOT NULL,
	role varchar(128) NOT NULL;
	)
	
create table events (
	id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(128) NOT NULL,
	date int(11) NOT NULL,
	description varchar(128) NOT NULL;
	)
	

create table people_events (
	id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	person_id,
	event_id,
	role varchar(128) NOT NULL;
)
foreign key (person_id) references people(id),
foreign key (event_id) references event(id)

create table users (
	id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username varchar(128) NOT NULL,
	password varchar(128) NOT NULL,
	loginAttempts int(11) NOT NULL;

)

