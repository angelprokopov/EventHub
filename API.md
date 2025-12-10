# 📘 EventHub API Reference

This document describes the public REST API exposed by **EventHub**.

Base URLs:

- Local: `https://localhost:7132`
- Azure: `https://eventhubapi-hehvaravgzcpbdf5.canadacentral-01.azurewebsites.net`

All endpoints are prefixed with `/api`.

---

## 🔐 Authentication

### 🔹 Register

**POST** `/api/auth/register`

Registers a new user and sends a confirmation email.

#### Request body

```json
{
  "displayName": "Angel",
  "email": "user@example.com",
  "password": "P@ssw0rd!"
}
```

#### Responses

- `200 OK` – Registration successful, confirmation email sent  
- `400 Bad Request` – Validation errors or email already in use  

---

### 🔹 Login

**POST** `/api/auth/login`

Authenticates the user and returns a JWT token.

#### Request body

```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd!"
}
```

#### Response

```json
{
  "token": "<jwt-token>",
  "displayName": "Angel",
  "email": "user@example.com"
}
```

- `200 OK` – Login successful  
- `400 Bad Request` – Invalid credentials  

Include the token in all protected requests:

```http
Authorization: Bearer <jwt-token>
```

---

### 🔹 Confirm Email

**GET** `/api/auth/confirm?userId={userId}&token={token}`

Used by the email confirmation link. Confirms a user's email address.

- `200 OK` – Email confirmed  
- `400 Bad Request` – Invalid or expired token  

---

## 📅 Events

### 🔹 Get All Events

**GET** `/api/events`

Returns a list of all events, sorted by start date (newest first).

#### Optional query parameters

- `q` – text search in title / description  
- `location` – filter by location / city  

#### Response

```json
[
  {
    "id": "43ee9126-95e5-460d-a577-12eff4db6d95",
    "title": "Sofia Tech Expo 2025",
    "description": "Tech exhibition with AI, robotics and more.",
    "startAt": "2025-06-14T18:00:00Z",
    "location": "Sofia, Bulgaria",
    "category": "Science",
    "price": 20.0,
    "imageUrl": "https://.../image.jpg",
    "createdBy": "95673a5c-662d-4a57-bfc5-449b4d7d83d2",
    "likesCount": 5
  }
]
```

- `200 OK`

---

### 🔹 Get Event by ID

**GET** `/api/events/{id}`

Path parameters:

- `id` – event ID (GUID)

#### Response

`200 OK` with event object or `404 Not Found` if the event does not exist.

---

### 🔹 Create Event *(Auth required)*

**POST** `/api/events`

Requires a valid JWT token.

#### Headers

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request body

```json
{
  "title": "New Years Eve Celebration",
  "description": "Concert to close 2025 and welcome the new 2026",
  "startAt": "2025-12-31T21:00:00Z",
  "location": "Varna, Bulgaria",
  "category": "Holiday",
  "price": 35.0,
  "imageUrl": "https://.../concert.jpg"
}
```

- `201 Created` – Event created  
- `400 Bad Request` – Validation failed  
- `401 Unauthorized` – Missing/invalid token  

The `createdBy` field is taken from the authenticated user ID and cannot be set from the client.

---

### 🔹 Update Event *(Author only)*

**PUT** `/api/events/{id}`

Only the user who created the event can update it.

#### Headers

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request body

Same shape as create (fields can be updated).

#### Responses

- `204 No Content` – Updated successfully  
- `403 Forbidden` – User is not the author  
- `404 Not Found` – Event not found  

---

### 🔹 Delete Event *(Author only)*

**DELETE** `/api/events/{id}`

Requires JWT token. Only the author can delete the event.

#### Responses

- `204 No Content` – Deleted successfully  
- `403 Forbidden` – Not the author  
- `404 Not Found` – Event not found  

---

## 👍 Likes

### 🔹 Toggle Like

**POST** `/api/events/{id}/like`

Toggles the like for the current user on the specified event.

#### Headers

```http
Authorization: Bearer <jwt-token>
```

#### Response

```json
{
  "likes": 6
}
```

- `200 OK` – Like toggled and new like count returned  
- `401 Unauthorized` – Not logged in  
- `404 Not Found` – Event not found  

---

## 💬 Comments

### 🔹 Get Comments for Event

**GET** `/api/events/{id}/comments`

#### Response

```json
[
  {
    "id": "1b51a6f0-dc93-4e1e-9a70-0d98c6e34d2e",
    "eventId": "43ee9126-95e5-460d-a577-12eff4db6d95",
    "authorId": "95673a5c-662d-4a57-bfc5-449b4d7d83d2",
    "text": "Looking forward to this event!",
    "createdAt": "2025-01-01T12:34:56Z"
  }
]
```

- `200 OK`

---

### 🔹 Add Comment *(Auth required)*

**POST** `/api/events/{id}/comments`

#### Headers

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request body

```json
{
  "text": "This looks awesome!"
}
```

#### Responses

- `201 Created` – Comment created  
- `400 Bad Request` – Validation error  
- `401 Unauthorized` – Not logged in  
- `404 Not Found` – Event not found  

---

### 🔹 Delete Comment *(Author only)*

**DELETE** `/api/events/{eventId}/comments/{id}`

Only the comment author can delete their own comment.

#### Responses

- `204 No Content` – Comment deleted  
- `403 Forbidden` – Not the author  
- `404 Not Found` – Comment or event not found  

---

## 🌦️ External Services

### OpenWeather API

Used on the frontend to display weather for an event's location.

- Base URL: `https://api.openweathermap.org/data/2.5/weather`  
- Frontend config: `VITE_OPENWEATHER_KEY`  
- The client normalizes event location (e.g. `"Sofia, Bulgaria" → "Sofia"`) before calling the API.

### Maps (Leaflet + OpenStreetMap)

The frontend uses **Leaflet** with **OpenStreetMap** tiles to display the event location on a map.

No backend endpoints are used for maps; all calls are from the React client.

---

## ⚠️ Error Handling

Common status codes:

- `400 Bad Request` – Validation failures, invalid payloads  
- `401 Unauthorized` – Missing or invalid JWT token  
- `403 Forbidden` – User is authenticated but not allowed (e.g. editing someone else’s event)  
- `404 Not Found` – Resource does not exist  
- `500 Internal Server Error` – Unexpected server error  

Clients should always check the HTTP status before processing the response body.

---

## 🔐 Security Notes

- All protected endpoints require `Authorization: Bearer <token>` header  
- Tokens are issued with a limited lifetime (e.g. 7 days)  
- Passwords are never stored in plain text – ASP.NET Identity password hashing is used  
- CORS is restricted to the React app origins (local + Azure Static Web App)

---

For a high-level overview of the project and setup instructions, see [`README.md`](./README.md).
