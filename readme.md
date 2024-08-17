# Woovi-Mazing Bank

This project is a simple replica of a bank, implementing core functionalities such as sending and receiving transactions, managing account balances, and providing a user-friendly interface to interact with these features. The backend is built using Node.js, Koa.js, MongoDB, and GraphQL, while the frontend leverages React and Relay.

Developed as part of the Woovi Challenge. Available at: https://github.com/woovibr/jobs/blob/main/challenges/crud-bank-graphql-relay.md

## Features
- **Missing Features**
  - Since this is a simple replica of a bank, there are some features that are missing, such as:
    - To only be able to send money if the account has enough balance. This can be implemented by adding a simple validation to check the account balance. For now it is possible to have
    a negative balance.
    - If the balance check existed, it would be nice to have a deposit button that would allow the user to deposit money into their account. Maybe creating a mocked credit card operation would be a good idea.
    - To be abble to get a transaction by id, and rendering it in the frontend, with all the details.
- **User Authentication:**
  - **Login:** Secure login functionality for registered users.
  - **Register:** New users can register and create an account.

- **Transactions:**
  - **Send Transaction:** Users can send money to other accounts.
  - **Receive Transaction:** Receive money from other accounts.
  - **View Transactions:** Simple table displaying all transactions related to the user's account.
  
- **Account Management:**
  - **Get Account Info:** View account details, including available balance.
  - **Simple Chart:** Visual representation of account balance over time.

## Stack

### Backend
- **Node.js - 18**
- **Koa.js**
- **MongoDB**
- **GraphQL**

### Frontend - [Check the frontend repo](https://github.com/jvkikuchi/woovi-mazing-bank-web)
- **React**
- **Relay**

### Testing
- **Jest**

## How to Run

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start**
   ```bash
   npm run start
   ```

4. **Run Tests:**
   ```bash
   npm run test
   ```