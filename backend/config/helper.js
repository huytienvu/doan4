// utils/helper.js
const util = require('util');
const db = require('../config/database');

const query = util.promisify(db.query).bind(db);

async function helper(sql, params = []) {
  try {
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = helper;
