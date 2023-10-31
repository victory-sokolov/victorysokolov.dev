import fs from "fs";
import path from "path";

const fsPromises = fs.promises;
const imagesDirs = ["content/posts", "content/tips"];
const extensisons = [".png", ".jpg", ".svg", "webp"];
const publicPath = path.join(process.cwd(), "public");

const getDirectories = path => {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + "/" + file).isDirectory();
    });
};

const getAllImagesInDirectory = async (directory: string) => {
    const files = await fsPromises.readdir(directory);
    return files.filter(file => endsWithAny(file));
};

const endsWithAny = (data: string) => {
    return extensisons.some(element => data.endsWith(element));
};

export default (async () => {
    const publicPosts = `${publicPath}/posts`;
    if (!fs.existsSync(publicPosts)) {
        fs.mkdirSync(publicPosts);
    }
    // Get all images from posts and tips folder
    imagesDirs.forEach(async folder => {
        const subDirectories = getDirectories(folder);
        for await (const dir of subDirectories) {
            const images = await getAllImagesInDirectory(`${folder}/${dir}`);

            for (const image of images) {
                const sourcePath = path.join(process.cwd(), `${folder}/${dir}/${image}`);
                const destinationPath = `${publicPath}/${folder.split("/")[1]}/${dir}`;
                const destFile = `${destinationPath}/${image}`;
                if (!fs.existsSync(destinationPath)) {
                    fs.mkdirSync(destinationPath);
                }
                console.info(`\x1b[32m 🚀 Moving image from ${sourcePath} to ${destFile}`);
                fs.copyFileSync(sourcePath, destFile);
            }
        }
    });
})();
