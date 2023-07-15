// var currentTimestampInSeconds = Math.floor(Date.now() / 1000);
// console.log(currentTimestampInSeconds);
// var currentTimestampInSeconds = Math.floor(Date.now() / 1000);
// console.log(currentTimestampInSeconds);
// var currentTimestampInSeconds = Math.floor(Date.now() / 1000000);
// console.log(currentTimestampInSeconds); 

// radom character generator
function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

// console.log(randomString(5) + Math.floor(Date.now() / 10000000));
