# Meeting Scheduler

Meeting scheduler is a meeting room scheduler application designed for employees to schedule appointments for various office spaces and work spaces.

## Features

- Customizable and dynamic appointment calender that prevents schedule conflicts and calculates price  automatically based on various discounts available to clients
- Live updating of customer discount information/outstanding balance
- Allows for click and drag creation of appointments
- Supports calendars for as many rooms as necessary
- Support unique rates for different customers, and automatically refreshes discounts given to customers on a monthly basis

## Tech

This application uses the following technologies:

- [React.js](https://reactjs.org/) - Front-end javascript library for building web applications
- [Webpack](https://webpack.js.org/) - Javascript module bundler
- [React-Bootstrap](https://react-bootstrap.github.io/) - Component library used to create dropdowns
- [DevExtreme-React](https://js.devexpress.com/Documentation/Guide/UI_Components/Scheduler/Getting_Started_with_Scheduler/) - React component library. Specifically used the scheduler component
- [node.js](http://nodejs.org) - Javascript back-end runtime environment
- [Express](http://expressjs.com) - Back end web application framework used to API server
- [PostgreSQL](https://www.postgresql.org/) - SQL based database used to store information
- [AWS EC2](https://aws.amazon.com/ec2/) - Amazon Elastic Cloud Computing platform. Specifically t2 micro used to host database/api server. 

## Installation

Requires node.js installation

Install the node packages needed for this project to run
```
npm install
```
Build the webpack bundle in production mode
```
npm run build
```
For development build change 'production' to 'development' for the 'mode' property in webpack.config.js
```
module.exports = {
 entry: SRC_DIR,
 mode: 'production', ---> 'development'
 ...
```
Run the server on port 3000
```
npm start
```

## Usage Guide 

- Double click any cell to bring up the form modal which allows you to edit the current appointment
- Click and drag from any cell to any later cell, then click the last-selected cell to open up a form modal for the selected region
- In the form modal information about price and discounts used will be displayed along the top
- Click any existing appointment to bring up the appointment tooltip, click the trashcan icon to delete the appointment
- Swapping between rooms opens up the calendar for that room as well as displaying the room information in its respective table
- To change which customer the appointment is being made for use the customer dropdown. This will also display the current customer information in its respective table
