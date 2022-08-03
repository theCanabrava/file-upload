const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();

// default options
app.use(cors());
app.use(fileUpload());

app.post('/upload', function(req, res) {
  let sampleFile;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  console.log('Case id is', req.body.CaseId)
  console.log('Anexos são', req.files)

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.Anexos;

  // Use the mv() method to place the file somewhere on your server
  try
  {

    if(sampleFile.length)
    {
      let uploaded = 0
      for(let file of sampleFile) move(file, () =>
      {
        uploaded++
        if(uploaded === sampleFile.length) res.send('Files uploaded!')
      })
    }
    else move(sampleFile, () => res.send('File uploaded'))
  }
  catch
  {
    res.status(500).send(err);
  }
});

const move = (file, onSuccess) =>
{
  const uploadPath = __dirname + '/tmp/' + file.name;
  file.mv(uploadPath, function(err) {
    if (err) throw new Error(`Failed to upload ${file.name}`)
    onSuccess();
  });
}

app.listen(3001, ()=>console.log('Listening on port 3001'))

/*
  SNIPET PARA UPLOAD
  
    console.log('Uploading file')
    var blob = new Blob(['Hello'], {type: 'text/plain'})
    console.log('resulting blob', blob)
    var formData = new FormData()
    formData.append('CaseId', "2022031225")
    formData.append('Anexos', blob, 'hello.txt')
    formData.append('Anexos', blob, 'hello1.txt')
    formData.append('Anexos', blob, 'hello2.txt')

    console.log('Resulting form data', formData)
    const response = await axios.post('http://localhost:3001/upload', formData);
    console.log(response)
*/