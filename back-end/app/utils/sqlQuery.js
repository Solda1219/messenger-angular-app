const db = require("../../config/setting").sqlDriver;
const create = (table, data) =>
  new Promise((resolve, reject) => {
    db.query('INSERT INTO ' + table + ' SET ?', data, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res)
    });
  });
const del = (table, criteria) =>
  new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM ' + table + ' ' + criteria, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res)
      }
    );
  });
const update = (table, data, criteria) =>
  new Promise((resolve, reject) => {
    db.query(
      'UPDATE ' + table + ' SET ? ' + criteria, [data], (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res)
      }
    );
  });
const get = (table, key, criteria) =>
  new Promise((resolve, reject) => {
    db.query(
      'Select ' + key + ' From ' + table + ' ' + criteria, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res)
      }
    );
  });
const lawQuery = (query) =>
  new Promise((resolve, reject) => {
    db.query(
       query, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res)
      }
    );
  });
module.exports = {
  create: create,
  del: del,
  update: update,
  get: get,
  lawQuery: lawQuery
}