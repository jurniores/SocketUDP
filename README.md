# SocketUDP

<h1>First</h1> 

```const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const Server = require("./RouterUDP/routes");


const socket = new Server(server);


server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

server.on("message",(msg,rinfo)=>{
  socket.ConnectedFirst(msg,rinfo)

  socket.Send("msg", "Sending msg from the server")
  
  
  socket.On("msg", ({port,msg})=>console.log("received from the client"))
  
  
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
  ```
  
  <h1>Methods</h1>
  <h4>ConnectedUpdate</h4>
  <p>
This method must always be set before all methods, after the native (dgram) method, dgram.on ("message") is called, ConnectedUpdate must be placed inside it and before all methods.</p>
<p>
ConnectedUpdate has three parameters, the first is a message received from on ("message") and the other is a rinfo from also from on ("message") and the third is the time you determine for the disconnection of absent users.

<strong>Example: socket.UpdatedUpdate(msg,rinfo,0.5(param optional))</strong>
</p>
  <h4>On</h4>
  <p>
 This method listens for messages sent from the client, the first parameter is the desired port and the second is a callback function that brings an object containing two properties, the first is the client's IP and the second is the message
</p>
<h5><i>
Example:</i></h5>

```
socket.On("msg",({port,msg})=>{
    console.log("message: "+msg)
  })
```
  
