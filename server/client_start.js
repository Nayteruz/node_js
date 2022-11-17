let socket, connected = false;
let data = {left:0, top:0, id: Date.now()};
let id = 1;
let bg = '#' + Math.floor(Math.random()*16777215).toString(16);
function connect() {
    socket = new WebSocket('ws://localhost:5000')
    socket.onopen = () => {
        connected = true;
        const message = {
            event: 'connection',
            left:10,
            top:10,
            id,
            bg
        }
        socket.send(JSON.stringify(message))

    }
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        createCursors(message)
    }
    socket.onclose= () => {
        onNotStandart('Socket закрыт')
    }
    socket.onerror = () => {
        onNotStandart('Socket произошла ошибка')
    }
}

const sendMessage = async (e) => {
    let pos = handleMouseMove(e)
    const message = {
        left:pos.left,
        top:pos.top,
        id,
        bg,
        event: 'message'
    }
    socket.send(JSON.stringify(message));
}

function onNotStandart(msg){
    document.querySelectorAll('[id^=user_]').forEach(function(e){
        e.remove()
    })
    document.removeEventListener('mousemove', sendMessage)
    console.log(msg)
}

function handleMouseMove(event) {
    let eventDoc, doc, body;

    event = event || window.event; // IE-ism

    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target?.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    return {left:event.pageX, top:event.pageY}
}

function createCursors(cursors){
    for (const [k, v] of Object.entries(cursors)) {
        let c = document.querySelector('#' + k);
        if(!c){
            c = document.createElement("span");
            c.id = k;
            c.style.position = 'absolute';
            c.style.left = v.left + 'px'
            c.style.top = v.top + 'px'
            c.style.width = '20px';
            c.style.height = '20px';
            c.style.display = 'block';
            c.style.background = v.bg;
            c.style.zIndex = '99999';
            c.style.borderRadius = '50%'
            document.body.appendChild(c);
        } else {
            c.style.left = v.left + 'px'
            c.style.top = v.top + 'px'
            c.style.background = v.bg;
        }
    }

}


connect()


document.addEventListener('mousemove', sendMessage)




/// https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients