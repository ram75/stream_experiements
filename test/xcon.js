

const fetch = require("node-fetch");
const { spawn } = require('child_process');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const { pipeline } = require('stream');
const { hrtime } = require('process');

const filetosave = './dowloaded-orig.jpg';
const imageURL = "https://source.unsplash.com/OhKElOkQ3RE/2400x3600";
const command ='convert';
var Stream = require('stream');
var args_stream = [
  filetosave,
  "-resize", "160x",
  "-resize", "x160<",
  "streamed_convert.jpg"   // output to stdout
];


const downloadFile = (async (url, path,conv) => {
    const res = await fetch(url);
    const fileStream = createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve, function() {fileStream.close(conv)});
      });
  });


  const convertorX = async (type, buffer, args) => {
    try {
        var proc = spawn(command, args);
        var cs = new Stream();
        proc.stderr.on('data', cs.emit.bind(cs, 'error'));
        proc.stdout.on('data', (data) => {
        cs.emit.bind(cs, data);
        });
        proc.stdout.on('end', cs.emit.bind(cs, 'end'));
        proc.on('error', cs.emit.bind(cs, 'error'));
        if (type == 'BUFFER') {
            proc.stdin.write(buffer);
            proc.stdin.end();
        }
    }
    catch (error) {
        console.log('ConvertX error:', error);
    }
}




async function main() {
const st =  process.hrtime()
const streamPipe = await downloadFile(imageURL,filetosave,convertorX('FS', '', args_stream))
console.log("[STREAM PIPE]",process.hrtime(st))

}

void main();



/*
node xcon
sleep 2
node xconveter.js
sleep 2
*/
