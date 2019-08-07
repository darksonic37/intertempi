# intertempi

Interview assignment for intertempi.

## API

1. Setup credentials in a `.env` file that will automatically be read into Node's `process.env`

```bash
cd api
vim .env
```

```bash
APP_HOST=127.0.0.1
APP_PORT=1337

MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DATABASE=intertempi
```

2. Run MongoDB

```bash
docker run -it --net=host mongo
```

3. Run the Express.js server

```bash
cd api
node app.js
```

4. Run the self-explanatory `test.sh` script to test and explain the API

```bash
cd api
./test.sh
```

## Client

Serve the client application on an HTTP server

```bash
cd client
python -m http.server
```
