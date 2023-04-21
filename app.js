require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const SpotifyWebApi = require('spotify-web-api-node')


const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))




 // Our routes go here:
app.get('/', async(request, response) => {
  response.render('home')
})

app.get('/artist-search', (request, response) => {
  const artistName = request.query['artist-name'];
  
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      console.log('The received data from the API: ', data.body)
      const artistArray = data.body.artists.items;
      response.render(`/artist-search-results`, {artistArray});
    })
  
});

app.get('/albums/:artistId', (request, response, next) => {
  const artistId = request.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const albums = data.body.items;
      response.render('albums', { albums });
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

 app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'))
