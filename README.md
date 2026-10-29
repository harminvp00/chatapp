## ChatApp usign MERN

I am Harmin Vekariya building this chat application as hobby to understand socket connetions and security in productions, Ill used to deploy and test to understand critical issues which can occur in a chat application made from NodeJS, I

### Tech Stack
**Frontend:**
- **ReactJS** is frontend library
- **Vite** is next gen high performance frontend build tool
- **Tailwind** CSS is framework of CSS

**Backend:**
- **NodeJS** a JavaScript runtime environment
- **ExpressJS** a server framework (to build APIs)
- **Socket.IO** is websocket library for this application, which enable socket communication between the two clients

**Database:**
- **PostgreSQL** is my primary database in this project because the data used in this project is relational, so its bettter to use a relational database management system, 
- **PrismaORM** (v6) is used like a bridge between the Postgres and NodeJS, because JavaScript mostly like to deal within Objects and that what prisma do, it's convert the relation data to objects amd allow to do operation on them.

**Predicted Addition for the future in this Project:**
1. **Machiene Learning (Logistic Regression)** will be used in this project for classify the spam messages, alerting user about unusual messages,
2. **NLP (Natural Language Processing):** a chatbot will used for communicate with user, in most cases is usecase will inform the new features, event, and guide users in software for thier technical issues.
3. **Computer Vision**: will be used to scan uploaded image on the chatapp, that classify appropriate content vs non-appropriate content, (non-appropriate refer to the adult content here)

### Current Database Structure (v2)
- **user** (id, email, hash_pass etc)
    - profile (username, dob etc)
    - users_otp (otp code, expire time etc)
    - oauth_accounts (provider, provider id, etc)
    - avatars (id, file name, path etc)
    - sessions (id, validity, expiry etc)

all relations are linked within the users relation (user_id field).


### Current Features
1. Email/Password based account creation, login and authentications
2. refresh token (Crypto) + access token (JWT) authentication architecture
3. Google Oauth Integration for direct Google Login (Currenlty No PKCE)
4. Sample Dashboard, Profile Page for User

### Developer contact
to contribute: vekariyaharmin96@gmail.com