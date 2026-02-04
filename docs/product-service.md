Endpoints

GET /products (public)

GET /products/:id (public)

POST /products (JWT protected)

Security

Requires Authorization: Bearer <token> for POST

Evidence



GET all

GET by ID

POST success

POST fail without token

PostgreSQL table proof