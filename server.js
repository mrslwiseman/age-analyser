const express = require('express');
const app = express();
const request = require('request');
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser')

if (app.get('env') !== 'production') {
    require('dotenv').config();
}
// truncate the mime type from base64 string keep the API happy
const parseBase64 = (req,res, next) => {
    const b64 = req.body.base64;
    const truncated = b64.slice(22,b64.length)
    req.data = {
        base64: truncated
    }
    next();
}
// handle webcam shots
app.post('/base64', bodyParser(), parseBase64, (req, res, next) => { 

    const url = 'https://api-us.faceplusplus.com/facepp/v3/detect';
   
    const formData = {
        api_key: process.env.FACEPP_API_KEY,
        api_secret: process.env.FACEPP_API_SECRET,
        image_base64: req.data.base64
    };
    const options = {
        uri: url,
        method: 'POST',
        formData : formData
    }
    request(options, (err, response, body) => {
        if (err) next();
        const data = JSON.parse(body);
        const faces = data.faces
        if(faces){
            res.json(faces[0])
        } else {
            next()
        }
    })    
})

// handling uploading of a file
app.post('/', upload.any(), (req, res) => {
    const url = 'https://api-us.faceplusplus.com/facepp/v3/detect';

    console.log('Image upload complete, creating request to: ' + url);

    var formData = {
        api_key: process.env.FACEPP_API_KEY,
        api_secret: process.env.FACEPP_API_SECRET,
        image_file: {
            value: req.files[0].buffer, // Upload the first file in the multi-part post
            options: {
               filename: 'image_file'
            }
      }
    };

    const options = {
        uri: url,
        formData: formData,
        method: 'POST'
    }

    request(options, (err, response, body) => {
        console.log('Request complete');
        if (err) console.log('Request err: ', err);
        console.log(response.statusCode)
        res.json(body)
    })     
})

// detected a face, now lets analyse it.
app.get('/analyse/:token', (req,res, next) => {
    const token = req.params.token;
    console.log('received token %s', token);
    const url = 'https://api-us.faceplusplus.com/facepp/v3/face/analyze';
    const options = {
        uri: url,
        method: 'POST',
        formData: {
            api_key: process.env.FACEPP_API_KEY,
            api_secret: process.env.FACEPP_API_SECRET,
            face_tokens: token,
            return_attributes: 'gender,age,smiling,headpose,emotion,ethnicity,beauty,eyegaze,skinstatus'
        }
    }

    request(options, (err, response, body) => {
        if (err) next();
        const data = JSON.parse(body);
        const attributes = data.faces[0].attributes;
        if(attributes){
            res.json(attributes)
        } else {
            next(); // pass onto error handler
        }
    })     
})


// handle errors
app.use((err, req, res, next) => {
    console.log('Error handler');
    console.log(err)
    res.status(500);
    res.json(err);
    res.end();
})


app.set('port', process.env.PORT || 5000)

const server = app.listen(app.get('port'), () => console.log('server listening: ' + server.address().port));