# Gold Dashboard: Project Technical Documentation

## 1. Project Overview
The **Gold Dashboard** is a premium, real-time investment tracking platform designed for gold and precious metal investors. It provides a centralized interface to monitor global market prices, manage investment portfolios, calculate potential returns, and set price alerts.

### Key Objectives
*   **Real-time Monitoring**: Track spot prices of Gold, Silver, and Platinum.
*   **Portfolio Management**: Log and analyze physical gold holdings.
*   **Market Analytics**: Visualize historical trends and daily fluctuations.
*   **Alerting System**: Notify users when prices hit specific targets.

---

## 2. Technology Stack
The project follows a modern **MERN** (MongoDB, Express, React, Node) architecture optimized for performance and aesthetics.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | High-performance UI rendering and development. |
| **Styling** | Tailwind CSS 4 | Modern, utility-first CSS for a premium dark-mode aesthetic. |
| **State Management** | React Query | Server-state management, caching, and background synchronization. |
| **Charts** | Recharts | Interactive SVG-based data visualization. |
| **Backend** | Node.js + Express | Scalable RESTful API development. |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL database for user and portfolio data. |
| **Authentication** | JSON Web Tokens (JWT) | Secure, stateless session management. |

---

## 3. Frontend Architecture & Components

### Layout System
The application uses a responsive sidebar-based layout (`Layout.jsx`) that ensures a consistent experience across mobile and desktop.

### Core Pages
1.  **Dashboard (`Dashboard.jsx`)**:
    -   Displays live price cards for major metals.
    -   Features the `GoldChart` for trend analysis.
    -   Shows a high-level `PortfolioOverview`.
2.  **Portfolio (`Portfolio.jsx`)**:
    -   The CRUD (Create, Read, Update, Delete) engine for assets.
    -   Allows users to add holdings with details like weight, purity (Karat), and purchase price.
    -   Calculates **Current Value** vs. **Investment Cost** to show Profit/Loss.
3.  **Market Insights (`News.jsx`)**:
    -   Aggregates financial news related to commodities and inflation.
4.  **Calculator (`Calculator.jsx`)**:
    -   A specialized tool to estimate gold value based on current spot prices and custom purity levels.
5.  **Alerts (`Alerts.jsx`)**:
    -   Interface for creating price triggers (e.g., "Notify me if gold drops below ₹70,000").

---

## 4. Backend & Database Handling

### RESTful API Structure
The backend is modularized into specialized routes:
*   `/api/auth`: Handles user registration and login with password hashing (Bcrypt).
*   `/api/market`: Manages external API calls to `MetalpriceAPI` and provides cached price data.
*   `/api/portfolio`: Manages user holdings in the MongoDB collection.
*   `/api/alerts`: Stores and retrieves user-specific price notifications.

### Database Schema (Mongoose Models)
*   **User**: Stores credentials and profile settings.
*   **PortfolioItem**: Tracks `userId`, `metalType`, `weight`, `purity`, and `purchasePrice`.
*   **Alert**: Tracks `userId`, `targetPrice`, and `condition` (Above/Below).

### Security Features
*   **JWT Middleware**: Protects private routes by verifying tokens in the `Authorization` header.
*   **Rate Limiting**: Prevents brute-force attacks and API abuse using `express-rate-limit`.
*   **Bcrypt Hashing**: Ensures user passwords are never stored in plain text.

---

## 5. Core Algorithms & Logic

### A. Market Data Normalization
The system fetches global data in **USD per Ounce** but presents it in **INR per 10 grams** (the Indian market standard).
**Algorithm:**
1.  Fetch `USDXAU` (Gold price in USD/Ounce).
2.  Convert Ounce to 10 Grams: `PricePerOunce * (10 / 31.1035)`.
3.  Apply Exchange Rate: `Result * USD_TO_INR`.

### B. Portfolio Valuation
The total portfolio value is calculated dynamically:
`Current Value = (Total Grams * (Purity/24)) * Current Spot Price`.
This allows the system to accurately value 18k, 22k, and 24k gold holdings.

### C. Intelligent Caching
To minimize external API costs and stay within rate limits, the backend uses `node-cache`:
*   Market prices are cached for **5 minutes**.
*   Subsequent requests within that window are served instantly from memory.

---

## 6. Testing & Quality Assurance

### Tools & Techniques
The project uses a multi-layered testing approach:

1.  **Connection Testing (`test_conn.js`)**:
    -   Validates environment variables and network connectivity to MongoDB Atlas.
2.  **Server Integrity (`test_srv.js`)**:
    -   Pings core API endpoints to ensure middleware and routes are operational.
3.  **Database Seeding (`create_user.js` / `check_users.js`)**:
    -   Used to verify authentication flow and data persistence logic manually during development.
4.  **Frontend Linting**:
    -   `ESLint` is configured to maintain code quality and prevent common React pitfalls.
5.  **Manual UI Testing**:
    -   Responsive testing across breakpoints (Mobile, Tablet, Desktop) using Chrome DevTools.

---

## 7. Project Workflow Summary

1.  **Initialization**: User signs up; a unique profile is created in MongoDB.
2.  **Data Fetching**: Frontend requests market data; Backend checks cache; if empty, it calls `MetalpriceAPI`, processes the math, caches it, and returns it.
3.  **Interaction**: User adds a gold coin to their portfolio. The backend stores the entry.
4.  **Real-time Updates**: The dashboard polls the API (via React Query) to update the portfolio's net worth based on the latest market fluctuations.
