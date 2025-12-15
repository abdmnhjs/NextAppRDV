# 💻 Tech Stack:
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Stripe](https://img.shields.io/badge/Stripe-%23FF4500.svg?style=for-the-badge&logo=Stripe&logoColor=white) ![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)

# ⚙️ Features:

- Search posts by keywords (and the keywords are saved)
- Add posts to favourites
- Resume of the posts by Google Gemini (gemini-2.5-flash)

# 🚀 Getting Started :

### 📦 Prerequisites :
- Node.js (≥ 18)
- npm
- PostgreSQL (≥ 9.5)
- An account for using the Reddit API

### 🏗️ Setup :

1. In your terminal, clone the repo
```bash
git clone https://github.com/abdmnhjs/RDT-Hunter.git
```

2. Move into the project folder
```bash
cd RDT-Hunter
```

3. Create a .env file and add these environment variables :
```bash
# Replace [client-id] and [client-secret] with your own values from your reddit api account
# Replace [username] and [password] with your own PostgreSQL credentials
# Replace [gemini-api-key] by the api key you created in Google AI Studio
# You define the database name when creating the variable
# Example: postgresql://postgres:mypassword@localhost:5432/rdt-hunter-db
DATABASE_URL=postgresql://[username]:[password]@localhost:5432/[database-name]
REDDIT_CLIENT_ID=[client-id]
REDDIT_SECRET=[client-secret]
GEMINI_API_KEY=[gemini-api-key]
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

