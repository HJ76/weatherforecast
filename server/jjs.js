const express = require('express');
const cors = require('cors');

const app = express();

var request = require('request');

// automatically allow cross-origin requests
app.use(cors({origin: true}));

// build your endpoints here.
app.get('/:location', (req, res, next) => {
    var woeid = "";
    var options = {
        url: `https://www.metaweather.com/api/location/search/?query=${req.params.location}`,
        headers: {
            'content-type': 'application/json'
        }
    };
    function callback(error, response, body) {
        if(!error && response.statusCode === 200 ) {
            var data = JSON.parse(body);
            if(data.length !== 0) {
                request({
                    url: `https://www.metaweather.com/api/location/${data[0].woeid}`,
                    headers: {
                        'content-type': 'application/json'
                    }
                }, (error2, response2, body2) => {
                    if(JSON.parse(body).length === 0) res.send({
                        message: "invalid location"
                    })
                    else if(!error2 && response2.statusCode === 200) res.send(JSON.parse(body2));
                    else res.send("Something wrong");
                });
            }
            else res.send({
                message: "invalid location"
            });
            return
        }
        res.send({
            message: "something went wrong",
            "error": error
        });
    }
    request(options, callback);
});


app.listen(3000);
// // expose Express API as a single cloud function:
// exports.api = functions.https.onRequest(app);