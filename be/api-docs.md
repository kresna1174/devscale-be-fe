# API Documentation

## Base URL

```
http://localhost:8081
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": <response_data>
}
```

Error responses:

```json
{
  "error": "<error_message>"
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**

```json
{
  "email": "string",
  "password": "string" // minimum 6 characters
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "name": "string|null",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Errors:**

- `400 Bad Request` - Email already exists

---

### Login User

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string" // minimum 6 characters
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string|null"
    }
  }
}
```

**Errors:**

- `401 Unauthorized` - Invalid credentials

---

## Product Endpoints

_All product endpoints require authentication_

### Create Product

**POST** `/products/`

Create a new product.

**Request Body:**

```json
{
  "productName": "string",
  "qty": "integer",
  "price": "integer"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "productName": "string",
    "qty": "integer",
    "price": "integer"
  }
}
```

**Errors:**

- `400 Bad Request` - Failed to create product

---

### Update Product

**PUT** `/products/:id`

Update an existing product.

**URL Parameters:**

- `id` (string) - Product UUID

**Request Body:**

```json
{
  "productName": "string",
  "qty": "integer",
  "price": "integer"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "productName": "string",
    "qty": "integer",
    "price": "integer"
  }
}
```

**Errors:**

- `400 Bad Request` - Failed to update product

---

### Get All Products

**GET** `/products/`

Retrieve all products.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "productName": "string",
      "qty": "integer",
      "price": "integer"
    }
  ]
}
```

**Errors:**

- `400 Bad Request` - Failed to get products

---

### Get Product by ID

**GET** `/products/:id`

Retrieve a specific product by ID.

**URL Parameters:**

- `id` (string) - Product UUID

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "productName": "string",
    "qty": "integer",
    "price": "integer"
  }
}
```

**Errors:**

- `400 Bad Request` - Failed to get product

---

### Delete Product

**DELETE** `/products/:id`

Delete a product by ID.

**URL Parameters:**

- `id` (string) - Product UUID

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "productName": "string",
    "qty": "integer",
    "price": "integer"
  }
}
```

**Errors:**

- `400 Bad Request` - Failed to delete product

---

## Invoice Endpoints

_All invoice endpoints require authentication_

### Create Invoice

**POST** `/invoice/`

Create a new invoice with invoice details.

**Request Body:**

```json
{
  "date": "date", // ISO date string, will be coerced to Date
  "total": "float",
  "userId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "qty": "positive_integer",
      "total": "non_negative_integer"
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "datetime",
    "total": "float",
    "userId": "uuid",
    "invoiceDetail": [
      {
        "id": "uuid",
        "productId": "uuid",
        "invoiceId": "uuid",
        "qty": "integer",
        "total": "integer"
      }
    ]
  }
}
```

**Errors:**

- `400 Bad Request` - Failed to create invoice

---

### Update Invoice

**PUT** `/invoice/:id`

Update an existing invoice.

**URL Parameters:**

- `id` (string) - Invoice UUID

**Request Body:**

```json
{
  "date": "date", // ISO date string, will be coerced to Date
  "total": "float",
  "userId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "qty": "positive_integer",
      "total": "non_negative_integer"
    }
  ]
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "datetime",
    "total": "float",
    "userId": "uuid",
    "invoiceDetail": [
      {
        "id": "uuid",
        "productId": "uuid",
        "invoiceId": "uuid",
        "qty": "integer",
        "total": "integer"
      }
    ]
  }
}
```

**Errors:**

- `400 Bad Request` - Failed to update invoice

---

### Get All Invoices

**GET** `/invoice/`

Retrieve all invoices.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "date": "datetime",
      "total": "float",
      "userId": "uuid",
      "user": {
        "id": "uuid",
        "email": "string",
        "name": "string|null"
      },
      "invoiceDetail": [
        {
          "id": "uuid",
          "productId": "uuid",
          "qty": "integer",
          "total": "integer",
          "product": {
            "id": "uuid",
            "productName": "string",
            "qty": "integer",
            "price": "integer"
          }
        }
      ]
    }
  ]
}
```

**Errors:**

- `400 Bad Request` - Failed to get invoices

---

### Get Invoice by ID

**GET** `/invoice/:id`

Retrieve a specific invoice by ID.

**URL Parameters:**

- `id` (string) - Invoice UUID

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "datetime",
    "total": "float",
    "userId": "uuid",
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string|null"
    },
    "invoiceDetail": [
      {
        "id": "uuid",
        "productId": "uuid",
        "qty": "integer",
        "total": "integer",
        "product": {
          "id": "uuid",
          "productName": "string",
          "qty": "integer",
          "price": "integer"
        }
      }
    ]
  }
}
```

**Errors:**

- `400 Bad Request` - Failed to get invoice

---

### Delete Invoice

**DELETE** `/invoice/:id`

Delete an invoice by ID. This will also delete all associated invoice details due to cascade delete.

**URL Parameters:**

- `id` (string) - Invoice UUID

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "datetime",
    "total": "float",
    "userId": "uuid"
  }
}
```

**Errors:**

- `400 Bad Request` - Failed to delete invoice

---

## Data Models

### User

```json
{
  "id": "uuid",
  "email": "string (unique)",
  "password": "string",
  "name": "string|null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Product

```json
{
  "id": "uuid",
  "productName": "string",
  "qty": "integer",
  "price": "integer"
}
```

### Invoice

```json
{
  "id": "uuid",
  "date": "datetime",
  "total": "float",
  "userId": "uuid"
}
```

### InvoiceDetail

```json
{
  "id": "uuid",
  "productId": "uuid",
  "invoiceId": "uuid",
  "qty": "integer",
  "total": "integer"
}
```

---

## Error Handling

The API uses standard HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data or validation error
- `401 Unauthorized` - Authentication required or invalid credentials
- `500 Internal Server Error` - Server error

All error responses include a descriptive error message in the response body.

---

## Notes

1. All UUIDs are generated automatically by the server
2. Timestamps are automatically managed by the database
3. Invoice deletion cascades to invoice details
4. User deletion cascades to invoices and their details
5. The API uses Zod for request validation
6. JWT tokens are required for all protected endpoints
