const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const Server = require("./Socket/socket");


const socket = new Server(server);


server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

server.on("message",(msg,rinfo)=>{
  socket.ConnectedUpdate(msg,rinfo)

  console.log(socket.client)
  
  socket.On("join", ({port,msg})=>{
    socket.Join(msg)
  })

  socket.On("leave",({port,msg})=>{
    socket.Leave();
    console.log(socket.client)
  })
  

  socket.BroadCast("Bom dia")

  socket.Send("void", "Enviando MSg do servidor")

  socket.On('disconnect', (msg)=>{
    socket.Diconnected()
    console.log(socket.client)
    
  })
  

})


  server.on('listening', () => {
    const address = server.address();
    
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
  
  server.bind(3000);