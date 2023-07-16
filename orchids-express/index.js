const app = require('./src/controllers/main.controller');

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



// run exe file get Donate Timo automatically

// const { exec } = require('child_process');
// const path = require('path');

// const projectDirectory = process.cwd();
// const exePath = path.join(projectDirectory, 'output/getUpdateTimo', 'getUpdateTimo.exe');

// exec(`start ${exePath}`, (error, stdout, stderr) => {
//   if (error) {
//     throw new Error(error);
//   }
  
//   console.log('File executed successfully.');
// });



