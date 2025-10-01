// run-typograf.js

const fs = require('fs');
const Typograf = require('typograf');
// THE FIX: We now specifically import the 'glob' function from the library.
const { glob } = require('glob');

const tp = new Typograf({ locale: ['ru', 'en-US'] });

// Use an async function to correctly handle the 'await' for glob
async function processFiles() {
  try {
    // This now waits for glob to finish and returns the list of files
    const files = await glob('docs/**/*.md');

    files.forEach(file => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}:`, err);
          return;
        }
        console.log(`Processing typography for: ${file}`);
        const correctedText = tp.execute(data);
        fs.writeFile(file, correctedText, 'utf8', err => {
          if (err) console.error(`Error writing file ${file}:`, err);
        });
      });
    });
  } catch (err) {
    console.error('An error occurred while finding files:', err);
  }
}

// Run the main function
processFiles();