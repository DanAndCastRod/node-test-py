const express = require('express');
const fileUpload = require('express-fileupload');
const {exec} = require('child_process');
const path = require("path");
const { stdout } = require('process');

const app = express();
app.use(fileUpload());
app.use(express.static('public'))

app.post('/upload',(req, res) => {
    if (!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send('No files were uploaded.');
    }

    let sampleFile = req.files.sampleFile;
    let uploadPath = __dirname + '/uploads/'+sampleFile.name;

    sampleFile.mv(uploadPath, (err) =>{
        if(err) return res.status(500).send(err);

        exec("python3 "+ path.join(__dirname, "scripts", "myscript.py"), (error, stdout, stderr) =>{
            if (error) {
                console.error(`Error ejecutando el script: ${error}`)
                return;
            }
            console.log(`Resultado script: ${stdout}`);
        });
        // res.send("File uploaded!")
    });
});

const port = 3000;
app.listen(port, () =>{
    console.log(`Server running on http://localhost:${port}`);
})