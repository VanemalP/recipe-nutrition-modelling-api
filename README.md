# Recipe Nutrition Modelling API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Final Project Assignment for Telerik Academy Aplpha with JavaScript - Design and implement single-page web application that will allow restaurant chefs to create and manage recipes composed of products with known nutrition values. During the interaction with the system users should see changes in nutrition information in real time. Newly created recipes could be tagged with a category from a list.


### User Stories - Project Timeline

- x Authenticate users - Register, Login, Logout
- x Users can CRUD recipes
- x Users can serach list of recipes by name or filter by category or by choosen nutrition value between given boundaries
- x Users can serach for product and filter by product group


### Stack

- Database - MariaDB
- REST API - NestJS

----------

# Getting started

## Installation

Clone the repository

    git clone https://gitlab.com/recipe-nutrition-calculator/api.git

Switch to the repo folder

    cd api
    
Install dependencies
    
    npm install

----------

## Database

### MariaDB

The example codebase uses [Typeorm](http://typeorm.io/) with a MariaDB database.

Create a new MariaDB database with the name `recipes_db` (or the name you specified in the ormconfig.json)

MariaDb database settings are in ormconfig.json

Start local MariaDB server and create new database 'recipes_db'

----------

## NPM scripts

- `npm start` - Start application
- `npm run start:dev` - Start application in nodemon
- `npm run typeorm` - run Typeorm commands
- `npm run seed` - initial seed for the database
- `npm run test` - run Jest test runner 
- `npm run compodoc` - run Compodoc to see full documentation of the app 

----------
