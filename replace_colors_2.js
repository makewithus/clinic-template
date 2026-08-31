const fs = require('fs');
const path = require('path');

const dir = 'C:\\Downloaded Web Sites\\oravo-template.webflow.io';

const exactReplace = {
    '#eaf2ff': '#ffedd5',
    '#3b79c3': '#f97316',
    '#060c161a': '#1f29371a',
    '#1e5aff0f': '#f973160f',
    '#75869600': '#47556900'
};

function walk(directory, callback) {
    fs.readdir(directory, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            const filepath = path.join(directory, file);
            fs.stat(filepath, (err, stats) => {
                if (err) return console.error(err);
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                } else if (stats.isFile()) {
                    const ext = path.extname(file).toLowerCase();
                    if (['.html', '.htm', '.css', '.svg'].includes(ext)) {
                        callback(filepath);
                    }
                }
            });
        });
    });
}

walk(dir, (filepath) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return console.error(err);
        
        let newData = data;
        let modified = false;
        
        for (const [oldColor, newColor] of Object.entries(exactReplace)) {
            const regex = new RegExp(oldColor, 'gi');
            if (regex.test(newData)) {
                newData = newData.replace(regex, newColor);
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFile(filepath, newData, 'utf8', (err) => {
                if (err) console.error(err);
                else console.log(`Updated colors in ${filepath}`);
            });
        }
    });
});
