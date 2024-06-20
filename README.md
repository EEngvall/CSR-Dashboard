# CSR Dashboard

![CSR Dashboard](https://raw.githubusercontent.com/EEngvall/CSR-Dashboard/main/public/logo192.png)

A powerful, React-based Customer Service Representative (CSR) Dashboard for managing work orders and cases, integrated with AWS EC2 for backend support.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Future Plans](#future-plans)
- [Contribution](#contribution)
- [License](#license)

## Description

The CSR Dashboard is a web application designed to streamline the management of work orders and cases for customer service representatives. This dashboard leverages AWS EC2 for backend operations, ensuring reliable and scalable performance. It provides an intuitive interface for tracking, updating, and archiving work orders, with integrated address management.

## Features

- **Work Order Management**: Add, edit, and delete work orders easily.
- **Address Management**: Add and edit addresses associated with cases.
- **AWS EC2 Integration**: Utilizes an AWS EC2 instance for backend operations.
- **Responsive Design**: Accessible on both desktop and mobile devices.
- **Real-time Updates**: Ensures data is up-to-date with dynamic state management in React.

## Technologies Used

- **Frontend**:
  - [React](https://reactjs.org/): A JavaScript library for building user interfaces.
  - [React Bootstrap](https://react-bootstrap.github.io/): Bootstrap components built with React.
- **Backend**:
  - [AWS EC2](https://aws.amazon.com/ec2/): Secure and resizable compute capacity in the cloud.
  - [Express](https://expressjs.com/): A minimal and flexible Node.js web application framework.
- **Libraries**:
  - [Axios](https://axios-http.com/): A promise-based HTTP client for the browser and Node.js.
  - [React Router](https://reactrouter.com/): A collection of navigational components for React.
- **Others**:
  - [ESLint](https://eslint.org/): A tool for identifying and reporting on patterns in JavaScript.
  - [Prettier](https://prettier.io/): An opinionated code formatter.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/EEngvall/CSR-Dashboard.git
    cd CSR-Dashboard
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm start
    ```

4. **Navigate to** `http://localhost:3000` to view the application.

## Usage

The CSR Dashboard allows you to:

1. **Add New Cases**: Click on "Add Case" to create a new work order or case.
2. **Manage Addresses**: Use the interface to add or modify addresses associated with each case.
3. **Archive Cases**: Archive old or completed cases using the "Close Case" button.


## Configuration

### AWS Configuration

This project uses an AWS EC2 instance for backend operations. Ensure you have set up the required AWS resources and have the necessary permissions to access them.

1. **AWS EC2**: Configure an EC2 instance to host your backend server.

### Environment Variables

Set up your `.env` file in the root directory to include necessary environment variables:

```env
REACT_APP_API_BASE_URL=https://your-api-gateway-url
AWS_REGION=your-aws-region
```

## Future Plans

### Moving to a Serverless Architecture

- **Serverless Backend**: Transitioning from EC2 to AWS Lambda for backend operations to enhance scalability and reduce operational overhead.
- **Enhanced Case Management**: Improving the case management system to include more detailed tracking and history features.

## Contribution

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


