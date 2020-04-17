const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const moment = require('moment');
const fileType = require('file-type');
const sha1 = require('sha1');
const multipart = require('parse-multipart');

exports.handler = function (event, context, callback) {

    let request = event.body;

    // get the request
    let base64String = request.base64String;

    // pass the base64 string into a buffer
    let buffer = new Buffer(base64String, 'base64');

    let fileMime = fileType(buffer);

    // check if the base64 encoded string is a file
    if (fileMime === null) {
        return context.fail('The string supplied is not a file type');
    }

    let file = getFile(fileMime, buffer);
    // let file = getFile(fileMime, parts);
    let params = file.params;

    s3.upload(params, function (err, data) {
    // putObject(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        }

        // if the file object is uploaded successfully to 
        // s3 then you can get your full url
        console.log('File URL', file.full_path + JSON.stringify(data));
        callback(null, data);

    });
}

let getFile = function (fileMime, buffer) {

    // get the file extension
    let fileExt = fileMime.ext;
    let hash = sha1(new Buffer(new Date().toString()));
    let now = moment().format('YYYY-MM-DD');

    let filePath = hash + '/';
    let fileName = now + '.' + fileExt;
    let fileFullName = filePath + fileName;
    let fileFullPath = 'https://console.aws.amazon.com/s3/buckets/bucket-name/images/' + fileFullName;

    console.log('fileFullPath' + fileFullPath);
    let params = {
        Bucket: 'bucket-name',
        Key: fileFullPath,
        // 'this is simply the filename and the extension, e.g fileFullName + fileExt',
        Body: buffer,
        ContentType: fileMime.mime
    };

    let uploadFile = {
        size: buffer.toString('ascii').length,
        type: fileMime.mime,
        name: fileName,
        full_path: fileFullPath
    }

    return {
        'params': params,
        'uploadFile': uploadFile
    }
}