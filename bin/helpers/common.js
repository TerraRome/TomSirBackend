const validate = require('validate.js');
const bcrypt = require('bcryptjs');

const isValidPayload = (payload, constraint) => {
  const { value, error } = constraint.validate(payload);
  if(!validate.isEmpty(error)){
    return {
      err: { message: error.details[0].message, code: 400 },
      data: null
    }
  }
  return {
    err: null,
    data: value
  }
};

const generateHash = async (content) => {
  const ctx = 'getSha';
  try {
    const saltRounds = 10;
    const result = await bcrypt.hash(content, saltRounds);
    return result;
  } catch (error) {
    console.log(ctx, error, 'unknown error');
  }
};

const decryptHash = async (plainText, hash) => {
  const ctx = 'decryptHash';
  try {
    const result = await bcrypt.compare(plainText, hash);
    return result;
  } catch (error) {
    console.log(ctx, error, 'unknown error');
  }
};

const safelyParseJSON = (json) => {
  const ctx = 'safelyParseJSON';
  try {
    const parsed = JSON.parse(json);
    return parsed;
  } catch (error) {
    console.log(ctx, error, 'unknown error');
  }
};

module.exports = {
  isValidPayload,
  generateHash,
  decryptHash,
  safelyParseJSON
};