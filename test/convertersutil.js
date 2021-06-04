const fetch = require('node-fetch');
const { spawn } = require('child_process');
var Stream = require('stream');
const { createWriteStream } = require('fs');
const fileType = require('file-type');
const { pipeline } = require('stream');
const { promisify } = require('util');


const imageURL = "https://source.unsplash.com/OhKElOkQ3RE/2400x3600";
const filetosave = "./savedimage_orig.jpg";
const convert_type_1 = "from_stream.jpg";
const convert_type_2 = "from_stream_pipe.jpg";
const convert_type_3 = "from_buffer.jpg";
const streamPipeline = promisify(pipeline);
const streamMark = 'highWaterMark: 1024 * 1024'; // 1 mb size
const writeStream = createWriteStream(filetosave, { highWaterMark: 72000 });


var start_time, stage1, stage2, stage3;
var command = 'convert';

var convert_args = [
    "-",
    "-resize", "160x",
    "-resize", "x160<",
    "-gravity", "center",
    //"-crop", "640x360+0+0",  
    "+repage",
    "-"
];


async function start() {

    await fetch(imageURL, { streamMark })

        .then(async res => {
            start_time = process.hrtime();
            if (convertFromStream(res.body, usepipe = false)) { // expicit stream handling , backpressure
                convert_args[convert_args.length - 1] = convert_type_1;
                converterX('F', '', convert_args); // convert source file from stream saved to disk
                stage1 = process.hrtime(start_time);
            }
            else {
                console.log("custom: some error in stream ");
            }

            return res;
        }).catch(err => { console.log(err); })
        .then((res) => {
            start_time = process.hrtime();
            console.log('Using Pipeline for saving & converting');
            streamPipeline(res.body, writeStream);
            convert_args[convert_args.length - 1] = convert_type_2;
            converterX('F', '', convert_args); // convert source is file saved in disk
            stage2 = process.hrtime(start_time);

        }).catch(err => { console.log(err); });

    await fetch(imageURL, { streamMark })
        .then(res => res.buffer())
        .then(async buffer => {
            //const buffer = res.body.clone().buffer(); // buffer from response and to be used as input
            start_time = process.hrtime();
            convert_args[0] = "-";
            convert_args[convert_args.length - 1] = convert_type_3;
            converterX('B', buffer, convert_args);
            stage3 = process.hrtime(start_time);

        }).catch(err => {
            console.log("Error in buffer fetch :", err);
        });

    console.log('----------------------------------------------------------');
    console.log('use stream => expicit stream handling , backpressure :', stage1);
    console.log('use stream => Using Node feature of pipeline :', stage2);
    console.log('use buffer => Buffered & on the fly converter, no save in disk :', stage3);
    console.log('----------------------------------------------------------');
}

function convertFromStream(responseStream, usepipe) {
    console.log('type of step :', usepipe)
    if (!usepipe) {
        console.log('type of step in condition :', usepipe)
        responseStream.on('data', chunk => {
            const result = writeStream.write(chunk);

            if (!result) {
                responseStream.pause();
            }
        });
        responseStream.on('end', () => {
            writeStream.end();
        });
        writeStream.on('drain', () => {
            responseStream.resume();
            process.stdout.write(`${writeStream.bytesWritten}, bytes written \r`);

        });

        writeStream.on('close', () => {
            process.stdout.write(`\n[Success] File copied..\n`);
            //return true;
        });
        writeStream.stream.on('finish', () => {
            console.log('stream write finish');
        });

        writeStream.on('error', () => {
            process.stdout.write(`${error},' error writing the data'\r`);
            //return false;
        });

        responseStream.on('error', () => {
            process.stdout.write(`${error},' error reading the data'\r`);
            //return false;
        });

    }




}


function converterX(type, buffer, args) {
    console.log('call to converterX from : ', type);
    console.log("convert args :\n", args);
    var proc = spawn(command, args);
    var stream = new Stream();
    proc.stderr.on('data', stream.emit.bind(stream, 'error'));
    proc.stdout.on('data', stream.emit.bind(stream, 'data'));
    proc.stdout.on('end', stream.emit.bind(stream, 'end'));
    proc.on('error', stream.emit.bind(stream, 'error'));
    if (type != 'F') { // if response is a buffer
        proc.stdin.write(buffer);
        proc.stdin.end();
    }
    //proc.stdin.end();
}





void start();