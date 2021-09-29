# Income and Expense Tracker App

## Tech
- Adonis
- Vue
- Vue Bootstrap

## Run The Server
```sh
cd expense_tracker/server
npm install
```
#### Change Database configuration in "env.ts" file  

```sh
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB_NAME=<your database name>
```
#### Then Migrate and serve the server
 
```
node ace migrate
npm run dev
```

## Run The Client
```sh
cd expense_tracker/client
npm install
npm run serve
```
#### You can change the baseURL going to this file "expense_tracker/client/src/services/http.js"
