Super Booking
===============

## Booking

An application for booking tickets for seats at a specific venue. The seating chart is updated live by the server as seats are reserved or freed up.

The booking branch demonstrates a more "realistic" server push event for updating seats. Additionally it makes use of web sockets to do some wicked-cool real time analytics.

### Setup

Npm and node js are required to run this application. You can get them at http://nodejs.org

* Clone the repo:  ```git clone http://github.com/Ellisande/super-booking```
* Switch to the gold-buying branch:  ```git checkout booking```
* Install the dependencies:  ```npm install```
* Start the server:  ```node server.js```
* View the booking page: http://localhost:5000/
* View the analytics page: http://localhost:5000/#/analytics
