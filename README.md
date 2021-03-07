# SocketUDP

A função On executa  leituras de mensagens enviadas por qualquer protocolo UDP, porém para enviar do cliente precisa ter a porta:mensagem, enviada para o servido

Caso não enviado dessa meneira não será  reconhecido no servidor, também não gerará problemas. Um exemplo enviado de um cliente C# para nodeJs é .

client = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp)
 byte[] packatData = Encoding.ASCII.GetBytes(send+':'+message);
        client.SendTimeout = 1;
        client.SendTo(packatData, ep);
       
       
       A porta deve ser Enviado depois colocado : (dois pontos) e depois a mensagem que queira ser recebida.
