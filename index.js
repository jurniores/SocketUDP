const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const Server = require("./Socket/socket");


const socket = new Server(server);


server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

server.on("message",(msg,rinfo)=>{
  console.log("ola");
  socket.ConnectedUpdate(msg,rinfo,1)
  
  
  socket.On("chat",({port,msg})=>{
    socket.SendNotOnce("chat",msg);
    console.log(socket.client)
  })
  
})


  server.on('listening', () => {
    const address = server.address();
    
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
  
  server.bind(3000);