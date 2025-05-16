# Onboarding Form App

This is a modern onboarding form built with React, React Hook Form, Yup, and Vite. The app allows users to enter their first name, last name, phone number, and corporation number, with real-time validation and a clean, accessible UI.

# Demo

main page
![image](https://github.com/user-attachments/assets/039993c6-427b-4793-ba05-55a54ded1828)


## Features

- Responsive and accessible onboarding form
- Real-time validation for all fields (including Canadian phone number and 9-digit corporation number)
- Custom validation logic and error messages
- Success message on valid submission
- Error message and simulated 400 response for invalid corporation numbers
- Fully tested with Jest and React Testing Library

## Getting Started

### Install dependencies

```sh
npm install
```

### Run the app in development mode

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

### Run tests

```sh
npm test
```

## Usage

Fill out the onboarding form with your information. All fields are required and validated in real time.

### Example: Test the form with this data to see a 200 response

```
{
  "firstName": "Hello",
  "lastName": "World",
  "corporationNumber": "826417395",
  "phone": "+13062776103"
}
```

- Enter the above values in the form fields and submit.
- You will see a success message indicating the form was submitted successfully (simulating a 200 response).

### Example: Test the form with a bad corporation number to see a 400 response

```
{
  "firstName": "Hello",
  "lastName": "World",
  "corporationNumber": "123456789",
  "phone": "+13062776103"
}
```

- Enter the above values in the form fields and submit.
- You will see an error message indicating the corporation number is invalid.
- The simulated response will be:

```
{
  "valid": false,
  "message": "Invalid corporation number"
}
```

## Technologies Used

- React 18
- React Hook Form
- Yup
- Vite
- Jest & React Testing Library
