const fs = require('fs');
const path = require('path');

const DIRECTORY_TO_SCAN = '.'; 
const OUTPUT_FILE = 'compiled_repo.txt';

const IGNORE_DIRS = ['node_modules', '.next', '.git', 'public'];
const IGNORE_FILES = ['package-lock.json', OUTPUT_FILE, 'compile.js', 'compile.py'];
const INCLUDE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'];

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            if (!IGNORE_FILES.includes(file) && INCLUDE_EXTENSIONS.includes(path.extname(file))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(DIRECTORY_TO_SCAN);
let outputContent = '';

files.forEach(file => {
    const displayPath = file.replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    outputContent += `${displayPath}\n${content}\n\n`;
});

fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf8');
console.log(`Successfully compiled ${files.length} files into ${OUTPUT_FILE}`);