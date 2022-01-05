const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");
const Jimp = require("jimp");

// Main functionality - marked as 'async' to allow 'await'
async function getCams() {
  // Date and Time Formatting
  const dateOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  };
  let now = new Date();
  let timestamp = now.toLocaleDateString("en-US", dateOptions);

  console.log(`Started creating cam list at ${timestamp}`);

  // Image Config Options
  const thumbnailWidth = 300;
  const thumbnailHeight = 169;
  const thumbnailQuality = 60;
  const fullsizeWidth = 1280;
  const fullsizeHeight = 720;
  const fullsizeQuality = 70;

  // Create File Paths
  const compressedDirectory = path.join(__dirname, "compressed");
  const fullsizeDirectory = path.join(__dirname, "fullsize");
  const uploadDirectory = path.join(__dirname, "uploads");

  // Load YAML list of cams
  //const webcamYaml = await fs.readFile("/root/node-feed-thumbnailer/webcams.yaml", "utf8");
  const webcamYaml = await fs.readFile("webcams.yaml", "utf8");
  const webcamList = yaml.load(webcamYaml);

  console.log(`Loaded list of ${webcamList.length} cams.`);

  
  for (let i = 0; i < webcamList.length; i++) {
    const webcam = webcamList[i];
    let fetchedImage;

    try {
      // wrap 'await' with try-catch
      fetchedImage = await Jimp.read(webcam["URL"]);

      console.log(`Fetched ${webcam["Name"]}, resizing and saving, ${i + 1} of ${webcamList.length}`);

      if (fetchedImage) {

        await fetchedImage
          .resize(fullsizeWidth, fullsizeHeight)
          .quality(fullsizeQuality)
          .writeAsync(
            `${fullsizeDirectory}/${webcam["Name"]}_${fullsizeWidth}x${fullsizeHeight}.jpg`
          );

          await fetchedImage
          .resize(thumbnailWidth, thumbnailHeight)
          .quality(thumbnailQuality)
          .writeAsync(
            `${compressedDirectory}/${webcam["Name"]}_${thumbnailWidth}x${thumbnailHeight}.jpg`
          );
      }
    } catch (error) {
      console.error(`Error fetching ${webcam["Name"]} at url ${webcam['URL']}`, error);
    }
  }


  // read uploaded files from disk
  let uploadFiles;
  try {
    uploadFiles = await fs.readdir(uploadDirectory);
  } catch (error) {
    console.error("Unable to scan directory:", error);
  }
  console.log(`Found ${uploadFiles.length} pushed uploaded image files locally.`);

  for (let i = 0; i < uploadFiles.length; i++) {
    const uploadFile = uploadFiles[i];
    const uploadSlice = uploadFile.slice(0, -4);
    await Jimp.read(`${uploadDirectory}/${uploadFile}`)
      .then((image) => {
        return image
        .resize(fullsizeWidth, fullsizeHeight)
        .quality(fullsizeQuality)
        .writeAsync(
          `${fullsizeDirectory}/${uploadSlice}_${fullsizeWidth}x${fullsizeHeight}.jpg`
        ).then((image) => {
          return image
          .resize(thumbnailWidth, thumbnailHeight)
          .quality(thumbnailQuality)
          .writeAsync(
            `${compressedDirectory}/${uploadSlice}_${thumbnailWidth}x${thumbnailHeight}.jpg`
          );
        })
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // read image files from disk
  let files;
  try {
    files = await fs.readdir(compressedDirectory);
  } catch (error) {
    console.error("Unable to scan directory:", error);
  }

  console.log(`Found ${files.length} image files locally.`);

  // collect all cam images
  const imageObjects = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Get when the file was last updated and push to imageObjects array
    const stats = await fs.stat(`${compressedDirectory}/${file}`);
    const mtime = stats.mtime;
    const localTime = mtime.toLocaleDateString("en-US", dateOptions);

    // Transpose Fullsize into feed
    const camName = file.slice(0, -12);
    const fullSize = `${camName}_${fullsizeWidth}x${fullsizeHeight}.jpg`;

    imageObjects.push({
      name: camName,
      lastUpdated: localTime,
      imageURL: `/compressed/${file}`,
      fullsizeURL: `/fullsize/${fullSize}`,
    });
  }

  // save cam image list to disk
  const data = JSON.stringify(imageObjects, null, 2);
  try {
    //await fs.writeFile("/root/node-feed-thumbnailer/feed/cams.json", data, "utf8");
    await fs.writeFile("feed/cams.json", data, "utf8");
  } catch (error) {
    console.log(`Error writing file: ${error}`);
  }

  now = new Date();
  timestamp = now.toLocaleDateString("en-US", dateOptions);
  console.log(`Saved cam list at ${timestamp}`);
  return;
}

getCams();
