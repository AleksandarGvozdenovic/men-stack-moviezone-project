# 🎬 Movie Zone (MEN Stack)
Small cinema ticketing app built with **MongoDB + Express + Node** and **EJS** views.  
It supports authentication, roles (admin/user), movie catalog with images, search & filters, session cart, and simple checkout (orders).

## https://movie-zone-ticketing-app-ca4708383899.herokuapp.com/

## ✨ Features

- Users: register / login / logout, flash messages
- Roles: **admin** can create, edit, delete movies
- Movies: title, description, genre, duration, price, poster (upload)
- Search & Filters: by title/description (case-insensitive), genre (aliases), min/max price
- Cart in session: add/remove/update quantity, checkout creates an **Order**
- Orders: snapshot of items (title/price/qty) + total
- Clean MVC (routes → controllers → models), EJS layouts, modern CSS



## 🧱 Tech Stack

- **Node.js**, **Express**, **EJS** (+ `ejs-mate` layout engine)
- **MongoDB** (Mongoose)
- Sessions with **connect-mongo**
- File uploads: **multer**
- Styling: plain CSS (responsive, dark-first)



## 🚀 Stretch Goals (planned)

### 1) Showtimes (date, time, auditorium)
**Goal:** sell tickets per *screening* instead of per movie.

- **Data Model (new):**
- Screening { movie, date (YYYY-MM-DD), time   (HH:mm), auditorium, seatsTotal, seatsAvailable, seatsTaken[] }
- **UI (Details page):**
  - Show a list of upcoming days/times; user must pick a screening before adding to cart.
- **Behavior:**
  - Price/availability is tied to the screening.
  - “Sold Out” appears when `seatsAvailable === 0`.
- **Admin:**
  - CRUD screens for screenings (create batch by date range + times).

### 2) Seat Selection (interactive seat map)
**Goal:** let users choose exact seats.

- **Data Model additions:**
  - `Auditorium { name, rows, cols, layout? }` (optional static layout)
  - `Screening.seatsTaken: [seatLabel]` (e.g., `["B7","B8"]`)
- **UI:**
  - Grid map (e.g., 10×16). Available seats are clickable; taken seats are disabled.
  - Show count and selected labels; add to cart includes `screeningId` + `seats[]`.
- **Concurrency:**
  - On add-to-cart/checkout, re-validate seats are still free.
  - Optional short “seat hold” (expires after N minutes) to reduce race conditions.

### 3) Sold-Out & Availability Logic
**Goal:** prevent overselling and show clear status.

- **Rules:**
  - If `seatsAvailable === 0` → “Sold Out”, disable “Add to Cart”.
  - On checkout, verify seats and capacity again; if something changed, show a friendly error and refresh availability.
- **Badges & UI:**
  - “Few left” when `seatsAvailable <= 5`.
  - “Sold Out” badge on Home grid and Details for that screening.

### 4)Extras
- **Order History:** `/orders` page showing past purchases.
- **Refund/Cancel Window:** allow cancel until X hours before showtime.
- **Dynamic Pricing:** different price by auditorium or showtime (matinee vs. evening).

