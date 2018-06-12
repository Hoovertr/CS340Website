var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5225);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('javas'));
app.use(express.static('public'));

app.get('/', function(req, res, next){
	var context = {};
	res.render('homePage', context);
});

app.get('/addEntity', function(req, res, next){
	var context = {};
	res.render('addEntity', context);
});

app.get('/cities', function(req, res, next){
	var context = {};
	mysql.pool.query('SELECT city_id, name, xcoord, ycoord, xlength, ylength FROM city', function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.city = row;
		res.render('cities', context);
	});
});

app.post('/cities', function(req, res){
	var keys = [];
	var values = [];
	var str = '';
	for (var p in req.body){
		values.push("'" + req.body[p] + "'");
	}
	str += "INSERT INTO city";
	str += "(name, xcoord, ycoord, xlength, ylength)";
	str += " VALUES (" + values.join(",") + ");";

	mysql.pool.query(str, function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/cities');
	});
});

app.get('/delete/city/:id', function(req, res, next){
	var str = "DELETE FROM city WHERE city_id =";
	str += req.params.id;

	mysql.pool.query(str, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/cities');
	});
});

app.get('/edit/city/:id', function(req, res, next){
	var context={};
	var str = "SELECT city_id, name, xcoord, ycoord, xlength, ylength FROM city WHERE city_id=";
	str += req.params.id;
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.city = row[0];
		res.render('updateCity', context);
	});
});

app.post('/edit/city/:id', function(req, res, next){
	var context={};
	var str = "UPDATE city SET name=?,xcoord=?,ycoord=?,xlength=?,ylength=? WHERE city_id= ?;";
	mysql.pool.query(str,[req.body.cname, req.body.xcoord, req.body.ycoord, req.body.xlen, req.body.ylen, req.params.id], function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/cities');
	});
});


app.get('/chars', function(req, res, next){
	var context = {};
	var str = 'SELECT character_id, fortChar.name as charName, email, fortChar.building as bld, backpack, suit, harvestingTool FROM fortChar INNER JOIN';
	str += ' outfit ON fortChar.outfit = outfit.outfit_id INNER JOIN';
	str += ' building ON fortChar.building = building_id';
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.fortChar = row;
	});
	mysql.pool.query('SELECT outfit_id, backpack, suit, harvestingTool FROM outfit', function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.outfits = row;
	});
	var str1 = 'SELECT name, building_id FROM city INNER JOIN building ON city_id = building.city';
	mysql.pool.query(str1, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.building = row;
		res.render('chars', context);
	});
});

app.post('/chars', function(req, res){
	var keys = [];
	var values = [];
	var str = '';
	for (var p in req.body){
		values.push("'" + req.body[p] + "'");
	}
	str += "INSERT INTO fortChar";
	str += "(name, email, outfit, building)";
	str += " VALUES (" + values.join(",") + ");";

	mysql.pool.query(str, function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/chars');
	});
});

app.get('/delete/chars/:id', function(req, res, next){
	var str = "DELETE FROM fortChar WHERE character_id =";
	str += req.params.id;

	mysql.pool.query(str, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/chars');
	});
});

app.get('/edit/chars/:id', function(req, res, next){
	var context={};
	var str = 'SELECT character_id, name, email, fortChar.outfit, building FROM fortChar WHERE character_id=';
	str += req.params.id;
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.fortChar = row[0];
	});
	str1 = "SELECT outfit_id, suit, backpack FROM outfit";
	mysql.pool.query(str1, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.outfits = row;
	});
	str2 = "SELECT city.name, building_id FROM building INNER JOIN city ON city.city_id = building.city";
	mysql.pool.query(str2, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.buildings = row;
		res.render('updateChar', context);
	});

});


app.post('/edit/chars/:id', function(req, res, next){
	var context={};
	var str = "UPDATE fortChar SET name=?,email=?,outfit=?,building=? WHERE character_id= ?;";
	mysql.pool.query(str,[req.body.cname, req.body.cemail, req.body.coutfit, req.body.cbuilding, req.params.id], function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/chars');
	});
});
app.get('/buildings', function(req, res, next){
	var context = {};
	var str = 'SELECT building_id, size, type, garage, basement, city FROM building'
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.building = row;
	});
	mysql.pool.query('SELECT city_id, name FROM city', function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.city = row;
		res.render('buildings', context);
	});
});

app.post('/buildings', function(req, res){
	var keys = [];
	var values = [];
	var str = '';
	for (var p in req.body){
		values.push("'" + req.body[p] + "'");
	}
	str += "INSERT INTO building";
	str += "(size, type, garage, basement, city)";
	str += " VALUES (" + values.join(",") + ");";
	
	mysql.pool.query(str, function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/buildings');
	});
});

app.get('/delete/building/:id', function(req, res, next){
	var str = "DELETE FROM building WHERE building_id =";
	str += req.params.id;
	console.log("hello");
	mysql.pool.query(str, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/buildings');
	});
});

app.get('/edit/building/:id', function(req, res, next){	
	var context={};
	var str = "SELECT building_id, size, type, garage, basement, city FROM building WHERE building_id=";
	str += req.params.id;
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.building = row[0];
	});
	var str2 = "SELECT city_id, name FROM city";
	mysql.pool.query(str2, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.city = row;
	});
	var str3 = "SELECT name FROM city INNER JOIN building ON city_id=building.city WHERE building_id=";
	str3 += req.params.id
	mysql.pool.query(str3, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.name = row[0];
		res.render('updateBuilding', context);
	});
});

app.post('/edit/building/:id', function(req, res, next){
	var context={};
	var str = "UPDATE building SET size=?,type=?,garage=?,basement=?,city=? WHERE building_id= ?;";
	mysql.pool.query(str,[req.body.bsize, req.body.btype, req.body.bgarage, req.body.bbasement, req.body.bcity, req.params.id], function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/buildings');
	});
});


app.get('/outfits', function(req, res, next){
	var context = {};
	mysql.pool.query('SELECT outfit_id, backpack, suit, harvestingTool FROM outfit', function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.outfit = row;
		res.render('outfits', context);
	});
});

app.post('/outfits', function(req, res){
	var keys = [];
	var values = [];
	var str = '';
	for (var p in req.body){
		values.push("'" + req.body[p] + "'");
	}
	str += "INSERT INTO outfit";
	str += "(backpack, suit, harvestingTool)";
	str += " VALUES (" + values.join(",") + ");";

	mysql.pool.query(str, function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/outfits');
	});
});

app.get('/delete/outfit/:id', function(req, res, next){
	var str = "DELETE FROM outfit WHERE outfit_id =";
	str += req.params.id;

	mysql.pool.query(str, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/outfits');
	});
});

app.get('/edit/outfit/:id', function(req, res, next){
	var context={};
	var str = "SELECT outfit_id, backpack, suit, harvestingTool FROM outfit WHERE outfit_id=";
	str += req.params.id;
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.outfit = row[0];
		res.render('updateOutfit', context);
	});
});

app.post('/edit/outfit/:id', function(req, res, next){
	var context={};
	var str = "UPDATE outfit SET backpack=?,suit=?,harvestingTool=? WHERE outfit_id= ?;";
	mysql.pool.query(str,[req.body.backpack, req.body.suit, req.body.harvestingTool, req.params.id], function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/outfits');
	});
});

app.get('/items', function(req, res, next){
	var context = {};
	mysql.pool.query('SELECT item_id, name, type, quantity FROM item', function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.item = row;
		res.render('items', context);
	});
});

app.post('/items', function(req, res){
	var keys = [];
	var values = [];
	var str = '';
	for (var p in req.body){
		values.push("'" + req.body[p] + "'");
	}
	str += "INSERT INTO item";
	str += "(name, type, quantity)";
	str += " VALUES (" + values.join(",") + ");";

	mysql.pool.query(str, function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/items');
	});
});

app.get('/delete/item/:id', function(req, res, next){
	var str = "DELETE FROM item WHERE item_id =";
	str += req.params.id;

	mysql.pool.query(str, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/items');
	});
});


app.get('/edit/item/:id', function(req, res, next){
	var context={};
	var str = "SELECT item_id, name, type, quantity FROM item WHERE item_id=";
	str += req.params.id;
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
		context.item = row[0];
		res.render('updateItem', context);
	});
});

app.post('/edit/item/:id', function(req, res, next){
	var context={};
	var str = "UPDATE item SET name=?,type=?,quantity=? WHERE item_id= ?;";
	mysql.pool.query(str,[req.body.iname, req.body.itype, req.body.iquantity, req.params.id], function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/items');
	});
});

app.get('/addRelationship', function(req, res, next){
	var context = {};
	var str = "SELECT character_id, name FROM fortChar";
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
	}
	context.fortChar = row;
	res.render('addRelationship', context);
	});
});

app.get('/addRelationship/:id', function(req, res, next){
	var context={};
	var str = "SELECT character_id, item_id, item.name as iname, type, quantity FROM fortChar INNER JOIN ";
	str += "item_cert ON character_id = cid INNER JOIN ";
	str += "item ON iid = item_id WHERE character_id=";
	str += req.params.id;
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}	
	context.fortChar = row;
	});
	var str1 = "SELECT character_id, item_id, item.name as iname, type, quantity FROM fortChar INNER JOIN ";
	str1 += "item ON character_id=";
	str1 += req.params.id;
	mysql.pool.query(str1, function(err, row, fields){
		if(err){
			console.log(err);
			return;
	}
	context.item = row;
	res.render('updateRelationship', context);
	});
});

/*app.get('/edit/relationship/:iid/:cid', function(req, res, next){	
	var context = {};
	var str = "SELECT name, type, quantity FROM item WHERE item_id <>";
	str += req.params.iid;
	mysql.pool.query(str, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
	context.items = row;
	});
	var str1 = "SELECT item_id, name, type, quantity FROM item WHERE item_id=";
	str1 += req.params.iid;
	mysql.pool.query(str1, function(err, row, fields){
		if(err){
			console.log(err);
			return;
		}
	context.curItem = row[0];
	});
	var str2 = "SELECT name, character_id FROM fortChar WHERE character_id=";
	str2 += req.params.cid;
	mysql.pool.query(str2, function(err, row, fields){
		if(err){
			console.log(erR);
			return;
		}
	context.fortChar = row[0];
	res.render('editRelationship', context);
	});
});*/


app.get('/delete/relationship/:iid/:cid', function(req, res, next){
	var str = "DELETE FROM item_cert WHERE cid =";
	str += req.params.cid;
	str += " AND iid =";
	str += req.params.iid;
	mysql.pool.query(str, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/addRelationship');
	});
});

app.get('/add/relationship/:iid/:cid', function(req, res, next){
	var str = "INSERT INTO item_cert";
	str += "(iid, cid)";
	str += " VALUES ("+ req.params.iid + "," + req.params.cid+ ");";

	mysql.pool.query(str, function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}
		res.redirect(302, '/addRelationship');
	});
});

app.get('/filterCity', function(req, res, next){
	var context = {};
	var str = "SELECT city_id, name FROM city";
	mysql.pool.query(str, function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}
	context.cities = rows;
	res.render('filterCity', context);
	});
});

app.post('/filterCity', function(req, res, next){
	var context = {};
	var str1 = "SELECT city_id, name FROM city";
	mysql.pool.query(str1, function(err, rows, fields){
		if(err){
			console.log(err);
			return;
		}
	context.cities = rows;
	});
	var str = "SELECT building_id, size, type, garage, basement FROM building WHERE city=";
	str += req.body.citySelect;
	mysql.pool.query(str, function(err, row, field){
		if(err){
			console.log(err);
			return;
		}
	context.buildings = row;
	res.render('filterCity', context);
	});
});
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

app.use(function(err,req,res,next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
