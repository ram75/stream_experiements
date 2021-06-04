const fetch = require('node-fetch');
const { spawn } = require('child_process');
var Stream = require('stream');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const { pipeline } = require('stream');
const { hrtime } = require('process');

const imageURL = "https://source.unsplash.com/OhKElOkQ3RE/2400x3600";
const filetosave = "./savedimage_orig.jpg";
const streamPipeline = promisify(pipeline);


var command = 'convert';
var args_buffer = [
    "-",                     // use stdin
    "-resize", "160x",
    "-resize", "x160<",
    "buffered_convert.jpg"   // output to stdout // temporary to be removed after response back to client
];

var args_stream = [
    filetosave,
    "-resize", "160x",
    "-resize", "x160<",
    "streamed_convert1.jpg"   // output to stdout
];

const p = new Promise((resolve, reject) => {
    resolve('ok')
})

async function start(p_time, conv) {

    const res = await fetch(imageURL) // Convert from stream

    const start_time = process.hrtime();
    let status = false;
    const imgData = await getData(res.body, conv);

    console.log('[STREAM explicit] :', process.hrtime(p_time));
}



const convertorX = async (type, buffer, args) => {
    try {
        var proc = spawn(command, args);
        var stream = new Stream();
        proc.stderr.on('data', stream.emit.bind(stream, 'error'));
        proc.stdout.on('data', (data) => {
            stream.emit.bind(stream, data);
        }
        );
        proc.stdout.on('end', stream.emit.bind(stream, 'end'));
        proc.on('error', stream.emit.bind(stream, 'error'));
        if (type == 'BUFFER') {
            proc.stdin.write(buffer);
            proc.stdin.end();
        }
     
    }
    catch (error) {
        console.log('ConvertX error:', error);
    }


}


//const downloadFile = (async (url, path,conv) => {
const getData = (async (responseStream, conv) => {
    try {
        const writeStream = createWriteStream(filetosave, { highWaterMark: 72000 });

        await new Promise((resolve, reject) => {
 
            responseStream.on('data', chunk => {
                if (!writeStream.write(chunk)) { responseStream.pause(); }

            });
            responseStream.on('end', () => { writeStream.end(); });
            writeStream.on('drain', () => { responseStream.resume(); });
            writeStream.on('finish', resolve, () => {
                writeStream.close(conv);
            });
            writeStream.on('close', resolve, () => {
                writeStream.close(conv);
            });
            writeStream.on('error', reject, () => {
                process.stdout.write(`${error},' error writing the data'\r`)

            });
            responseStream.on('error', reject, () => {
                process.stdout.write(`${error},' error reading the data'\r`)

            });

        });



    } catch (error) {
        console.log(error);
    }
});



void start(process.hrtime(), convertorX('FS', '', args_stream));
