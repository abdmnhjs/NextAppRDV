# 💻 Tech Stack:
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Stripe](https://img.shields.io/badge/Stripe-5469d4?style=for-the-badge&logo=stripe&logoColor=ffffff) 

# ⚙️ Features:

- Create appointments (for free or not) if you are a consultant
- Book appointments if you are a client, by buying it or not

# 🚀 Getting Started :

### 📦 Prerequisites :
- Node.js (≥ 18)
- npm
- PostgreSQL (≥ 9.5)
- A Stripe account

### 🏗️ Setup :

1. In your terminal, clone the repo
```bash
git clone https://github.com/abdmnhjs/NextAppRDV.git
```

2. Move into the project folder
```bash
cd NextAppRDV
```

3. Create a .env file and add these environment variables :
```bash
# Replace [stripe-secret-key] by your Stripe secret key in the sandbox, it must begin by sk_test, do not use the key for real transactions but only for testing please
# Replace [username] and [password] with your own PostgreSQL credentials
# You define the database name when creating the variable
# Example: postgresql://postgres:mypassword@localhost:5432/next-app-rdv-db
DATABASE_URL=postgresql://[username]:[password]@localhost:5432/[database-name]
STRIPE_SECRET_KEY=[stripe-secret-key]
```

4. Install the dependencies
```bash
npm i
```

5. Generate the prisma client
```bash
npx prisma generate
```

6. Apply the migrations (this will create the tables in your database according to the Prisma schema)
```bash
npx prisma migrate dev
```

7. Run the web server
```bash
npm run dev
```

