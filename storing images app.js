const express = require('express')
const fileUpload = require('express-fileupload')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const fs = require('fs')
const path = require('path')

const url = 'mongodb://127.0.0.1:27017/image-upload'
const port = 3000
const app = express()

const publicdir = path.join(__dirname, '../public')
app.use(express.static(publicdir))
app.use(fileUpload())

app.post('/upload', (req, res) => {
    if(!req.files) {
        return res.send({Error: 'Please select an image'})
    }

    let sampleFile = req.files.sampleFile
    let filename = req.query.name
    let imagesfolder =  './public/images/'
    let fileextension = req.files.sampleFile.name.split('.')[1]
    
    sampleFile.mv(imagesfolder + filename + '.'+ fileextension, function (err) {
        if (err) { return console.log(err) }
        let newData = {
            name: filename,
            path: './images/' + filename + '.' + fileextension
        }

        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            assert.equal(null, err)
    
            const myAwesomeDB = db.db('image-upload')
            myAwesomeDB.collection('image-details').deleteOne({name: filename}, function(err, ress) {
                if(err) { return console.log(err) }
            })

            myAwesomeDB.collection('image-details').insertOne(newData, function(err, result) {
                if (err) { return console.log(err) }
            })
        })

        res.send({Result: 'Successfully uploaded'})
    })
})