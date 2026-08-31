const fs = require('fs');
const path = require('path');

const dir = 'C:\\Downloaded Web Sites\\oravo-template.webflow.io';

const colorMap = {
    // Primary Blues -> Primary Orange
    '#0452ff': '#F97316',
    '#0082f3': '#F97316',
    '#1e5aff': '#F97316',
    '#3898ec': '#F97316',
    
    // Hover Blue -> Hover Orange
    '#4e8fff': '#EA580C',
    
    // Dark Accents / Icons -> Dark Orange / Accent
    // If there were explicit blue icons, we map them to #F97316 or #C2410C
    // The user specified: "Blue Icons -> #F97316". So #0452ff is #F97316.
    
    // Light Blue -> Light orange background
    '#cce2f9': '#FFEDD5',
    
    // Very Light Blues / Grays -> Page Backgrounds
    '#c8f1ed': '#FFF7ED', // Main page background
    '#e9edf0': '#FFF3E8', // Subtle card background
    
    // Dark texts / headings -> #1F2937
    '#060c16': '#1F2937',
    '#000000': '#1F2937',
    '#000': '#1F2937',
    '#333333': '#1F2937',
    '#333': '#1F2937',
    '#222222': '#1F2937',
    '#222': '#1F2937',
    
    // Gray texts -> #475569
    '#758696': '#475569',
    '#5d6c7b': '#475569',
    '#8f9197': '#475569',
    '#999999': '#475569',
    '#999': '#475569'
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

const hexRegex = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;

walk(dir, (filepath) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return console.error(err);
        
        let modified = false;
        const newData = data.replace(hexRegex, (match) => {
            const lowerMatch = match.toLowerCase();
            if (colorMap[lowerMatch]) {
                modified = true;
                return colorMap[lowerMatch];
            }
            return match;
        });
        
        if (modified) {
            fs.writeFile(filepath, newData, 'utf8', (err) => {
                if (err) console.error(err);
                else console.log(`Updated colors in ${filepath}`);
            });
        }
    });
});
