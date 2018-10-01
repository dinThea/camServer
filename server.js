let express     = require('express')
let fs          = require('fs')
let bodyParser  = require('body-parser')
let jsonQuery   = require('json-query')
let app         = express()
let port        = 3000
let obj
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))

// Async JSON reading
readJSON = () => {
    fs.readFile('/home/dev_pitel/Documents/trabalho/js/servercv/data/status.json', 'utf8', function (err, data) {
        if (err) throw err
        obj = JSON.parse(data)
        console.log(obj)
    })
}
readJSON()
// HTTP get
app.get('/', (req, res) => {
    res.send('<h1>Running<h1>')
})
// Para coletar informacoes da camera
app.get('/cams', (req, res) => {

    spaces = ''
    obj.posto.forEach(element => {
        
        element.space.forEach(element => {
            spaces += `<h2>Space ID: ${element.space_id} <br> Space Status: ${element.space_available}<h2>`
        });

    });
    
    res.send(`
        <h1> Status Cameras <h1>
            ${spaces}
        `) 
})
// Para receber informacaos da camera
app.post('/cams', (req, res) => {

    let op              = req.body.op
    let user_id         = req.body.id
    let token           = req.body.token
    let geo             = req.body.geo
    let posto           = req.body.posto_id
    let space_id        = req.body.space_id
    let timestamp       = req.body.timestamp        
    
    switch (op) {
        case "change_space_available" :
            let status          = req.body.status
            obj.posto[posto].space[space_id].space_available        = status
            obj.posto[posto].space[space_id].status_last_change_ts  = timestamp
        break
        case "change_bt_status" :
            obj.posto[posto].space[space_id].buttom_last_pressed_ts  = timestamp
        break
    }
    
    console.log(`Post request received from ${user_id} ${token} ${geo}`)
    res.send('Received')

})
// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em https://localhost:${port}`)
    console.log('Para derrubar o servidor: ctrl + c')
})