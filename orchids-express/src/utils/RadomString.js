function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text + Math.floor(Date.now() % 1000);
}

function randomEmailForTeam() {
    return `${randomString(10)}@orchids.com`;
}

module.exports = { randomEmailForTeam, randomString }

// const byteSize = Buffer.byteLength(randomString(5), 'utf8');
// console.log(byteSize);