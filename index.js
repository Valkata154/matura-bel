const fs = require('fs');
const http = require('http');
const url = require('url');
const express = require('express');
const path = require('path');

const app = express();

// Read all files and load the data
let json = fs.readFileSync(`${__dirname}/data/author-data.json`, 'utf-8');
const authorData = JSON.parse(json);
json = fs.readFileSync(`${__dirname}/data/work-data.json`, 'utf-8'); 
const workData = JSON.parse(json);
    
// All routes
app.use('/static', express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/literature', function(req, res) {
    res.sendFile(path.join(__dirname, '/literature.html'));
});

app.get('/information', function(req, res) {
    res.sendFile(path.join(__dirname, '/information.html'));
});

app.get('/contact', function(req, res) {
    res.sendFile(path.join(__dirname, '/contact.html'));
});

app.get('/author', function(req, res) {
    fs.readFile(`${__dirname}/author.html`, 'utf-8', (err, data) => {
        let id  = url.parse(req.url, true).query.id;
        const author = authorData[id];
        const output = replaceTemplateAuthor(data, author);
        
        res.end(output);
    });
});

app.get('/work', function(req, res) {
    fs.readFile(`${__dirname}/work.html`, 'utf-8', (err, data) => {
        let id  = url.parse(req.url, true).query.id;
        const work = workData[id];
        const output = replaceTemplateWork(data, work);
        
        res.end(output);
    });
});

app.listen(8080);

// Function to replace temporary words in the html with details of each author
function replaceTemplateAuthor(originalHtml, author){
	let output = originalHtml.replace(/{%AUTHORNAME%}/g, author.author);
    output = output.replace(/{%AUTHORNAMESHORT%}/g, author.authorShort);
    output = output.replace(/{%BIRTH%}/g, author.born);
    output = output.replace(/{%DIRECTION%}/g, author.direction);
	output = output.replace(/{%TOWN%}/g, author.town);    
    output = output.replace(/{%DEATH%}/g, author.death);  
    output = output.replace(/{%IMAGE%}/g, author.image);  
    output = output.replace(/{%DESCRIPTION%}/g, author.description);

    var str;
    for(let i = 0; i < author.works.length; i++){
        str += `<a class="author-works__work" href="/work?id=${author.workIDs[i]}"><li><i class="fas fa-scroll"></i>` + author.works[i] + `</li></a> \n`;
    }

    output = output.replace(/{%WORKS%}/g, str);
    output = output.replace("undefined", ""); // Somehow the first element is "underfined" so this is used to remove it
        
	return output;
}

// Function to replace temporary words in the html with details of each author's work
function replaceTemplateWork(originalHtml, work){
	let output = originalHtml.replace(/{%AUTHOR%}/g, work.author);
    output = output.replace(/{%AUTHORSHORT%}/g, work.authorShort);
    output = output.replace(/{%NAME%}/g, work.name);
    output = output.replace(/{%DATE%}/g, work.date);  
    output = output.replace(/{%GENRE%}/g, work.genre);  
    output = output.replace(/{%DESCRIPTION%}/g, work.description);
    output = output.replace(/{%LINK%}/g, "/author?id=" + work.authorId);

    var str;
    for(let i = 0; i < work.players.length; i++){
        str += `<li class="work-players__player"><i class="fas fa-male"></i>` + work.players[i] + `</li> \n`;
    }

    output = output.replace(/{%PLAYERS%}/g, str);
    output = output.replace("undefined", ""); // Somehow the first element is "underfined" so this is used to remove it
        
	return output;
}