const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const fs= require('fs');
const app = express();
const router = express.Router();
const cors = require('cors');
app.use(cors());
let data = {"coins":7155};
let rewards = {"Ship1":[],"Ship2":[],"Ship3":[],"Ship7":[{"time":1650552554119,"position":"5 th","coins":3,"exp":250},{"time":1650552570126,"position":"1 st","coins":9,"exp":250}]};
let userShips = [{"name":"Ship1","model":"s001","rarity":"Boat","img":"pship0","stats":{"speed":21,"level":5,"exp":6,"maneuvering":32,"efficiency":22,"rum":1}},{"name":"Ship7","model":"s003","img":"pship1","rarity":"Ship","stats":{"speed":30,"maneuvering":31,"efficiency":32,"rum":3,"level":1,"exp":0}},{"name":"Ship2","model":"s002","img":"pship2","rarity":"Warship","stats":{"speed":26,"level":5,"exp":6,"maneuvering":27,"efficiency":30,"rum":3}},{"name":"Ship3","model":"s003","img":"pship1","rarity":"Ship","stats":{"speed":22,"level":5,"exp":6,"maneuvering":35,"efficiency":29,"rum":5}}];
let userListings = [{"name":"tedsst","model":"s001","rarity":"Warship","img":"pship2","stats":{"speed":30,"maneuvering":31,"efficiency":32,"rum":5,"level":1,"exp":0}}];
let sellPrices = {"tedsst":5,"Ship2":16,"Ship3":5};



router.get('/',(req,res)=>{
    res.json({
        'hello':'wrlld'
    })
})
router.get('/userData', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/data.json'));
    let rawdata = data;
    // res.json(JSON.parse(rawdata));
    res.send(rawdata);
  });
  router.get('/userShips', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/userships.json'));
    let rawdata = userShips;
    res.send(rawdata);
  });
  router.get('/userListings', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/userListings.json'));
    let rawdata = userListings;
    res.send(rawdata);
  });
  router.post('/cancelListing', function (req, res) {
    cancelListing(req.body.name);
    res.send({});
  });
  router.post('/addShip', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/userships.json'));
    let rawdata = userShips;
    let x = JSON.parse(rawdata);
    x.push(req.body);
    userShips =x;
    // fs.writeFile(path.resolve('./json/userships.json'), JSON.stringify(x), err => {
      if (err) throw err;
      // console.log("Done writing"); 
    //   let x = JSON.parse(fs.readFileSync(path.resolve('./json/data.json')));
    let z = data;
      z.coins -= 500;
    //   fs.writeFile(path.resolve('./json/data.json'), JSON.stringify(x), err => {
    //     if (err) throw err;
    //   });
    data = z;
      res.send({});
    // });
  });
  router.get('/rewards', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/rewards.json'));
    let rawdata = rewards;
    // res.json(JSON.parse(rawdata));
    res.send(rawdata);

  });
  router.post('/addRewards', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/rewards.json'));
    // let rawdata = rewards;
    // let x = JSON.parse(rawdata);
    let x = rewards;
    if (!x[req.body.name]) {
      x[req.body.name] = [];
    }
    x[req.body.name].push(req.body.value);
    deductRum(req.body.name);
    // fs.writeFile(path.resolve('./json/rewards.json'), JSON.stringify(x), err => {
    //   if (err) throw err;
    // });
    rewards = x;
    res.send({});
  });
  router.post('/claimRewards', function (req, res) {
    claimRewards(req.body.name);
    res.send({});
  
  });
  router.post('/addRum', function (req, res) {
    addRum(req.body.name);
    res.send({});
  
  });
  router.post('/sellShip', function (req, res) {
    sellShip(req.body.price,req.body.ship);
    claimRewards(req.body.ship.name);
    res.send({});
  
  });
  router.get('/getShipPrice', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/sellPrices.json'));
    let rawdata = sellPrices;
    res.send(rawdata);
  
  });
  function claimRewards(name){
    // let rawdata = fs.readFileSync(path.resolve('./json/rewards.json'));
    let rawdata = rewards;
    let x = JSON.parse(rawdata);
    let totalCoins = 0;
    x[name].forEach(element => {
      totalCoins += element.coins;
    });
    x[name] = [];
    // fs.writeFile(path.resolve('./json/rewards.json'), JSON.stringify(x), err => {
    //   if (err) throw err;
    // });
    rewards = x;
    // let y = JSON.parse(fs.readFileSync(path.resolve('./json/data.json')));
    let y = data;
    y.coins += totalCoins;
    // fs.writeFile(path.resolve('./json/data.json'), JSON.stringify(y), err => {
    //   if (err) throw err;
    // });
    data = y;
  }
  function sellShip(price,ship){
    // let x = JSON.parse(fs.readFileSync(path.resolve('./json/sellPrices.json')));
    // let y = JSON.parse(fs.readFileSync(path.resolve('./json/userListings.json')));
    // let z = JSON.parse(fs.readFileSync(path.resolve('./json/userships.json')));
    let x = sellPrices;
    let y = userListings;
    let z = userShips;
    x[ship.name] = price;
    y.push(ship);
    z = z.filter(elem=>{return elem.name != ship.name});
    sellPrices = x;
    userListings = y;
    userShips = z;
    // fs.writeFile(path.resolve('./json/sellPrices.json'), JSON.stringify(x), err => {
    //   if (err) throw err;
    // });fs.writeFile(path.resolve('./json/userListings.json'), JSON.stringify(y), err => {
    //   if (err) throw err;
    // });fs.writeFile(path.resolve('./json/userships.json'), JSON.stringify(z), err => {
    //   if (err) throw err;
    // });
  }
  function cancelListing(name) {
    // let y = JSON.parse(fs.readFileSync(path.resolve('./json/userListings.json')));
    // let z = JSON.parse(fs.readFileSync(path.resolve('./json/userships.json')));
    let y = userListings;
    let z = userShips;
    let x = {};
    let i = null;
    y.forEach((elem, index) => {
      if (elem.name == name) {
        x = elem;
        i = index;
      }
    })
    y.splice(i,1);
    // fs.writeFile(path.resolve('./json/userListings.json'), JSON.stringify(y), err => {
    //   if (err) throw err;
    // });
    userListings  = y;
    z.push(x);
    // fs.writeFile(path.resolve('./json/userships.json'), JSON.stringify(z), err => {
    //   if (err) throw err;
    // });
    userShips = z;
  }
  function addRum(name) {
    if (name) {
    //   let y = JSON.parse(fs.readFileSync(path.resolve('./json/userships.json')));
    let y = userShips;
      y.forEach(elem => {
        if (elem.name == name) {
          elem.stats.rum = 5;
        //   let y = JSON.parse(fs.readFileSync(path.resolve('./json/data.json')));
        let y  = data;
          y.coins -= 3;
        //   fs.writeFile(path.resolve('./json/data.json'), JSON.stringify(y), err => {
        //     if (err) throw err;
        //   });
        data= y;
        }
      })
    //   fs.writeFile(path.resolve('./json/userships.json'), JSON.stringify(y), err => {
    //     if (err) throw err;
    //   });
    userShips=y;
    }
  }
  function deductRum(name) {
    if (name) {
    //   let y = JSON.parse(fs.readFileSync(path.resolve('./json/userShips.json')));
    let y = userShips;
      y.forEach(elem => {
        if (elem.name == name) {
          elem.stats.rum--;
        }
      })
    //   fs.writeFile(path.resolve('./json/userShips.json'), JSON.stringify(y), err => {
    //     if (err) throw err;
    //   });
    userShips = y;
    }
  }
app.use('/.netlify/functions/api',router);
module.exports.handler = serverless(app);