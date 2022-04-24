const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const fs= require('fs');
const app = express();
const router = express.Router();
let data = {"coins":7155};
let rewards = {"Ship1":[],"Ship2":[],"Ship3":[],"Ship7":[{"time":1650552554119,"position":"5 th","coins":3,"exp":250},{"time":1650552570126,"position":"1 st","coins":9,"exp":250}]};
router.get('/',(req,res)=>{
    res.json({
        'hello':'wrlld'
    })
})
router.get('/userData', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/data.json'));
    let rawdata = data;
    res.json(JSON.parse(rawdata));
  });
  router.get('/userShips', function (req, res) {
    let rawdata = fs.readFileSync(path.resolve('./json/userships.json'));
    res.json(JSON.parse(rawdata));
  });
  router.get('/userListings', function (req, res) {
    let rawdata = fs.readFileSync(path.resolve('./json/userListings.json'));
    res.json(JSON.parse(rawdata));
  });
  router.post('/cancelListing', function (req, res) {
    cancelListing(req.body.name);
    res.json({});
  });
  router.post('/addShip', function (req, res) {
    let rawdata = fs.readFileSync(path.resolve('./json/userships.json'));
    let x = JSON.parse(rawdata);
    x.push(req.body);
    fs.writeFile(path.resolve('./json/userships.json'), JSON.stringify(x), err => {
      // Checking for errors
      if (err) throw err;
      console.log("Done writing"); // Success
    //   let x = JSON.parse(fs.readFileSync(path.resolve('./json/data.json')));
    let x = data;
      x.coins -= 500;
    //   fs.writeFile(path.resolve('./json/data.json'), JSON.stringify(x), err => {
    //     if (err) throw err;
    //   });
    data = x;
      res.json({});
    });
  });
  router.get('/rewards', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/rewards.json'));
    let rawdata = rewards;
    res.json(JSON.parse(rawdata));
  });
  router.post('/addRewards', function (req, res) {
    // let rawdata = fs.readFileSync(path.resolve('./json/rewards.json'));
    let rawdata = rewards;
    let x = JSON.parse(rawdata);
    if (!x[req.body.name]) {
      x[req.body.name] = [];
    }
    x[req.body.name].push(req.body.value);
    deductRum(req.body.name);
    // fs.writeFile(path.resolve('./json/rewards.json'), JSON.stringify(x), err => {
    //   if (err) throw err;
    // });
    rewards = x;
    res.json({});
  });
  router.post('/claimRewards', function (req, res) {
    claimRewards(req.body.name);
    res.json({});
  
  });
  router.post('/addRum', function (req, res) {
    addRum(req.body.name);
    res.json({});
  
  });
  router.post('/sellShip', function (req, res) {
    sellShip(req.body.price,req.body.ship);
    claimRewards(req.body.ship.name);
    res.json({});
  
  });
  router.get('/getShipPrice', function (req, res) {
    let rawdata = fs.readFileSync(path.resolve('./json/sellPrices.json'));
    res.json(rawdata);
  
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
    let x = JSON.parse(fs.readFileSync(path.resolve('./json/sellPrices.json')));
    let y = JSON.parse(fs.readFileSync(path.resolve('./json/userListings.json')));
    let z = JSON.parse(fs.readFileSync(path.resolve('./json/userships.json')));
    x[ship.name] = price;
    y.push(ship);
    z = z.filter(elem=>{return elem.name != ship.name});
    fs.writeFile(path.resolve('./json/sellPrices.json'), JSON.stringify(x), err => {
      if (err) throw err;
    });fs.writeFile(path.resolve('./json/userListings.json'), JSON.stringify(y), err => {
      if (err) throw err;
    });fs.writeFile(path.resolve('./json/userships.json'), JSON.stringify(z), err => {
      if (err) throw err;
    });
  }
  function cancelListing(name) {
    let y = JSON.parse(fs.readFileSync(path.resolve('./json/userListings.json')));
    let z = JSON.parse(fs.readFileSync(path.resolve('./json/userships.json')));
    let x = {};
    let i = null;
    y.forEach((elem, index) => {
      if (elem.name == name) {
        x = elem;
        i = index;
      }
    })
    y.splice(i,1);
    fs.writeFile(path.resolve('./json/userListings.json'), JSON.stringify(y), err => {
      if (err) throw err;
    });
    z.push(x);
    fs.writeFile(path.resolve('./json/userships.json'), JSON.stringify(z), err => {
      if (err) throw err;
    });
  }
  function addRum(name) {
    if (name) {
      let y = JSON.parse(fs.readFileSync(path.resolve('./json/userships.json')));
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
      fs.writeFile(path.resolve('./json/userships.json'), JSON.stringify(y), err => {
        if (err) throw err;
      });
    }
  }
  function deductRum(name) {
    if (name) {
      let y = JSON.parse(fs.readFileSync(path.resolve('./json/userShips.json')));
      y.forEach(elem => {
        if (elem.name == name) {
          elem.stats.rum--;
        }
      })
      fs.writeFile(path.resolve('./json/userShips.json'), JSON.stringify(y), err => {
        if (err) throw err;
      });
    }
  }
app.use('/.netlify/functions/api',router);
module.exports.handler = serverless(app);