require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const paginate = require('express-paginate');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index')
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.name)
        .then(data => {
            res.render('artist-search-results', {listOfArtists: data.body.artists.items})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(function (data) {
            res.render('albums', { albumData: data.body.items })
        })
            
        .catch(err => console.log('The error while searching album occurred: ', err));
})

    
app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(function (data) {
            res.render('tracks', { trackData: data.body.items })
        })

        .catch(err => console.log('The error while searching album occurred: ', err));
})



app.listen(3100, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));