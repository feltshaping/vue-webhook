let http=require('http')
let crypto=require('crypto')
let SECRET='123456'
function sign(body){
    return `sha1=`+crypto.createHmac('sha1',SECRET).update(body)
}
let server=http.createServer((req,res)=>{
    if(req.method==='post'&&req.url==='/webhook'){
        let buffers=[];
        req.on('data',buffer=>{buffers.push(buffer)})
        req.on('end',buffer=>{
            let body=Buffer.concat(buffers);
            let event=req.header['x-gitHub-event']
            let signature=req.headers['x-gitHub-signature'];
            if(signature!==sign(body)){
                return res.end('Not allowed')
            }
        })
        res.setHeader('Content-Type','application/json')
        res.end(JSON.stringify({ok:true}))
    }else{
        res.end('Not found')
    }
})
server.listen(4000,()=>{
    console.log('webhook 4000')
})