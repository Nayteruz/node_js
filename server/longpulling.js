const ws = require('ws');
let cursors = {};
const wss = new ws.Server({
    port: 5000,
}, () => console.log(`Server started on 5000`))


wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        setPosition(message)
        switch (message.event) {
            case 'message':
                broadcastMessage(cursors, message)
                break;
            case 'connection':
                broadcastMessage(cursors, message)
                break;
        }
    })
})

function broadcastMessage(cursors, message) {
    wss.clients.forEach(client => {
        //cursors['user_' + message.id]['state'] = client;
        client.send(JSON.stringify(cursors))
    })
}
function setPosition(message){
    cursors['user_' + message.id] = {
        left:message.left,
        top:message.top,
        bg:message.bg,
    }
}
