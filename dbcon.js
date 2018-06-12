var mysql = require('mysql');
var pool = mysql.createPool({
  conectionLimit : 10,
  host		     : 'classmysql.engr.oregonstate.edu',
  user           : 'cs340_hoovertr',
  password       : '4974',
  database       : 'cs340_hoovertr'
});
module.exports.pool = pool;
