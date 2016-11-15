var Buffer = require('buffer').Buffer;
var jpeg = require('jpeg-js');
var fs = require('fs-extra');
var path = require('path');
var uuid = require('uuid');

/**
 * Generates an random colored image with specified width, height and quality
 * @param width width of the image
 * @param height height of the image
 * @param quality quality of the image
 * @param callback callback
 */
function generateImage(width, height, quality, callback) {

    var frameData = new Buffer(width * height * 4);
    var i = 0;
    while (i < frameData.length) {
        frameData[i++] = Math.floor(Math.random() * 256);
    }
    var rawImageData = {
        data: frameData,
        width: width,
        height: height
    };
    var jpegImageData = jpeg.encode(rawImageData, quality);

    if (jpegImageData) {
        callback(null, jpegImageData);
    }
};

/**
 * Generates a random colored image and file name and saves to path provided (or /tmp/img/ by default)
 * @param width width of the image
 * @param height height of the image
 * @param quality quality of the image
 * @param directory where image will be saved, or /tmp/img by default
 * @param callback callback
 */
function generateSaveImage(width, height, quality, outputDir, callback) {
    var pathToFile = outputDir || '/tmp/img/';
    var fileName = uuid.v4() + '.jpg';
    var fullImagePath = path.resolve(pathToFile, fileName);

    try {
        generateImage(width, height, quality, function (err, image) {
            fs.outputFile(fullImagePath, image, function (err) {
                if (err) return callback(err);
                callback(null, fullImagePath);
            })
        })
    } catch (e) {
        callback(e.message);
    }

}

module.exports = {
    generateImage: generateImage,
    generateSaveImage: generateSaveImage
};