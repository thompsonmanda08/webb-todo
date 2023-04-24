# WEBB-TODO
### Next-Gen Todo App

This app prototype is built with the [T3 Stack](https://create.t3.gg/) 

#### The following are the technologies used in this project. Please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## WEBB-TODO - THE ULTIMATE TODO APP | Just for Laughs 😂 
![WEBB-TODO LANDING PAGE](/public/screenshot.png)

## Cloning the Repository

1. Open a terminal window and navigate to the directory where you want to clone the repository then 
copy and paste the following command into your terminal: `git clone https://github.com/thompsonmanda08/webb-todo.git`

## Installing Dependencies
1. Navigate to the cloned repository directory in the terminal.

2. Type `npm install` and press Enter to install the required dependencies listed in the ***package.json*** file.
Wait for the installation to complete.

## Setting Environment Variables
1. In the root directory of the cloned repository, create a new file named .env *(Note: The dot at the beginning of the filename is important).*

2. Open the ***.env file*** in a text editor.

3. Copy the contents of the **.env.example file** (if it exists) into the **.env file.** to propergate the .env file with the actual values for your environment. These may include database connection strings, API keys, and other sensitive information.
***Be sure to save the file after making changes.***

## Syncing with the Local Database File
1. for demo purposes, I would suggest using a database served on your local machine, SQLite is the best for small-medium sized applications. There is a **db.sqlite** file with in the prisma folder and that is where you can connect to, if for some reason it does not exist, make sure to create one.

2. The DATABASE_URL environment variable should be pointing to the file path of the SQLite database file i.e. `DATABASE_URL="file:./db.sqlite"`

3. Type `npx prisma migrate dev` or `npx prisma migrate dev --name [nameOfMigration]` in the terminal and press Enter to apply any pending database migrations.
4. Wait for the migration to complete.


## Running the App

1. Type `npm run dev` in the terminal and press Enter to start the development server.

2. Wait for the server to start and for the app to compile.

3. Open a web browser and/or navigate to http://localhost:3000 to view the app.

4 *Congratulations!:* You should now be able to use the Todo App on your local machine but you may need to sign up first. Dont worry that database is yours and is on your local machine, all your accounts are safe!😎
