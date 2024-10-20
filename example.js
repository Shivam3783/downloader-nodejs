//For REACTJS and manually example.html

// const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const os = require('os');
// const archiver = require('archiver');
// const cors = require('cors');
// app.use(cors());

// const port = 3001;

// // Serve the HTML file at the root endpoint
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'example.html'));
// });
// function getIpAddressesOfWIFI() {
//     const interfaces = os.networkInterfaces();
//     const ipAddresses = [];
  
//     for (const devName in interfaces) {
//       const iface = interfaces[devName];
//       for (let i = 0; i < iface.length; i++) {
//         const alias = iface[i];
//         if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
//           ipAddresses.push(alias.address);
//         }
//       }
//     }
  
//     return ipAddresses;
//   }
  

// const ipAddresses = getIpAddressesOfWIFI();
// // console.log(ipAddresses);


// const ignoredDirs = ['node_modules', '.git', 'bin', 'lib', 'build', '.next','desktop_pc'];

// function getDirectoryStructure(srcpath) {
//     const items = fs.readdirSync(srcpath).filter(item => !ignoredDirs.includes(item));

//     return items.map(item => {
//         const fullPath = path.join(srcpath, item);
//         if (fs.statSync(fullPath).isDirectory()) {
//             return {
//                 name: item,
//                 type: 'directory',   
//                 path: fullPath, // Ensure the path is set here
//                 children: getDirectoryStructure(fullPath)
//             };
//         } else {
//             return {
//                 name: item,
//                 type: 'file',
//                 path: fullPath
//             };
//         }
//     });
// }

// app.get('/api/files', (req, res) => {
//     // const directoryPath = "/Users/shivampatel/Downloads/projects_practice/Downloader-nodejs";
//     const directoryPath = "/Users/shivampatel/Downloads/";

//     try {
//         const directoryStructure = getDirectoryStructure(directoryPath);
//         res.json(directoryStructure);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching files' });
//     }
// });

// app.get('/download/*', (req, res) => {
//     const fileLocation = req.params[0];
//     res.download(fileLocation, (err) => {
//         if (err) {
//             console.error('File download error:', err);
//             res.status(500).send('Error downloading file');
//         }
//     });
// });

// app.get('/download-all/*', (req, res) => {
//     // const directoryPath = req.params[0]; // Capture the path from the request
//     const fullDirectoryPath = req.params[0];
//     // const fullDirectoryPath = path.join('/Users/shivampatel/Downloads/', directoryPath);

//     console.log('Requested directory path:', fullDirectoryPath);


//     if (!fs.existsSync(fullDirectoryPath)) {
//         return res.status(404).send('Folder not found');
//     }

//     res.setHeader('Content-Type', 'application/zip');
//     res.setHeader('Content-Disposition', `attachment; filename=${path.basename(fullDirectoryPath)}.zip`);

//     const archive = archiver('zip', {
//         zlib: { level: 0 } // No compression
//     });

//     archive.on('error', function (err) {
//         console.error('Archiver error:', err);
//         res.status(500).send('Error creating archive');
//     });

//     archive.pipe(res);
//     archive.directory(fullDirectoryPath, false);
//     archive.finalize();
// });


// app.listen(port, () => {
//     console.log(`In Phone open http://${ipAddresses[0]}:${port} in browser. Or  http://${ipAddresses[1]}:${port}`)
//     console.log(`Server running on http://localhost:${port}`);
// });

//For NEXTJS 

const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const archiver = require('archiver');
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3001;

// Serve the HTML file at the root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'example.html'));
});

function getIpAddressesOfWIFI() {
    const interfaces = os.networkInterfaces();
    const ipAddresses = [];
  
    for (const devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          ipAddresses.push(alias.address);
        }
      }
    }
  
    return ipAddresses;
}

const ipAddresses = getIpAddressesOfWIFI();
const ignoredDirs = ['node_modules', '.git', 'bin', 'lib', 'build', '.next', 'desktop_pc'];

function getDirectoryStructure(srcpath) {
    const items = fs.readdirSync(srcpath).filter(item => !ignoredDirs.includes(item));

    return items.map(item => {
        const fullPath = path.join(srcpath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            return {
                name: item,
                type: 'directory',
                path: fullPath,
                children: getDirectoryStructure(fullPath)
            };
        } else {
            return {
                name: item,
                type: 'file',
                path: fullPath
            };
        }
    });
}

app.get('/api/files', (req, res) => {
    const directoryPath = "/Users/shivampatel/Downloads/try";

    try {
        // Get folder structure
        const folderStructure = getDirectoryStructure(directoryPath);
        // console.log('folderStructure',folderStructure)

        // Get root files
        const rootFiles = fs.readdirSync(directoryPath)
            .filter(file => !ignoredDirs.includes(file) && !fs.statSync(path.join(directoryPath, file)).isDirectory())
            .map(file => ({
                name: file,
                type: 'file',
                path: path.join(directoryPath, file)
            }));

        // Combine folder and root files
        res.json({
            folders: folderStructure,
            files: rootFiles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching files' });
    }
});

app.get('/download/*', (req, res) => {
    const fileLocation = req.params[0];
    res.download(fileLocation, (err) => {
        if (err) {
            console.error('File download error:', err);
            res.status(500).send('Error downloading file');
        }
    });
});

app.get('/download-all/*', (req, res) => {
    const fullDirectoryPath = req.params[0];
    // console.log('Requested directory path:', fullDirectoryPath);

    if (!fs.existsSync(fullDirectoryPath)) {
        return res.status(404).send('Folder not found');
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(fullDirectoryPath)}.zip`);

    const archive = archiver('zip', {
        zlib: { level: 0 } // No compression
    });

    archive.on('error', function (err) {
        console.error('Archiver error:', err);
        res.status(500).send('Error creating archive');
    });

    archive.pipe(res);
    archive.directory(fullDirectoryPath, false);
    archive.finalize();
});

app.listen(port, () => {
    console.log(`In Phone open http://${ipAddresses[0]}:${port} in browser. Or  http://${ipAddresses[1]}:${port}`);
    console.log(`Server running on http://localhost:${port}`);
});
