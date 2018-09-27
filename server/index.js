////////////////////////////////////LIBRARIES////////////////////////////////////
require('dotenv').config()
const express = require('express')
const hbs = require('express-handlebars')
const mysql = require("mysql")
const cors = require('cors')

////////////////////////////////////METHODS////////////////////////////////////
//express
const app = express()

//cors
app.use(cors())

//handlebars
app.engine('handlebars', hbs({ defaultLayout: 'index'}))
app.set('view engine', 'handlebars')

//sql
const sqlFindAllFilms = "SELECT film_id, title, description FROM film"
const sqlFindFilmbyId = "SELECT * FROM film WHERE film_id=?"
const sqlFindFilmbySearchString = "SELECT film_id, title, description FROM film WHERE (title LIKE ?) || (description LIKE ?)"
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
var findAllFilms = makeQuery(sqlFindAllFilms, pool)
var findFilmbyId = makeQuery(sqlFindFilmbyId, pool)
var findFilmbySearchString = makeQuery(sqlFindFilmbySearchString, pool)

////////////////////////////////////ROUTES////////////////////////////////////
//GET one film by Id (params)
app.get('/films/:filmId', (req, res) => {
  console.info('params >>>>>', req.params);
  findFilmbyId([parseInt(req.params.filmId)]).then ((results) => {
    res.json(results)
  }).catch((error) => {
    console.info(error)
    res.status(500).json(error)
  })
})

//GET one film by Id (querystring) or all films if there is no querystring
app.get('/films', (req, res) => {
  console.info('query >>>>>', req.query)
  console.info('query.filmId >>>>>', req.query.filmId)
  if(typeof(req.query.filmId) === 'undefined'){
    findAllFilms().then ((results) => {
      let finalResult = []
      results.forEach((element) => {
        let value = { title: "", url: null }
        value.title = element.title
        value.url = `/films/${element.film_id}`
        finalResult.push(value)
        // finalResult.push({ title: element.title, url: `/films/${element.film_id}` })
      })
      res.json(finalResult)
    }).catch((error) => {
      console.info(error)
      res.status(500).json(error)
    })
  }
  else {
    findFilmbyId([parseInt(req.query.filmId)]).then ((results) => {
      res.json(results)
    }).catch((error) => {
      console.info(error)
      res.status(500).json(error)
    })
  }
})

////////////////////////////////////API FOR ANGULAR////////////////////////////////////
//GET all films or search string (angular)
app.get('/api/films', (req, res) => {
  console.info('query >>>>>', req.query)
  console.info('title >>>>>', req.query.title)
  console.info('description >>>>>', req.query.description)
  if(!req.query.title.trim() && !req.query.description.trim()){
    findAllFilms().then ((results) => {
      let finalResult = []
      results.forEach((element) => {
        let value = { title: "", description: "", url: null }
        value.title = element.title
        value.description = element.description
        value.url = `/films/${element.film_id}`
        finalResult.push(value)
        // finalResult.push({ title: element.title, description: element.description, url: `/films/${element.film_id}` })
      })
      console.info('finalResult: ', finalResult)
      res.json(finalResult)
    }).catch((error) => {
      console.info(error)
      res.status(500).json(error)
    })
  }
  else {
    findFilmbySearchString([req.query.title,
                            req.query.description]).then ((results) => {
      let finalResult = []
      results.forEach((element) => {
        let value = { title: "", description: "", url: null }
        value.title = element.title
        value.description = element.description
        value.url = `/films/${element.film_id}`
        finalResult.push(value)
        // finalResult.push({ title: element.title, description: element.description, url: `/films/${element.film_id}` })
      })
      console.info('finalResult: ', finalResult)
      res.json(finalResult)
    }).catch((error) => {
      console.info(error)
      res.status(500).json(error)
    })
  }
})
//GET one film by Id (params)
app.get('/api/films/:filmId', (req, res) => {
  console.info('params >>>>>', req.params);
  findFilmbyId([parseInt(req.params.filmId)]).then ((results) => {
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