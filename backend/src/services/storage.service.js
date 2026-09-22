const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName) {
  const result = await imagekit.upload({
    file: file, // multer.memoryStorage() ka buffer
    fileName: fileName, // image name
    // folder: "mama", // optional
  });

  return result; //return the URL of the uploaded file
}

module.exports = {
  uploadFile,
};
