const http=require('http')

let server=http.createServer((req,res)=>{
    console.log(req.method,req.url)
    if(req.method==='post'&&req.url==='/webhook'){
        res.setHeader('Content-Type','application/json')
        res.end(JSON.stringify({ok:true}))
    }else{
        res.end('Not found')
    }
})
server.listen(4000,()=>{
    console.log('webhook 4000')
})