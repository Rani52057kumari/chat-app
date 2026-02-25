# Location Feature Documentation

## Overview
Privacy-friendly location sharing feature that allows users to optionally share their city and country (no precise coordinates).

## Features
✅ **User Model** - Added location fields to MongoDB schema
✅ **Backend API** - PUT `/api/auth/users/update-location` endpoint
✅ **Frontend Service** - Location utility with geolocation + reverse geocoding
✅ **Permission Modal** - Beautiful prompt after login/register
✅ **Profile Display** - Shows "📍 City, Country" in public profiles

## Privacy & Security
- ✅ **Optional Sharing**: Default `locationEnabled: false`
- ✅ **No Raw Coordinates**: Only city, state, country stored
- ✅ **User Control**: Can skip on login or disable anytime
- ✅ **Transparent**: Clear privacy info in permission modal
- ✅ **Free Service**: Uses OpenStreetMap Nominatim (no API key)

## Implementation Details

### 1. Database Schema (`/server/models/User.js`)
```javascript
city: { type: String, trim: true, maxlength: 100, default: null }
state: { type: String, trim: true, maxlength: 100, default: null }
country: { type: String, trim: true, maxlength: 100, default: null }
locationEnabled: { type: Boolean, default: false }
lastLocationUpdate: { type: Date, default: null }
```

### 2. Backend API (`/server/controllers/authController.js`)
**Endpoint**: `PUT /api/auth/users/update-location`
**Auth**: Protected (requires JWT token)
**Body**:
```json
{
  "city": "Delhi",
  "state": "Delhi",
  "country": "India",
  "locationEnabled": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "city": "Delhi",
    "state": "Delhi",
    "country": "India",
    "locationEnabled": true,
    "lastLocationUpdate": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Frontend Utilities (`/client/src/utils/locationService.js`)

**Functions**:
- `getCurrentPosition()` - Gets browser geolocation
- `reverseGeocode(lat, lng)` - Converts coordinates to city/state/country
- `getUserLocation()` - Combined: get coords + geocode
- `requestLocationPermission()` - Check browser permission
- `formatLocation(user)` - Format for display: "📍 City, Country"

**Geocoding Service**: 
- **API**: OpenStreetMap Nominatim
- **Free**: No API key required
- **Rate Limit**: 1 request/sec (usage: 1 request per login)
- **Fallback**: Handles city/town/village variations

### 4. UI Components

**LocationPermissionModal** (`/client/src/components/LocationPermissionModal.js`)
- Shows after successful login/register
- Two buttons: "Allow Location" / "Skip for Now"
- Privacy info panel with shield icon
- Error handling for permission denied/unavailable
- Auto-navigates to chat after completion

**ProfileModal** (`/client/src/components/ProfileModal.js`)
- Displays location when `locationEnabled: true`
- Format: 📍 Icon + "City, Country"
- Gradient background (primary → purple)
- Falls back gracefully if location disabled

### 5. Integration Points

**Login Flow** (`/client/src/pages/Login.js`):
```
User submits login → Auth success → Show LocationPermissionModal → User allows/skips → Navigate to /chat
```

**Register Flow** (`/client/src/pages/Register.js`):
```
User registers → Account created → Show LocationPermissionModal → User allows/skips → Navigate to /chat
```

## Testing Checklist

### Manual Testing Steps:
1. **Register New User**
   - [ ] Location modal appears after registration
   - [ ] Click "Allow Location" → Browser permission prompt
   - [ ] Grant permission → Location saves successfully
   - [ ] Navigate to chat after completion

2. **Login Existing User**
   - [ ] Location modal appears (if location not set)
   - [ ] Click "Skip for Now" → Continues to chat
   - [ ] Profile shows no location

3. **View Profile**
   - [ ] Click avatar in chat
   - [ ] Profile modal shows location if enabled
   - [ ] Format: "📍 City, Country" with gradient background

4. **Permission Denied**
   - [ ] Click "Allow Location" → Deny browser prompt
   - [ ] Error message appears
   - [ ] Can still skip and continue

5. **Network Failure**
   - [ ] Simulate offline during geocoding
   - [ ] Error message shows
   - [ ] Can retry or skip

### API Testing:
```bash
# Test update location (requires valid JWT token)
curl -X PUT http://localhost:5000/api/auth/users/update-location \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "locationEnabled": true
  }'

# Test get public profile with location
curl http://localhost:5000/api/auth/users/USER_ID/public-profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Known Limitations
1. **Nominatim Rate Limit**: 1 request/sec (low impact, only on login)
2. **City Detection**: May fall back to town/village/county if city unavailable
3. **Permission Persistence**: Browser remembers allow/deny, won't re-prompt
4. **Accuracy**: City-level accuracy (intentional for privacy)

## Future Enhancements
- Add "Update Location" button in profile settings
- Allow manual location entry (for VPN users)
- Add distance-based search ("Find users near me")
- Location history (with user consent)
- Multiple locations (home/work)

## Browser Compatibility
- ✅ Chrome/Edge (Chromium): Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ⚠️ HTTP (non-HTTPS): Geolocation disabled by browsers
- ⚠️ Private/Incognito: May require re-permission

## Privacy Compliance
- ✅ GDPR Compliant: Explicit consent, easy opt-out
- ✅ Transparent: Clear explanation before permission
- ✅ Minimal Data: Only city/country stored
- ✅ User Control: Can disable anytime
- ✅ No Tracking: Single location snapshot, not continuous

## Files Modified/Created

**Backend** (3 files):
1. `/server/models/User.js` - Added 5 location fields
2. `/server/controllers/authController.js` - Added `updateLocation` handler + updated `getPublicProfile`
3. `/server/routes/authRoutes.js` - Added PUT `/users/update-location` route

**Frontend** (6 files):
1. `/client/src/services/api.js` - Added `updateLocation` to authAPI
2. `/client/src/utils/locationService.js` - NEW: Geolocation + geocoding utilities
3. `/client/src/components/LocationPermissionModal.js` - NEW: Permission UI
4. `/client/src/components/ProfileModal.js` - Added location display
5. `/client/src/pages/Login.js` - Integrated location modal
6. `/client/src/pages/Register.js` - Integrated location modal

**Total Changes**: 9 files (2 new, 7 modified)

## Deployment Notes
- No environment variables required (uses free Nominatim API)
- MongoDB will auto-add location fields on first user update
- Existing users: location fields will be `null` until they enable
- No database migration needed
