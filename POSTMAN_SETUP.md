# POSTMAN SETUP GUIDE

## Bearer Token Configuration

### 1. Get Token từ Frontend

1. **Đăng nhập vào ứng dụng**: http://localhost:5174
2. **Mở Developer Tools** (F12)
3. **Console tab**, chạy lệnh:**
   ```javascript
   localStorage.getItem('token')
   ```
4. **Sao chép token** được trả về

### 2. Setup Postman Headers

#### Method: GET
#### URL: `https://localhost:7163/api/Booking/All/{userId}`

#### Headers:
```
Authorization: Bearer {your-token-here}
Content-Type: application/json
```

### 3. Example Requests

#### Get User Bookings
```
GET https://localhost:7163/api/Booking/All/User0001
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

#### Get All Bookings (Admin)
```
GET https://localhost:7163/api/Booking
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

#### Buy Ticket
```
POST https://localhost:7163/api/Booking/buy-ticket
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

Body (raw JSON):
{
  "eventID": "Event0001",
  "quantity": 1
}
```

### 4. SSL Certificate Issue

Nếu gặp lỗi SSL, trong Postman:
1. **Settings** → **General**
2. **Turn OFF** "SSL certificate verification"

### 5. Token Format

Token thường có format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 6. Debug Steps

1. **Check console logs**:
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   ```

2. **Test API endpoint**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" https://localhost:7163/api/Booking/All/User0001
   ```

3. **Verify user ID**:
   ```javascript
   // In browser console
   const user = JSON.parse(localStorage.getItem('user'));
   console.log('User ID:', user?.id);
   ```

### 7. Common Issues

- **401 Unauthorized**: Token expired or invalid
- **400 Bad Request**: Wrong request format
- **404 Not Found**: User ID không tồn tại
- **CORS Error**: Chỉ xảy ra trên browser, Postman không bị

### 8. Successful Response Example

```json
[
  {
    "bookingID": "booking123",
    "eventID": "Event0001", 
    "userId": "User0001",
    "quantity": 1,
    "status": 1,
    "createdAt": "2025-01-24T10:00:00Z",
    "event": {
      "id": "Event0001",
      "name": "Sự kiện test",
      "price": 100000,
      "date_Start": "2025-02-01T19:00:00Z"
    }
  }
]
```
