const cloudinary = require('cloudinary').v2;
const {CLOUDINARY_CONFIG} = require('../config')


//config cloudinary
//Take a file as parameter
//check if file is image
//upload file to cloudinary
//return url
//save url to db
//await the image to load the page

// cloudinary.config({ 
//     cloud_name: 'dxuj1ywwo', 
//     api_key: '176966955323466', 
//     api_secret: 'TqLQvXyc9DbG4WA0Cq-ZrfOfCJI' 
//   });


cloudinary.config(CLOUDINARY_CONFIG)

cloudinary.uploader.upload('../../Desktop/Panquie-Churps/resources/images/cupcake.jfif', {secure: true, 
    transformation: [
    {width: 150, height: 150, gravity: "face", crop: "thumb"}]},
    function(error, result) {console.log(result, error)});
