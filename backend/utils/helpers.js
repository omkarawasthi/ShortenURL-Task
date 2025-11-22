// Utility function to generate a random code
function generateRandomCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Utility function to validate code format
function isValidCode(code) {
  const regex = /^[A-Za-z0-9]{6,8}$/;
  return regex.test(code);
}

module.exports = {
  generateRandomCode,
  isValidCode
};