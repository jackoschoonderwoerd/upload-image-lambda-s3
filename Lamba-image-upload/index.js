const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const getFileMime = require('getFileMime');


exports.handler = function (event, context, callback) {

    let request = event.readerResult.split(',')[1];
    let fileName = event.fileName;

    const fileMime = getFileMime.getFileMime(event.readerResult).toString();
    console.log('mymetype: ', fileMime);
    if( fileMime !== 'image/jpeg' && fileMime !== 'image/png') {
        callback(null, `invalid file type ${fileMime}`);
    }
    // pass the base64 string into a buffer
    let buffer = new Buffer.from(request, 'base64');
    
    // check if the base64 encoded string is a file
    if (fileMime === null) {
        callback(null, 'The string supplied is not a file type');
        return context.fail('The string supplied is not a file type');
    } else {
        // callback(null, 'The string supplied IS a file type');
        console.log('The string supplied IS a file type');
    }
    const params = {
        Body: buffer,
        Bucket: 'upload-to-s3-jacko',
        Key: `${Date.now()} - ${fileName}`, // must be a path within your bucket and not an url like you have in fileFullPath,
        Metadata: {
            'Content-Type': fileMime // Sets the content type header, without this your browser cannot infer the type (browsers use mime types, not file extensions)
        },
        ACL:'public-read' // Sets permissions for this particular image in s3
    };

    s3.upload(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        }
        callback(null, data);
    });
};
