![alt text](./redis-node.jpg)

[![Build Status](https://travis-ci.org/wooltar/microservices-node-redis.svg?branch=master)](https://travis-ci.org/wooltar/microservices-node-redis)
![npm](https://img.shields.io/npm/v/npm.svg)
# BookShop Microservices

Nodejs application with microservices ARQ. Using Redis to allow the comunication between microservices. 
When a customer make a order, the stock is updated and the customer balance is updated too, substract book price from customer balance. If customer hasn't enought money, return a error

## Books

Microservice to handle shop books, runs in 5544 port

### Get all books

GET http://localhost:5544/books


### Get a book

GET http://localhost:5544/books/:id'


### Create a new book

POST http://localhost:5544/books/create


### Update a book

POST http://localhost:5544/books/update


### Delete a book

DELETE http://localhost:5544/books/:id


## Customers

Microservice to handler shop customers, runs in 6666 port

### Get all customer

GET http://localhost:6666/customers


### Get a customer

GET http://localhost:6666/customers/:id'


### Create a new customer

POST http://localhost:6666/customers/create


### Update a customer

POST http://localhost:6666/customers/update


### Delete a customer

DELETE http://localhost:6666/customers/:id


## Orders

Microservice to handler shop orders, runs in 7777 port

### Get all orders

GET http://localhost:7777/orders


### Get a order

GET http://localhost:7777/orders/:id'


### Create a new order

POST http://localhost:7777/orders/create


### Update a order

POST http://localhost:7777/orders/update


### Delete a order

DELETE http://localhost:7777/orders/:id