const { readFileSync } = require("fs");
const { Transform, Writable } = require("stream");
const sharp = require("sharp");

const imageFilePath = readFileSync("./30mb.jpg");

class SizeCalculator extends Transform {
    constructor(options) {
        super(options);
        this.size = 0;
        this.count = 0;
    }
    _transform(chunk, encoding, callback) {
        console.log(++this.count); // count the chunks processed
        chunk && chunk.length && (this.size += chunk.length); // increment size by chunk.length` amount
        callback();
    }
    _flush(callback) {
        this.push(this.size.toString());
        callback();
    }
}

function getSize(image) {
    return new Promise(async (resolve, reject) => {
        const sizeTransform = new SizeCalculator(); // transform stream
        sizeTransform.on("finish", () => resolve(sizeTransform.size)); // listen to finish event
        image.pipe(sizeTransform); // readable | transform
    });
}

async function sharpTest() {
    let image = sharp(imageFilePath);
    console.log(await getSize(image)); // get cumulative size of all the chunks passed in _transform function
}

sharpTest();