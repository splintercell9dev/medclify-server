const express = require('express') ;
const multer = require('multer') ;
const tf = require('@tensorflow/tfjs-node') ;
const sharp = require('sharp');
const cors = require('cors') ;
const storage_options = multer.memoryStorage() ;
const upload = multer({ storage: storage_options }) ;
const database = require('./plant_database.json') ;
const { PlantLessInfo } = require('./class_structure') ;
const path = require('path') ;
const app = express() ;
const port = 3000 || process.env.PORT ;

app.use(cors());
app.use(express.json()) ;
app.use(express.urlencoded({extended: true})) ;
app.use(express.static(path.join(__dirname, 'public'))) ;

let model ;

function log(msg){
    console.log(msg) ;
}

async function loadModel(){
    try{
        model = await tf.node.loadSavedModel('./model/tf_saved_model') ;
        log('Model Loaded') ;
    }
    catch(err){
        log(err) ;
    }
}

// decoding prediction array
function getClassIndex(pred){
    return tf.argMax(pred).dataSync()[0] ;
}

// decode image to float array
function imgToFloatArray(buff){
    const decoded = [] ;
    let h, w, line, pixel, b = 0 ;
 
    for(h = 0 ; h< 224; h++){
       line = [] ;
       for(w = 0 ; w< 224; w++){
          pixel = [] ;
 
          pixel.push(buff[b++] / 255.0) 
          pixel.push(buff[b++] / 255.0) 
          pixel.push(buff[b++] / 255.0)
 
          line.push(pixel) ;
       }
       decoded.push(line) ;
    }
    return decoded ;
}

// predicting the class of the plant image
async function classify(buffer){
    const img = await sharp(buffer).resize(224,224).raw().toBuffer() ;
    const float_array = imgToFloatArray(img) ;
    const input = tf.tensor3d(float_array, [224,224,3], 'float32') ;
    const expanded_img = tf.expandDims(input, 0) ;
    const predictions = await model.predict(expanded_img) ;
    const index = getClassIndex(predictions.dataSync()) ;
    const limited_data = new PlantLessInfo(database[index], index) ;
    return limited_data ;
}

loadModel()

app.post('/api/classify', upload.single('image'), (req, res) => {
    const file = req.file ;
    if (file){
        classify(req.file.buffer).then( result => {
            res.status(200).json(result) ;
        }).catch(err => {
            res.status(400).json({
                message: 'Classification Error Occurred!'
            }) ;
        }) ;
    }
    else{
        log('file error')
        res.status(404).json({
            message: 'Error while Uploading File!'
        }) ;
    }
}) ;

app.get('/api/species/:index', (req, res) => {
    const index = parseInt(req.params.index) ;
    if ( !isNaN(index) || (index > 0 && index < 43)){
        const data = database[index] ;
        res.status(200).json(data) ;
    }
    else{
        res.status(404).json({
            messsage: 'Plant data not found!'
        }) ;
    }
}) ;

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html')) ;
})

app.listen(port, () => {
    console.log('Listening to the port')
}) ;