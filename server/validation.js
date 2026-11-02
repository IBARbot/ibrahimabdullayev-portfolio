// Input validation and sanitization utilities

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate phone number (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Allow international format: +994, digits, spaces, dashes, parentheses
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.trim().replace(/\s/g, ''));
}

/**
 * Validate date string format (YYYY-MM-DD)
 * @param {string} date - Date string to validate
 * @returns {boolean} - True if valid
 */
export function isValidDate(date) {
  if (!date || typeof date !== 'string') return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

/**
 * Validate date chronology (end date after start date)
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {boolean} - True if end date is after start date
 */
export function isValidDateRange(startDate, endDate) {
  if (!startDate || !endDate) return true; // Optional fields
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end > start;
}

/**
 * Sanitize booking data object
 * @param {object} bookingData - Booking data to sanitize
 * @returns {object} - Sanitized booking data
 */
export function sanitizeBookingData(bookingData) {
  if (!bookingData || typeof bookingData !== 'object') {
    throw new Error('Invalid booking data');
  }

  const sanitized = {};

  // Sanitize string fields
  const stringFields = ['name', 'email', 'phone', 'from', 'to', 'destination', 'notes', 'embassyCountry'];
  stringFields.forEach(field => {
    if (bookingData[field] !== undefined) {
      sanitized[field] = sanitizeString(String(bookingData[field]));
    }
  });

  // Validate and sanitize email
  if (bookingData.email) {
    const email = bookingData.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    sanitized.email = email;
  }

  // Validate and sanitize phone
  if (bookingData.phone) {
    const phone = bookingData.phone.trim();
    if (!isValidPhone(phone)) {
      throw new Error('Invalid phone format');
    }
    sanitized.phone = phone;
  }

  // Validate date fields
  const dateFields = ['departureDate', 'returnDate', 'checkIn', 'checkOut', 'startDate', 'endDate', 'date'];
  dateFields.forEach(field => {
    if (bookingData[field]) {
      if (!isValidDate(bookingData[field])) {
        throw new Error(`Invalid date format for ${field}`);
      }
      sanitized[field] = bookingData[field];
    }
  });

  // Validate date ranges
  if (bookingData.departureDate && bookingData.returnDate) {
    if (!isValidDateRange(bookingData.departureDate, bookingData.returnDate)) {
      throw new Error('Return date must be after departure date');
    }
  }

  if (bookingData.checkIn && bookingData.checkOut) {
    if (!isValidDateRange(bookingData.checkIn, bookingData.checkOut)) {
      throw new Error('Check-out date must be after check-in date');
    }
  }

  if (bookingData.startDate && bookingData.endDate) {
    if (!isValidDateRange(bookingData.startDate, bookingData.endDate)) {
      throw new Error('End date must be after start date');
    }
  }

  // Validate booking type
  const validTypes = ['flight', 'hotel', 'transfer', 'insurance', 'embassy'];
  if (!validTypes.includes(bookingData.type)) {
    throw new Error('Invalid booking type');
  }
  sanitized.type = bookingData.type;

  // Sanitize numeric fields
  const numericFields = ['passengers', 'rooms', 'guests', 'transferPassengers'];
  numericFields.forEach(field => {
    if (bookingData[field] !== undefined) {
      const num = parseInt(bookingData[field], 10);
      if (!isNaN(num) && num > 0 && num <= 100) {
        sanitized[field] = num;
      }
    }
  });

  // Sanitize select fields (prevent injection)
  const selectFields = ['class', 'stops', 'hotelType', 'transferType', 'vehicleType', 'insuranceType', 'package', 'coverage', 'visaType'];
  selectFields.forEach(field => {
    if (bookingData[field]) {
      sanitized[field] = sanitizeString(String(bookingData[field]));
    }
  });

  // Sanitize boolean fields
  if (bookingData.urgent !== undefined) {
    sanitized.urgent = Boolean(bookingData.urgent);
  }

  // Sanitize passenger info objects
  if (bookingData.passengerInfo) {
    sanitized.passengerInfo = {
      adults: Math.max(0, Math.min(20, parseInt(bookingData.passengerInfo.adults, 10) || 0)),
      children: Math.max(0, Math.min(20, parseInt(bookingData.passengerInfo.children, 10) || 0)),
      infants: Math.max(0, Math.min(20, parseInt(bookingData.passengerInfo.infants, 10) || 0)),
      seniors: Math.max(0, Math.min(20, parseInt(bookingData.passengerInfo.seniors, 10) || 0)),
      childAges: Array.isArray(bookingData.passengerInfo.childAges)
        ? bookingData.passengerInfo.childAges.map(age => Math.max(2, Math.min(17, parseInt(age, 10) || 5)))
        : [],
      infantAges: Array.isArray(bookingData.passengerInfo.infantAges)
        ? bookingData.passengerInfo.infantAges.map(age => Math.max(0, Math.min(23, parseInt(age, 10) || 6)))
        : [],
    };
  }

  // Copy other safe fields
  if (bookingData.tripType) sanitized.tripType = bookingData.tripType;
  if (bookingData.segments) sanitized.segments = bookingData.segments;
  if (bookingData.guestInfo) sanitized.guestInfo = bookingData.guestInfo;
  if (bookingData.transferPassengerInfo) sanitized.transferPassengerInfo = bookingData.transferPassengerInfo;
  if (bookingData.insuranceTravelerInfo) sanitized.insuranceTravelerInfo = bookingData.insuranceTravelerInfo;
  if (bookingData.embassyTravelerInfo) sanitized.embassyTravelerInfo = bookingData.embassyTravelerInfo;

  return sanitized;
}








