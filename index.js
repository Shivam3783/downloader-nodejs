// const express = require('express');
// const path = require('path');
// const app = express();
// const fs = require('fs').promises;

// // Existing routes...
// const PORT = 3000;


// app.use(express.static(path.join(__dirname, 'public')));

// // Updated path to serve static files from /Users/shivampatel/Downloads
// // app.use('/files', express.static(path.join('/Users', 'shivampatel', 'Downloads')));



// // Serve the HTML file at the root endpoint
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // app.get('/', function(req, res){
// //     console.log( "ipconfig getifaddr en0 to see wifi address")
// //     //http://192.168.29.98:3000/download/IMG_5441.MOV
// //     res.send("WOrking")

// // });



// // New route to list files in /Users/shivampatel/Downloads
// app.get('/api/files', async (req, res) => {
//     const directoryPath = path.join('/Users', 'shivampatel', 'Downloads');
//     try {
//         const files = await fs.readdir(directoryPath);
//         res.json(files);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching files' });
//     }
// });


// // Route to initiate file download remains unchanged
// app.get('/download/:filename', function(req, res){
//     const filename = req.params.filename;
//     // Updated file location to match the new directory
//     const fileLocation = path.join('/Users', 'shivampatel', 'Downloads', filename);
//     res.download(fileLocation); // Set disposition and send it.
// });


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');


const app = express();
const port = 3000;
function getIPAddress() {
    try {
        const stdout = execSync('ipconfig getifaddr en0').toString();
        return stdout.trim();
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
        return null;
    }
}

// Example usage
const ipAddress = getIPAddress();
console.log(`IP Address: ${ipAddress}`);


// Utility function to recursively get all files in a directory and its subdirectories
async function getFilesRecursive(dir) {
    let files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files = files.concat(await getFilesRecursive(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// New route to list files in /Users/shivampatel/Downloads, including subdirectories
app.get('/api/files', async (req, res) => {
    const directoryPath = path.join('/Users', 'shivampatel', 'Downloads');
    try {
        const files = await getFilesRecursive(directoryPath);
        // Return relative paths from the Downloads directory for proper download links
        const relativeFiles = files.map(file => path.relative(directoryPath, file));
        res.json(relativeFiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching files' });
    }
});

// Route to initiate file download
app.get('/download/:filename', function(req, res){
    const filename = req.params.filename;
    const fileLocation = path.join('/Users', 'shivampatel', 'Downloads', filename);
    res.download(fileLocation, (err) => {
        if (err) {
            console.error('File download error:', err);
            res.status(500).send('Error downloading file');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    // console.log(`IP Address: ${ipAddress}`);

});

