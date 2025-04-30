Here’s a professional, attractive, and easy-to-follow README.md file for your Student Course Platform project using Spring Boot (backend), React (frontend), and MongoDB (database):

📘 README.md

# 🧑‍🎓 Student Course Platform

A full-stack web application where students can browse and purchase courses using an integrated shopping cart and Stripe payment system. The platform includes an admin panel for managing courses and coupons, plus discount support and search functionality.

🚀 Tech Stack

| Layer     | Technology                |
|-----------|----------------------------|
| Frontend  | ReactJS, Axios, Stripe.js |
| Backend   | Spring Boot, Java, Stripe SDK |
| Database  | MongoDB (NoSQL)           |
| Auth      | OAuth2 (Google Ready)     |
| Payment   | Stripe (Test Mode)        |

🌟 Features

- 🔍 Browse and search courses
- 🛒 Add to Cart + Stripe Checkout
- 🎟 Apply Discount Coupons
- 👨‍🏫 Admin Panel (Add/Delete Courses & Coupons)
- 💳 Secure Stripe Test Payments
- 🧠 Built with Spring Boot & MongoDB

📁 Project Structure

```
student-course-platform/
├── backend/          # Spring Boot backend (MongoDB + REST APIs)
├── frontend/         # React frontend (UI + payment + admin)
└── README.md         # Setup and usage instructions
```

🧑‍💻 Prerequisites

Make sure you have the following installed:

- Java 17+
- Node.js & npm (v16 or later)
- Maven (included via mvnw)
- MongoDB (running locally on default port)
- Stripe Test Account (for payment)

🛠️ Backend Setup (Spring Boot + MongoDB)

1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create an .env file or update application.properties with:
   ```
   spring.data.mongodb.uri=mongodb://localhost:27017/student-course
   stripe.api.key=your_stripe_secret_key
   ```

3. Start the backend server:
   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend will run on:
   ```
   http://localhost:8080
   ```

📦 Frontend Setup (React)

1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Set your Stripe public key in src/components/Checkout.js:
   ```js
   const stripePromise = loadStripe('your_stripe_publishable_key');
   ```

4. Start the frontend server:
   ```bash
   npm start
   ```

5. The React app will open at:
   ```
   http://localhost:3000
   ```

🧪 Test Stripe Payment

Use this test card at checkout:

| Field        | Value                  |
|--------------|------------------------|
| Card Number  | 4242 4242 4242 4242    |
| Expiry Date  | Any future date (e.g. 12/30) |
| CVC          | Any 3 digits (e.g. 123) |
| ZIP          | Any 5 digits (e.g. 12345) |

🛡️ Admin Panel Access

- Navigate to:
  ```
  http://localhost:3000/admin
  ```
- Create new courses
- Add or delete coupon codes

💡 Coupons

- Supported coupons:
  - SAVE10 → 10% discount
  - SAVE20 → 20% discount

🧰 Common Errors

| Error                 | Solution                                                  |
|----------------------|-----------------------------------------------------------|
| Network Error         | Check if backend is running and accessible               |
| MongoDB connection    | Make sure MongoDB is running on localhost:27017          |
| Stripe errors         | Verify your API keys in frontend and backend             |
| CORS errors           | Use @CrossOrigin or global CORS config in backend        |

🧼 Cleanup

To stop servers:

- Backend: Ctrl + C
- Frontend: Ctrl + C
- MongoDB: Stop MongoDB service

📷 Screenshots (optional)

You can include some screenshots of:

- Home page
- Cart page
- Checkout page
- Admin panel

---

Made with ❤️ for student learning, feedback, and real-world experience.