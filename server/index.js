////////////////////////////////////LIBRARIES////////////////////////////////////
require('dotenv').config()
const express = require('express')
const mysql = require("mysql")
const cors = require('cors')
const bodyParser = require('body-parser')

////////////////////////////////////METHODS////////////////////////////////////
//express
const app = express()

//cors
app.use(cors())

//sql
const sqlFindAllGroceries = "SELECT upc12, brand, name, id FROM grocery_list"
const sqlEditGroceryDetails = "UPDATE grocery_list SET brand = ?, name= ?, upc12 = ?  WHERE id = ?"
const sqlAddGroceryDetails = "INSERT INTO grocery_list (brand, name, upc12) VALUES (?, ?, ?)"
const sqlDeleteGrocery = "DELETE FROM grocery_list WHERE id = ?;"
const sqlFindGrocerybySearchString = "SELECT upc12, brand, name, id FROM grocery_list WHERE (brand LIKE ?) || (name LIKE ?)"
var pool = mysql.createPool ({ 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONLIMIT
})

//promise for sql query
var makeQuery = (sql, pool) => {
  console.info('sql >>>>> ', sql)
  return (args) => {
    let queryPromise = new Promise ((resolve, reject) => {
      pool.getConnection ((err, connection) => {
        if (err) {
          reject (err)
          return
        }
        console.info('args >>>>> ', args)
        connection.query(sql, args || [], (err, results) => {
          connection.release();
          if (err) {
            reject (err)
            return
          }
          // console.info('results >>>>> ', results)
          resolve(results)
        })
      })
    })
    return queryPromise
  }
}

//var turned into promise when makeQuery executes
var findAllGroceries = makeQuery(sqlFindAllGroceries, pool)
var editGroceryDetails = makeQuery(sqlEditGroceryDetails, pool)
var addGroceryDetails = makeQuery(sqlAddGroceryDetails, pool)
var deleteGrocery = makeQuery(sqlDeleteGrocery, pool)
var findGrocerybySearchString = makeQuery(sqlFindGrocerybySearchString, pool)

////////////////////////////////////ROUTES////////////////////////////////////
////////////////////////////////////API FOR ANGULAR////////////////////////////////////
//GET all groceries or search string (angular)
app.get('/api/groceries', (req, res) => {
  console.info('query >>>>>', req.query)
  console.info('brand >>>>>', req.query.brand)
  console.info('name >>>>>', req.query.name)
  if(!req.query.brand.trim() && !req.query.name.trim()){
    findAllGroceries().then ((results) => {
      let finalResult = []
      results.forEach((element) => {
        let value = { brand: "", name: "", upc12: 0, id: 0 }
        value.brand = element.brand
        value.name = element.name
        value.upc12 = element.upc12
        value.id = element.id
        finalResult.push(value)
      })
      console.info('finalResult: ', finalResult)
      res.json(finalResult)
    }).catch((error) => {
      console.info(error)
      res.status(500).json(error)
    })
  }
  else {
    findGrocerybySearchString([req.query.brand,
                            req.query.name]).then ((results) => {
      let finalResult = []
      results.forEach((element) => {
        let value = { brand: "", name: "", upc12: 0, id: 0 }
        value.brand = element.brand
        value.name = element.name
        value.upc12 = element.upc12
        value.id = element.id
        finalResult.push(value)
      })
      console.info('finalResult: ', finalResult)
      res.json(finalResult)
    }).catch((error) => {
      console.info(error)
      res.status(500).json(error)
    })
  }
})

//EDIT one grocery
app.put('/api/groceries/edit', bodyParser.json(), bodyParser.urlencoded(), (req, res) => {
  console.info('body >>>>>', req.body);
  editGroceryDetails([req.body.brand, req.body.name, req.body.upc12, req.body.id]).then ((results) => {
    res.json(results)
  }).catch((error) => {
    console.info(error)
    res.status(500).json(error)
  })
})

//ADD one grocery
app.post('/api/groceries/add', bodyParser.json(), bodyParser.urlencoded(), (req, res) => {
  console.info('body >>>>>', req.body);
  addGroceryDetails([req.body.brand, req.body.name, req.body.upc12]).then ((results) => {
    res.json(results)
  }).catch((error) => {
    console.info(error)
    res.status(500).json(error)
  })
})

//DELETE one grocery
app.post('/api/groceries/delete', bodyParser.json(), bodyParser.urlencoded(), (req, res) => {
  console.info('body >>>>>', req.body);
  deleteGrocery([req.body.id]).then ((results) => {
    res.json(results)
  }).catch((error) => {
    console.info(error)
    res.status(500).json(error)
  })
})

////////////////////////////////////LISTEN////////////////////////////////////
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000
app.listen(PORT, () => {
  console.info(`Application started on port ${PORT} on ${new Date()}`)
})