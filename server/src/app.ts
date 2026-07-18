// Express app — middleware + routes only, NO app.listen here.
// Separating app from server lets tests import the app without opening a port.
// TODO (you): create express(), add cors({ origin: env.CLIENT_URL }),
// express.json(), mount auth routes at /api/auth, add a GET /api/health
// route, and mount error.middleware LAST. Export the app.

export {}
