var http = require('http')
var fs = require('fs')
var qs = require('querystring')
var url = require('url')


var server = http.createServer(handleRequest)

function handleRequest(req, res) {
    var parsedUrl = url.parse(req.url, true)
    // console.log(parsedUrl)
    console.log(req.url)
    var store = ''

    req.on('data', (chunk) => {
        store += chunk
    })

    req.on('end', () => {
        if (req.method === 'GET' && req.url === '/') {
            res.setHeader('Content-Type', 'text/html')
            fs.createReadStream('index.html').pipe(res)
        }
        else if (req.method === 'GET' && req.url === '/about') {
            res.setHeader('Content-Type', 'text/html')
            fs.createReadStream('about.html').pipe(res)
        }
        else if (req.url.split('.').pop() === 'png') {
            res.setHeader('Content-Type', 'image/png')
            fs.createReadStream('./assets/image' + req.url).pipe(res)
        }
        else if (req.url.split('.').pop() === 'jpg') {
            res.setHeader('Content-Type', 'image/jpg')
            fs.createReadStream('./assets/image' + req.url).pipe(res)
        }
        else if (req.url.split('.').pop() === 'css') {
            res.setHeader('Content-Type', 'text/css')
            fs.createReadStream('./assets/stylesheets' + req.url).pipe(res)
        }
        else if (req.method === 'GET' && req.url === '/contact') {
            res.setHeader('Content-Type', 'text/html')
            fs.createReadStream('./form.html').pipe(res)
        }
        else if (req.method === 'POST' && req.url === '/form') {
            var parsedData = qs.parse(store)
            // console.log(store)
            // console.log(JSON.stringify(parsedData) )
            console.log(parsedData)
            var username = parsedData.username
            if (username != '') {
                res.setHeader('Content-Type', 'text/html')
                fs.createReadStream('./form.html').pipe(res)
                fs.open(`contacts/${username}.json`, 'wx', (err, fd) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/html' })
                        res.end(`<p>contact is allready present</p>`)
                    }
                    fs.write(fd, JSON.stringify(parsedData), (err) => {
                        if (err) { throw err }
                        console.log('written successfully')
                        fs.close(fd, () => {
                            console.log('contact saved successfully')
                            res.end(`<p>contact saved successfully</p>`)
                        })
                    })
                })
            } else {
                res.end('please enter some data')
            }

        }
        else if (req.method === 'GET' && parsedUrl.pathname === '/users') {
            var username = parsedUrl.query.username
            if (username) {
                fs.open(`./contacts/${username}.json`, 'r+', (err, fd) => {
                    if (err) {
                        throw err;
                    }
                    fs.readFile(fd, (err, data) => {
                        if (err) {
                            throw err;
                        }

                        let parseData = JSON.parse(data.toString());
                        res.writeHead(202, { 'content-type': 'text/html' })
                        res.end(`
                    <h2>Name: ${parseData.name}</h2>
                    <h2>Email: ${parseData.email}</h2>
                    <h2>Username: ${parseData.username}</h2>
                    <h2>Age: ${parseData.age}</h2>
                    <h2>About: ${parseData.bio}</h2>
                    `)
                    })


                })
            }else{
                let allName=''
                fs.readdir('./contacts',(err,files)=>{
                    if(err){
                        throw err
                    }
                    console.log(files)
                    let fileLength=files.length
                    files.forEach(file=>{
                        fs.open(`./contacts/${file}`,'r+',(err,fd)=>{
                            if(err){
                                throw err
                            }
                            fs.readFile(fd,(err,data)=>{
                                let parseData=JSON.parse(data)
                                allName+=parseData.name+', '
                                fileLength--
                                console.log(allName)
                                if(fileLength==0){
                                    res.writeHead(201,{'Content-Type':'text/html'})
                                    res.end((allName))
                                }
                            })
                        })
                    })
                })
            }
        }
    })

}

server.listen(5000, () => {
    console.log('server listening on port 5k')
})