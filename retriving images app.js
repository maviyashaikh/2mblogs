app.get('/loadpicture', (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        assert.equal(null, err)

        const myAwesomeDB = db.db('image-upload')
        let coll = myAwesomeDB.collection('image-details')
        coll.countDocuments().then((count) => {
            if(count!=0) {
                myAwesomeDB.collection('image-details').find({}).toArray(function(err, result) {
                    res.send(result)
                })
            }
        })
    })
})
