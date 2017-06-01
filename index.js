var fs = require('fs');
var dir = './data';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/heroes.db');
db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS heroes (id INTEGER, name TEXT)");

  db.get("SELECT COUNT(*) AS count FROM heroes", function (err, row) {
    count = row.count;

    if (count == 0) {
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 11, "Mr. Nice");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 12, "Narco");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 13, "Bombasto");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 14, "Celeritas");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 15, "Magneta");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 16, "RubberMan");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 17, "Dynama");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 18, "Dr IQ");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 19, "Magma");
      db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", 20, "Tornado");
    }
  });
});


var express = require('express'), bodyParser = require('body-parser');
var app = express()
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/heroes', function (req, res, next) {
  db.all("SELECT * FROM heroes", function (err, heroes) {
    res.json(heroes);
  });
});

app.get('/heroes/:id', function (req, res) {
  db.get("SELECT id, name FROM heroes WHERE id = ?", req.params.id, function (err, hero) {
    res.json(hero);
  });
})

app.post('/heroes', function (req, res) {
  hero = req.body;
  db.run("INSERT INTO heroes (id, name) VALUES (?, ?)", hero.id, hero.name, function (err, row) {
    if (err) {
      console.err(err);
      res.status(500);
    } else {
      res.status(201);
    }
    res.end();
  });
});


app.put('/heroes/:id', function (req, res) {
  hero_id = req.params.id;
  hero = req.body;
  db.run("UPDATE heroes SET name = ? WHERE id = ?", hero.name, hero_id, function (err, row) {
    if (err) {
      console.err(err);
      res.status(500);
    } else {
      res.status(202);
    }
    res.end();
  });
});


app.delete('/heroes/:id', function (req, res) {
  hero_id = req.params.id;
  db.run("DELETE FROM heroes WHERE id = ?", hero_id, function (err, row) {
    if (err) {
      console.err(err);
      res.status(500);
    } else {
      res.status(203);
    }
    res.end();
  });
});

app.listen(3000)

console.log("Access Tour of Heroes at http://localhost:3000/heroes");