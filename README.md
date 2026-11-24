## ChatApp usign MERN

My name is Harmin Vekariya, I am building the chat app as hobby to understand socket connections and security layer in productions, 

### Directory Structure:
- **client** contains UI part like react code, tailwind, svgs, layouts, design of project user interface.
- **server** this directory is used to handle API calls, communicate with database, security, services and authentication 
- **db** directory refer to database schema, and it updates, the latest file also provided in this directory.
- **excalidraw_charts** contain excalidraw representation of system pipelines, and UI.
- **spam_detection** is part of machine learning, that will be implemented into this project to classify the message between spam (1) and ham (0).

## Tech Stack and Tools

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

### Current Database Structure (v2)
- **user** (id, email, hash_pass etc)
    - **avatars** (id, file name, path etc)
    - **profile** (username, dob etc)
    - **users_otp** (otp code, expire time etc)
    - **oauth_accounts** (provider, provider id, etc)
    - **sessions** (id, validity, expiry etc)
- **conversations** (id, createAt, updateAt)
    - **conversation_members** (id, user_id, convresation_id)
    - **message** (id, convesation_id, sender_id, ciphertext, message_type)
    - **user_keys** (id, user_id, public_key, key_algorithm, key_version)

all relations are linked within the users relation (user_id field).


### Current Features
#### Authentications 
1. Email/Password based account creation, login and authentications
2. Refresh token (Crypto) + access token (JWT) authentication architecture
3. Google Oauth Integration for direct Google Login (Currenlty No PKCE)

#### Chat Service and Dashboards components
4. **Dashboard** with sidebar, chatarea, In sidebar saarch, profile, and logout button are, where under the navbar the friend list appear, if user have no friends then the find friend button appears. chatarea show default screen intially and when user click on any friend the chatscreen show that friends detail on the chatscreen header.
5. Profile page is still simple and show picture, usernane and logout button.


### Developer contact
**Harmin Vekariya** vekariyaharmin96@gmail.com