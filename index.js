const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const Server = require("./RouterUDP/routes");


const socket = new Server(server);


server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

server.on("message",(msg,rinfo)=>{
  socket.ConnectedFirst(msg,rinfo)

  console.log(socket.client)
  
  socket.On("join", ({port,msg})=>{
    socket.Join(msg)
  })
  

  socket.BroadCast("Bom dia")

  socket.Send("void", "Enviando MSg do servidor")

  socket.On('disconnect', (msg)=>{
    socket.Diconnected()
    console.log('disconectei')
    
  })
  

})


  server.on('listening', () => {
    const address = server.address();
    
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
  
  server.bind(3000);