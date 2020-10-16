require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./moviedex.json')

const app=express();
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

app.get('/movie', function handleSortMovie(req,res) {
    let response = MOVIEDEX.movies

    if(req.query.genre){
        reponse=response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    if(req.query.country){
        response=response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    let averageVote=req.query.avg_vote.parseInt();
    if(averageVote){
        response=reponse.filter(movie =>
            (movie.avg_vote>=averageVote))
    }
    res.json(response)
})

const PORT=8001

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})