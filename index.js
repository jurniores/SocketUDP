const dgram = require("dgram");
const { join } = require("path");
const server = dgram.createSocket("udp4");
const app = require("express")()

var playersServer = []

const Server = require("./Socket/socket");

var port = process.env.PORT||3000;
const socket = new Server(server);


server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });


  //Escutando o cliente
server.on("message",(msg,rinfo)=>{
  //atualizando sempre os clientes novos que enviam mensagens
  
  //Atualiza sempre a mensagem e o ip que é enviado a cada request
  socket.rinfo = rinfo;
  socket.msg = msg;
  

  //Cria sala para jogador
  socket.On("sala",({port,msg})=>{

    
    //caso exista algum argumento o jogador entrará em uma sala já criada, senão criará uma nova
    if(socket.Join(msg)){
      socket.Send("rcEntraSala", "")
      socket.Send("rcSalas", JSON.stringify({Items:socket.rooms}))
    }
    

  })
  socket.On("salas",({port,msg})=>{

    //console.log(socket.stateGame) 
    socket.SendForMe("rcSalas", JSON.stringify({Items:socket.rooms}))
    

  })
  //ping é enviado todas as mensagens reliable para todos os usuários a cada tempo de ping que você configurou no cliente
  socket.On("ping",({port,msg})=>{
    socket.ConnectedUpdate()
    socket.Send("ping",msg);
    
    console.log(socket.rooms)
    
    
    
  })



  socket.On("ataque",({port,msg})=>{
    console.log(msg)
    socket.AddState(msg);
    socket.SendReliable("realible","ola")
    
    
    
  })

  
  socket.On("move",({port,msg})=>{

    
    socket.Send("rcMove",msg);
    console.log("ola")
    
    

  })

  
  socket.On("pulo",({port,msg})=>{
    console.log("pulou")
    socket.Send("rcPulo",msg)
    

  })
  
  
  socket.On("login",({port,msg})=>{
    
    //adicionando estado inicial
    
     //inserindo o nome do player e validando se existe algum nome
     
     if(socket.client.filter(valor=>valor.name==msg).length==0){
      socket.ConnectedUpdate(msg);
      socket.SendForMe("entra","mensagem para entrar")
      playersServer = [];
      for(var i = 0;i<socket.stateGame.length;i++){
        console.log(socket.stateGame[i].name)
        
        playersServer.push(socket.stateGame[i].name)
        
      }           
      
     }
     

  })

  socket.On("loginMapa",({port,msg})=>{

    socket.SendReliable("logados");


  })
 

 

  
  
})

  server.on('listening', () => {
    const address = server.address();
    
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
  
  server.bind(3000);



  //Servidor WEB

  app.get("/",(req,res)=>{
    let name = "<h4>Players logado:</h4>";
    for(var i = 0;i<playersServer.length;i++){
      name+="<li>"+playersServer[i]+"</li>";
      
    }
    res.send("<h1>Quantidade de players online "+playersServer.length+"</h1>  "+name)
    
  })

  app.listen(port,()=>console.log("Servidor TCP rodando na porta "+port))