


module.exports = class Server {

    constructor(socket){
        this.socket = socket;
        this.rinfo = false;
        this.msg = false;
        this.client = [];
        this.stateGame = [];
        this.rooms = [];
 
    }
  
    //Ouve os eventos
    On(valida, call){
        let string = this.msg.toString()
        let novaMsg = string.split(':')
        let firstMsg = novaMsg[0];
        let secondMsg = novaMsg.splice(1,novaMsg.length-1).join(":");
        
        if(valida == novaMsg[0]) {
            
            call({port:firstMsg, msg:secondMsg});
        }

    }
    //Adiciona um estado fixo para ser enviado sempre
    AddState(msgs){

        try{
            let idMsg = JSON.parse(msgs);
        
            this.stateGame.map((valor,index)=>{
                
                if(idMsg && valor.name == idMsg.name){
                    idMsg.name = valor.name
                    idMsg.room = valor.room
                    this.stateGame[index] = idMsg;
                }
            })
        }catch(e){Error(e)}
        
        
            
    }
    //Envia para todos menos para mim
    SendNotMe(send, msg){
        try{
            var existe = this.client.filter(valor=>{
                if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
                    return valor;
                }
            })
    
            
    
            if(existe[0].room){
                
                this.client.map(valor=>{
                    //Valida se tiver uma sala envia a mensagem para aquela sala.
                    if(valor.room === existe[0].room && valor.port != this.rinfo.port && valor.address != this.rinfo.address) {
                        this.socket.send(`${send}:${msg}`, valor.port, valor.address)
                        
                    }
                    
                })
            }else{
                this.client.map(valor=>{
                    //Valida se tiver uma sala envia a mensagem para aquela sala.
                    if(valor.port != this.rinfo.port && valor.address != this.rinfo.address && !valor.room) {
                        this.socket.send(`${send}:${msg}`, valor.port, valor.address)
                        
                    }
    
                })
            }
        }catch(e){Error(e)}
       
        
    }
    SendForMe(send, msg){
        
        
                this.socket.send(`${send}:${msg}`, this.rinfo.port, this.rinfo.address)
            
    }

    //Envia para todos conectados ou se tiverem em uma sala envia para a sala
    Send(send, msg){
        try{
            var existe = this.client.filter(valor=>{
                if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
                    return valor;
                }
            })
    
            
            if(existe && existe[0].room != null){
                        
    
                        
                this.client.map(valor=>{
                    
                    
                    //Valida se tiver uma sala envia a mensagem para aquela sala.
                    if(valor.room === existe[0].room) {
                        this.socket.send(`${send}:${msg}`, valor.port, valor.address)
                        
                    }
                    
                })
            }else{
                this.client.map(valor=>{
                    //Valida se tiver uma sala envia a mensagem para aquela sala.
                    
                        !valor.room&&this.socket.send(`${send}:${msg}`, valor.port, valor.address)
                        
                    
                
                })
            }
    
            
        }catch(e){Error(e)}
        

        
        
    }
    //Envia o estado fixo para todos
    SendReliable(send){
        
        
        try{
            if(this.stateGame.length>0){

                var existe = this.client.filter(valor=>{
                    if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
                        return valor;
                    }
                })
        
                
                
                if(existe && existe[0].room != null){
                    

                    
                    this.client.map(valor=>{
                        
                        let json = JSON.stringify({Items:this.stateGame.filter(valor=>valor.room==existe[0].room)});
                        
                        //Valida se tiver uma sala envia a mensagem para aquela sala.
                        if(valor.room === existe[0].room) {
                            this.socket.send(`${send}:${json}`, valor.port, valor.address)
                            
                        }
                        
                    })
                }else{
                    this.client.map(valor=>{
                        //Valida se tiver uma sala envia a mensagem para aquela sala.
                        if(!valor.room) {
                            let json = JSON.stringify({Items:this.stateGame});
                            this.socket.send(`${send}:${json}`, valor.port, valor.address)
                            
                        }
                        
                            
                        
                    
                    })
                }
    
                
                
            }
        }catch(e){
            Error(e);
        }
        
      

        
        
    }
    
    //Envia para todos em qualquer sala
    BroadCast(msg){
        this.client.map(valor=>{
            this.socket.send(`brc:${msg} (BroadCast)`, valor.port)
        })
        
    }

    //Conecta e disconecta os clientes, sempre verificando, quando for inserir o nome no cliente sempre chamar este método
    ConnectedUpdate(infoPlayer,time=0.3){
        
        
        //Validação se está logado no servidor
        const date = new Date()
        
        //Setando as configurações dos Clientes
        if(this.client.length === 0){
            this.client = [{port:this.rinfo.port,address:this.rinfo.address, hour:date, room:false, name:false, stateGame:false, move:false, valida: 0}]
           
        }
        const arrayValida =[]
        var port = -1
        
        this.client.map((valor, index)=>{


            const dataMenor = date.getTime() - valor.hour.getTime();
            const dataTimeAfk = (dataMenor/1000)/60
            
            
            //Se o player já existe
            if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){         
                arrayValida.push(1);
                valor.hour = date

                var configPlayer = infoPlayer?JSON.parse(infoPlayer):null;
                if(infoPlayer && configPlayer.name){
                    valor.name = configPlayer.name
                    configPlayer.room = valor.room
                    this.stateGame.push(configPlayer)
                    
                }
                
                
            }
            
            if(dataTimeAfk>=time){      
                port = index
            }
            
        })


        if(port>=0){
            
            //Decrementando de quem saiu da sala e se tiver nenhum player exclui a sala do array
            this.rooms.map((valor2,index)=>{
                if(this.client[port].room===valor2.room){
                    valor2.qtdPlayer=valor2.qtdPlayer-1;
                    valor2.qtdPlayer==0&&this.rooms.splice(index,1);
                } 
            });
            this.stateGame.map((valor,index)=>{
                if(valor.name == this.client[port].name) this.stateGame.splice(index,1);
            });
            this.client.splice(port,1);
            console.log('Excluiu')
            
            

            
        }

        if(arrayValida.length===0){

            
                this.client = [...this.client, {port: this.rinfo.port, address:this.rinfo.address, hour:date,room:false, name:false, stateGame:false, move:false, valida:0}]
                //name&&(this.stateGame = [{name:name}]);
                
            
            
        }
         
    }
   
      //Entra em uma sala
    Join(room){
        var validaSala = [];
        //Forma uma nova sala
        var ranges = Math.floor((Math.random()*10000));
        //Transforma o json enviado do client em objeto js
        var sala = JSON.parse(room);

        //filtro para verificar se a sala está cheia
        var filtro = this.rooms.filter(valor=>{
            if(valor.room == sala.room && valor.qtdPlayer==valor.maxPlayer){
                return valor;
            }
        })

        //verifica se realmente está cheia se estiver não anexa a sala ao cliente que pediu para entrar
        if(filtro.length>0) return false;
        
        //Verifica se já existe essa sala nos players
        if(this.client.filter(valor=>valor.room === ranges).length==0){
            //Transforma em objeto Javascript o json enviado
            
            
            
            
            //se o player que chamou não existir sala ele anexa uma sala ele, que criou ou que entrou
            this.client.map((valor)=>{
                if(valor.port === this.rinfo.port && valor.address === this.rinfo.address && !valor.room){
                   
                   
                   if(sala.room==0){
                        valor.room = sala.room>0?sala.room:ranges
                        this.rooms.push({name:sala.name,qtdPlayer:1, room:ranges, maxPlayer:sala.maxPlayer>6?6:sala.maxPlayer});
                        this.stateGame.map((valor2,index)=>{
                           if(valor2.name==valor.name){
                               valor2.room = ranges;
                           }
                        })
                   }
                   //Se existir sala ele verifica se o estado do player ainda não existe sala e insere sala no estado dele
                   else {
                       //Verifica se a sala ainda existe, ou se foi destruída, evitando bug de entrar em uma sala fantasma
                    var room = this.rooms.filter(valor=>valor.room==sala.room)
                    if(room.length==0) return validaSala.push(1);

                    valor.room = sala.room>0?sala.room:ranges
                        
                       //Verifica se o estado do player já tem sala se existir ele insere um numero no array valida para que não haja soma na sala
                    this.stateGame.map((valor2,index)=>{
                        if(valor2.name==valor.name){
                             valor2.room = valor.room;
                        }
                    
                     })
                     room[0].qtdPlayer++;

                   }

                }

            })
            
            if(validaSala.length>0){return false} else{return true}
               
        }
            
        
        
        
       
    }

    //Sai da sala
    Leave(){
        this.client.map(valor=>{
            if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
               valor.room = false
               this.rooms.map((valor2,index)=>{
                   if(valor.room===valor2.room){
                       valor2.qtdPlayer=valor2.qtdPlayer-1;
                       valor2.qtdPlayer==0&&this.rooms.splice(index,1);
                   } 
               });
            }
           })
    }
    //disconecta o cliente
    Diconnected(){
        
        this.client.map((valor,index)=>{
            if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
                this.client.splice(index,1)
             }
        })
    }
}