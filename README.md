# Project to monitor endpoints

##  Prepare database
- Setup database settings inside `ormconfig.json` file
- I used docker like this:

	 1. `docker run --name db -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=a4s5d6 mysql`
	 2. `docker exec -it db mysql -u root -p`
	 3. `create database justTest;`
		>I got ER_NOT_SUPPORTED_AUTH_MODE when running app.
		>You can check auth mode with `SELECT plugin FROM mysql.user WHERE User = 'root';`
		>and change it with `ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'a4s5d6';`

##  Run application
1. Set NODE_ENV `export NODE_ENV=development`
2. Install modules `npm i`
3. Create jwt secret with `echo "JWT_SECRET =supersecret1234" > .env`
4. Run tests `npm test`
5. Start app with `npm start`

##  Routes
### Unportected
- GET ping - return "hello"
- POST auth - needs name in body, returns jwt
> when app starts users Applifting and Batman are created
### Protected
- GET endpoints - gets all endpoits
- GET endpoint/:id - get one endpoint
- POST endpoint - create endpoint, needs name and url in body
- PUT endpoint/:id - update endpoint
- DEL endpoint/:id - delete endpoint
- GET results - gets all results
- GET results/:name - get last 10 results of specified endpoint
- POST result - create result which send http request, needs name of the endpoint
- DEL result/:id - delete result