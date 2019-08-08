# intertempi

Interview assignment for intertempi.

## Development

1. The development lifecycle is encapsulated in the `development.sh` script which builds Docker images, initializes a Docker Swarm cluster, and deploys the `development.yml` stack of services.

```
./development.sh
```

2. Run the self-explanatory `api/test.sh` script to seed, test and explain the API.

```
cd api/
./test.sh
```

3. Interact with the client web application on `http://127.0.0.1`.

```
xdg-open http://127.0.0.1
```

4. Run the Electron wrapper application.

```bash
cd electron
npm install
npm start
```
