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

<code>
socket.On("msg",({port,msg})=>{
    console.log("message: "+msg)
  })
  </code>
<h4>Send</h4>
<p>
The send method sends a message to the client and has two parameters, one is the port the client will receive and the other is the message. The send method already includes an algorithm to analyze who is in a room or not.</p>
<strong>Example:</strong>
<code> socket.Send("port","hello client")</code>

<h4>BroadCast</h4>
<p>The BroadCast method is the method that sends to all users, if the user is listening on any port and the server sends a message with the BroadCast method, it will listen. However the customer must be listening at some door.</p>
<strong>Example:</strong>
<code>
socket.BroadCast("Hello everybody")
</code>
  
