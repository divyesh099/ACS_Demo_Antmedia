import 'notifyjs-browser';
import React, { useEffect, useRef, useState } from 'react';
// import { WebRTCAdaptor } from './js/webrtc_adaptor';
// import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
const { WebRTCAdaptor } =  require('@antmedia/webrtc_adaptor');

// import 'css/external/bootstrap4/bootstrap.min.css';

const PeerToPeer = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamNameRef = useRef(null);

  const [webRTCAdaptor, setWebRTCAdaptor] = useState(null);
  console.log("webRTCAdaptor >>>",webRTCAdaptor);

  useEffect(() => {
    // Create a new WebRTCAdaptor instance
    const createWebRTCAdaptor = () => {
      const pcConfig = {
        iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
      };

      const sdpConstraints = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
      };

      const mediaConstraints = {
        video: true,
        audio: true,
      };

      const appName = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
      let websocketURL;
      if (window.location.protocol.startsWith('https')) {
          websocketURL = `wss://${window.location.hostname}:5443${appName}websocket`;
        // Use wss if running on HTTPS
    }else{
        // websocketURL = `192.168.232.128:5080${appName}websocket`;
        // websocketURL = `ws://${"192.168.232.128"}:5080${appName}`;
        websocketURL =`ws://192.168.232.128:5080/WebRTCAppEE/websocket`

    }
    console.log("websocketURL >><><><><><>",websocketURL);
      try {
      const newWebRTCAdaptor = new WebRTCAdaptor({
        websocket_url: websocketURL,
        mediaConstraints,
        peerconnection_config: pcConfig,
        sdp_constraints: sdpConstraints,
        localVideoId: 'localVideo',
        remoteVideoId: 'remoteVideo',
        callback: (info) => {
          if (info === 'initialized') {
            console.log('initialized');
          } else if (info === 'joined') {
            console.log('joined');
          } else if (info === 'leaved') {
            console.log('leaved');
          }
        },
        callbackError: (error) => {
          console.log(`error callback: ${error}`);
          // $.notify(error, {
          //   autoHideDelay: 5000,
          //   className: 'error',
          //   position: 'top center',
          // });
        },
      });
      console.log("newWebRTCAdaptor ><><><><><><><><><><>",newWebRTCAdaptor.websocket_url);
      setWebRTCAdaptor(newWebRTCAdaptor);
    } catch (error) {
        console.error('Error creating WebRTCAdaptor:', error);
      }
    };

    createWebRTCAdaptor();

    // Cleanup on unmount
    return () => {
      if (webRTCAdaptor) {
        webRTCAdaptor.stop();
      }
    };
  }, []);

//   const handleJoin = () => {
//     console.log("webRTCAdaptor===",webRTCAdaptor);
//     if (webRTCAdaptor) {
//       webRTCAdaptor.join(streamNameRef.current.value);
//     }
//   };

const handleJoin = () => {
    console.log("webRTCAdaptor ===", webRTCAdaptor);
    if (webRTCAdaptor) {
      console.log("Joining with stream name:", streamNameRef.current.value);
      webRTCAdaptor.join(streamNameRef.current.value);
    }
  };

  const handleLeave = () => {
    if (webRTCAdaptor) {
      webRTCAdaptor.leave(streamNameRef.current.value);
    }
  };

  const handleTurnOnCamera = () => {
    if (webRTCAdaptor) {
      webRTCAdaptor.turnOnLocalCamera(streamNameRef.current.value);
    }
  };

  const handleTurnOffCamera = () => {
    if (webRTCAdaptor) {
      webRTCAdaptor.turnOffLocalCamera(streamNameRef.current.value);
    }
  };

  const handleMuteMic = () => {
    if (webRTCAdaptor) {
      webRTCAdaptor.muteLocalMic();
    }
  };

  const handleUnmuteMic = () => {
    if (webRTCAdaptor) {
      webRTCAdaptor.unmuteLocalMic();
    }
  };

  return (
    <div className="container" style={{ padding: '40px 15px', textAlign: 'center' }}>
      <div className="header clearfix">
        <div className="row">
          <h3 className="col text-muted">WebRTC Peer to Peer</h3>
        </div>
      </div>

      <video id="localVideo" ref={localVideoRef} autoPlay muted controls playsInline width="480"></video>
      <video id="remoteVideo" ref={remoteVideoRef} autoPlay controls playsInline width="480"></video>
      <br /> <br />
      <div className="input-group offset-sm-2 col-sm-8">
        <input type="text" className="form-control" defaultValue="stream1" ref={streamNameRef} placeholder="Type stream name" />
        <span className="input-group-btn">
          <button className="btn btn-primary" onClick={handleJoin} >
            Join
          </button>
          <button className="btn btn-primary" onClick={handleLeave} disabled={!webRTCAdaptor}>
            Leave
          </button>
        </span>
      </div>
      <div style={{ padding: 10 }}>
        <button className="btn btn-outline-primary" onClick={handleTurnOffCamera} disabled={!webRTCAdaptor}>
          Turn off Camera
        </button>
        <button className="btn btn-outline-primary" onClick={handleTurnOnCamera} disabled={!webRTCAdaptor}>
          Turn on Camera
        </button>
        <button className="btn btn-outline-primary" onClick={handleMuteMic} disabled={!webRTCAdaptor}>
          Mute Local Mic
        </button>
        <button className="btn btn-outline-primary" onClick={handleUnmuteMic} disabled={!webRTCAdaptor}>
          Unmute Local Mic
        </button>
      </div>
    </div>
  );
};

export default PeerToPeer;
