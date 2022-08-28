const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const express = require('express')

const PORT = process.env.PORT || 8080
const app = express()
const assetSites = [
    {
        key: 1,
        name: 'Open-Game-Art',
        address: 'https://www.opengameart.org'
    },
    {
        key: 2,
        name: 'Kenney',
        address: 'https://kenney.nl/assets'
    },
    {
        key: 3,
        name: 'Itch.IO',
        address: 'https://itch.io/game-assets/free'
    }
]
const assets = []

function getAssets(assetSites) {

    assetSites.forEach(function (assetSite) {
        if (assetSite.key === 1) {
            axios.get(assetSite.address)
                .then(function (response) {
                    const html = response.data
                    console.log(html)
                    const $ = cheerio.load(html)
                    console.log($)
                    $('.art-preview-title', html).each(function () {
                        const url = `https://opengameart.org${$(this).find('a').attr('href')}`
                        const title = $(this).text()
                        assets.push({
                            title,
                            url,
                            source: assetSite.name
                        })
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else if (assetSite.key === 2) {
            axios.get(assetSite.address + `/page:${Math.floor(Math.random() * 11) + 1}`)
                .then(function (response) {
                    const html = response.data
                    console.log(html)
                    const $ = cheerio.load(html)
                    console.log($)
                    $('a.project', html).each(function () {
                        const url = $(this).attr('href')
                        const title = $(this).next('h3').text()
                        assets.push({
                            title,
                            url,
                            source: assetSite.name
                        })
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else if (assetSite.key === 3) {
            axios.get(assetSite.address)
                .then(function (response) {
                    const html = response.data
                    console.log(html)
                    const $ = cheerio.load(html)

                    $('div.game_cell_data > div.game_title', html).each(function () {
                        const title = $(this).text()
                        const url = $(this).find('a').attr('href')
                        assets.push({
                            title,
                            url,
                            source: assetSite.name
                        })
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else {
            console.log('nothing found')
        }

    })
}

app.get('/', function (request, response) {
    response.json('Welcome to a simple game asset provider, special thanks to opengameart.org, please visit and donate they have waaay more to offer than this little sparkly.')
})

app.get('/assets', function (request, response) {
    console.log("NEW ASSETS", assets)
    return response.json(assets)
})

app.listen(PORT, function () {
    console.log(`server running on port: ${PORT}`)
})