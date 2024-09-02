# Account Management System

A simple web application for managing bank accounts. This system allows users to create accounts, view account information, deposit and withdraw funds, and transfer money between accounts. The application is built with HTML, CSS, and JavaScript and interacts with a backend API.

## Features

- Create a new account with name, surname, and birthdate.
- Retrieve account information by account ID.
- Deposit money into an account.
- Withdraw money from an account.
- Transfer money between accounts.
- Delete an account if it has no funds.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: API endpoints (assumed to be RESTful)
- **Others**: Fetch API for HTTP requests

## Project Structure

- **index.html**: Main HTML file containing the forms and user interface.
- **styles.css**: Contains CSS styles for the project.
- **index.js**: JavaScript code for handling form submissions and interactions with the API.

### Usage

1. **Create a New Account**:

   - Fill in the "Vardas" (Name), "Pavardė" (Surname), and "Gimimo Data" (Birthdate) fields and click "Sukurti Sąskaitą" (Create Account).

2. **Retrieve Account Information**:

   - Enter the account ID (in the format `name-surname`) in the "Sąskaitos ID" field and click "Gauti Informaciją" (Get Information).

3. **Deposit Money**:

   - Provide the name, surname, and amount to deposit in the respective fields and click "Įnešti Pinigus" (Deposit Money).

4. **Withdraw Money**:

   - Enter the name, surname, and amount to withdraw in the respective fields and click "Išimti Pinigus" (Withdraw Money).

5. **Transfer Money**:

   - Fill in the "Iš Vardas" (From Name), "Iš Pavardė" (From Surname), "Į Vardas" (To Name), "Į Pavardė" (To Surname), and amount fields, then click "Pervesti Pinigus" (Transfer Money).

6. **Delete an Account**:
   - Enter the account ID and click "Ištrinti Sąskaitą" (Delete Account). The account will be deleted only if it has no funds.

### Example API Endpoints

The frontend code assumes the following backend endpoints:

- `POST /api/account`: Create a new account.
- `GET /api/account/{accountId}`: Retrieve account information.
