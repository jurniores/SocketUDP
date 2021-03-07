


module.exports = class Server {

    constructor(socket){
        this.socket = socket;
        this.rinfo = false
        this.msg = false
        this.client = []
        
        
    }
    
    On(valida, call){
        let string = this.msg.toString()
        let novaMsg = string.split(':')

        if(valida == novaMsg[0]) {
            
            call({port:novaMsg[0], msg:novaMsg[1]});
        }
        
    }
    Send(send, msg){
        this.client.map(valor=>{
            //Valida se tiver uma sala envia a mensagem para aquela sala.
            if(valor.room) return this.socket.send(`${valor.room}:${msg} (${send})`, valor.port)
            this.socket.send(`${send}:${msg} (${send})`, valor.port)
        })
        
    }
    BroadCast(msg){
        this.client.map(valor=>{
            this.socket.send(`brc:${msg} (BroadCast)`, valor.port)
        })
        
    }

    ConnectedFirst(msg, rinfo){
        this.rinfo = rinfo;
        this.msg = msg;


        //Validação se está logado no servidor
        const date = new Date()
        
        //Setando as configurações dos Clientes
        if(this.client.length === 0){
            this.client = [{port:rinfo.port,address:rinfo.address, hour:date, room:false}]
            
        }
        const arrayValida =[]
        var port = -1
        
        this.client.map((valor, index)=>{


            const dataMenor = date.getTime() - valor.hour.getTime();
            const dataTimeAfk = (dataMenor/1000)/60
            
            
            
            if(valor.port === rinfo.port && valor.address === rinfo.address){
                
                arrayValida.push(1);
                valor.hour = date
    
            }
            
            if(dataTimeAfk>=0.2){      
                port = index
                
            
            }
        })



        if(port>=0){
            this.client.splice(port,1)
            
        }

        if(arrayValida.length===0){

            console.log("Arrey valida zerou")
            this.client = [...this.client, {port: rinfo.port, address:rinfo.address, hour:date,room:false}]
            
        }
         
    }
      
    Join(room){
        
       this.client.map(valor=>{
        if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
           valor.room = room
        }
       })
    }
 
    Diconnected(){
        
        this.client.map((valor,index)=>{
            
            const deletado = this.client.splice(index,1)
            console.log(this.client)
        })
    }
}