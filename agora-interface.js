/*
 * JS Interface for PeerJs brabos ulbra
 */
let peer = new Peer();
let myStream;
let conStream;

navigator.getUserMedia = navigator.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;

function isHidden(el) {
  return (el.offsetParent === null)
}

//chamada de video
function chamar(idReceptor){
  
  navigator.getUserMedia({ video: true, audio: true }, function (stream) {
    peer.call(idReceptor, stream);
  }, function (err) {
    console.log('Failed to get local stream', err);
  });
};

//mandar mensagens
const enviaDados = (dados) => {
  conn.send(dados);
}

// itera para o peer continuar recebendo!
peer.on('connection', function (conn) {
  conn.on('data', function (data) {
    console.log(data);
    switch (data){
      case 'video true' :
        toggleVideoGlobal(conStream,true);
        break;
    
      case 'video false':
        toggleVideoGlobal(conStream,false);
    
      case 'audio true':
        toggleMicGlobal(conStream,true);
        break;
      
      case 'audio false':
        toggleMicGlobal(conStream,false);
        break;
      
      case 'desconectar':
        disconnect();
        break;
    }  
  });
});

//responder chamada de video
peer.on('call', function (call) {
  var status;
  for (var conexao in peer.connections){
      status = conexao;
  }

  if (status == 'conectado'){
    console.log(status);
  }
  else{
    var conexaoAtual;
    for (var conexao in peer.connections){
      conexaoAtual = conexao;
    }
    peer._connections.set('conectado')
    responder(call);
    conectar(conexaoAtual);
  }
});


function responder(call){
  navigator.getUserMedia({ video: true, audio: true }, function (stream) {
    call.answer(stream); // Responder a chamada com um stream de audio e video.
    
    var video = document.querySelector('video#local-video');
    video.srcObject = stream;

    video.onloadedmetadata = function (e) {
      video.play();
    };

    call.on('stream', function (remoteStream) {
      
        var video2 = document.querySelector('video#full-screen-video');

        myStream = stream;
        conStream = remoteStream;

        video2.srcObject = remoteStream;
        video2.onloadedmetadata = function (e) {
          video2.play();
        };
        enableUiControls();
    });
    
  }, function (err) {
    console.log('Failed to get local stream', err);
  });
}
