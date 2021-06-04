const { spawn } = require('child_process');


function convertImage(resolution, userId) {
    const filetosave = `./image/${userId}-user.jpg`;
    const output = `${userId}-convert.jpg`;
    const data = resolution;
    const indexOfData = data.indexOf("x");
    const resolutionSuffix = data.slice(0, indexOfData);
    const resolutionPrfix = data.slice(indexOfData);
    const command = "convert";
    const args = [
        filetosave,
        "-resize", resolutionSuffix,
        "-resize", `${resolutionPrfix}<`,
        output   // output to stdout
    ];

    const child = spawn(command, args);
    console.log(args);

    child.stdout.on("data", function (data) {
        console.log("stdout: " ,data);
    });
    child.stderr.on("data", function (data) {
        console.log(`stderr: ${data}`);
    });
    child.on("close", function (code) {
        console.log("closing code: " , code);
    });

}

void convertImage('640x640',1);