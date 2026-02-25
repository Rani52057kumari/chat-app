/**
 * Location Service
 * Handles geolocation and reverse geocoding with privacy
 */

/**
 * Get user's current position
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Reverse geocode coordinates to get city, state, country
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{city: string, state: string, country: string}>}
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ChatApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const data = await response.json();
    const address = data.address || {};

    return {
      city: address.city || address.town || address.village || address.county || null,
      state: address.state || address.region || null,
      country: address.country || null
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Unable to determine location details');
  }
};

/**
 * Get user's location (coordinates + geocoded address)
 * @returns {Promise<{city: string, state: string, country: string}>}
 */
export const getUserLocation = async () => {
  try {
    // Get coordinates
    const { latitude, longitude } = await getCurrentPosition();
    
    // Reverse geocode to get address
    const location = await reverseGeocode(latitude, longitude);
    
    return location;
  } catch (error) {
    console.error('Location service error:', error);
    throw error;
  }
};

/**
 * Request location permission with user-friendly prompt
 * @returns {Promise<boolean>} true if permission granted, false if denied
 */
export const requestLocationPermission = async () => {
  try {
    if (!navigator.permissions) {
      // Permissions API not supported, try direct geolocation call
      await getCurrentPosition();
      return true;
    }

    const permission = await navigator.permissions.query({ name: 'geolocation' });
    
    if (permission.state === 'granted') {
      return true;
    } else if (permission.state === 'prompt') {
      // Will trigger browser prompt
      try {
        await getCurrentPosition();
        return true;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
};

/**
 * Format location for display
 * @param {object} user - User object with location fields
 * @returns {string} Formatted location string or null
 */
export const formatLocation = (user) => {
  if (!user || !user.locationEnabled) {
    return null;
  }

  const parts = [];
  if (user.city) parts.push(user.city);
  if (user.country) parts.push(user.country);

  return parts.length > 0 ? `📍 ${parts.join(', ')}` : null;
};
