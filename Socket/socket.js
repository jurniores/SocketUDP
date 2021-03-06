


module.exports = class Server {

    constructor(socket){
        this.socket = socket;
        this.rinfo = false
        this.msg = false
        this.client = []
        
        
    }
    //Listen event
    On(valida, call){
        let string = this.msg.toString()
        let novaMsg = string.split(':')

        if(valida == novaMsg[0]) {
            
            call({port:novaMsg[0], msg:novaMsg[1]});
        }
        
    }

    SendNotOnce(send, msg){
        this.client.map(valor=>{
            //Valida se tiver uma sala envia a mensagem para aquela sala.
            if(valor.room) {
                this.socket.send(`${valor.room}:${msg} (${send})`, valor.port)
            }
            if(valor.port != this.rinfo.port){
                this.socket.send(`${send}:${msg}`, valor.port)
            }
            
        })
    }

    //Send message
    Send(send, msg){
        this.client.map(valor=>{
            //Valida se tiver uma sala envia a mensagem para aquela sala.
            if(valor.room) {
                this.socket.send(`${valor.room}:${msg} (${send})`, valor.port)
            }
            this.socket.send(`${send}:${msg}`, valor.port)
        })
        
    }
    //Send Broadcast
    BroadCast(msg){
        this.client.map(valor=>{
            this.socket.send(`brc:${msg} (BroadCast)`, valor.port)
        })
        
    }
    //Connect and DISCONNECT clients
    ConnectedUpdate(msg, rinfo, time=0.5){
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
            
            if(dataTimeAfk>=time){      
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
      //Join room OOR party 
    Join(room){
        
       this.client.map(valor=>{
        if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
           valor.room = room
        }
       })
    }

    //leave Room
    Leave(){
        this.client.map(valor=>{
            if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
               valor.room = false
            }
           })
    }
    
    Diconnected(){
        
        this.client.map((valor,index)=>{
            if(valor.port === this.rinfo.port && valor.address === this.rinfo.address){
                this.client.splice(index,1)
             }
        })
    }
}