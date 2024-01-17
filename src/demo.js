import React, { useState, useEffect } from 'react';
import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
// import 'notify.min.js';

const WebRTCComponent = () => {
  const [webRTCAdaptor, setWebRTCAdaptor] = useState(null);
  const [streamName, setStreamName] = useState('stream1');
  const antMediaServerIP = '192.168.232.128'; // Replace with your Ant Media Server IP or domain
    console.log("webRTCAdaptor ><><><><>",webRTCAdaptor);
  useEffect(() => {
    
    const initializeWebRTCAdaptor = async () => {
        try {
        //   alert(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
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
        const websocketURL = window.location.protocol.startsWith('https')
          ? `wss://${antMediaServerIP}:5443${appName}`
          : `ws://${antMediaServerIP}:5080${appName}`;
        console.log("websocketURL >>>",websocketURL);
        const newWebRTCAdaptor = new WebRTCAdaptor({
            
          websocket_url: websocketURL,
          mediaConstraints,
          peerconnection_config: pcConfig,
          sdp_constraints: sdpConstraints,
          localVideoId: 'localVideo',
          remoteVideoId: 'remoteVideo',
          callback: (info) => handleCallback(info,console.log("info >>>>>",info)),
          callbackError: (error) => handleCallbackError(error,console.log("errrrrrrrrrrr")),
        });

        setWebRTCAdaptor(newWebRTCAdaptor);
        // Additional initialization logic if needed
      } catch (error) {
        console.error('Error initializing WebRTCAdaptor:', error);
      }
    };

    initializeWebRTCAdaptor();
  }, []); // empty dependency array means it runs once after the component mounts

  const handleCallback = (info) => {
    if (info === 'initialized') {
      console.log('initialized');
    } else if (info === 'joined') {
      console.log('joined');
    } else if (info === 'leaved') {
      console.log('leaved');
    }else if(info ==="closed"){
      console.log('close socket');
    }else if(info ==="available_devices"){
        console.log('available_devices socket');
      }else if(info ==="browser_screen_share_supported"){
        console.log('browser_screen_share_supported socket');
      }
  };

  const handleCallbackError = (error) => {
    
    console.log('error callback: ' + error);
    // window.$.notify(error, {
    //   autoHideDelay: 5000,
    //   className: 'error',
    //   position: 'top center',
    // });
  };

  const join = () => {
    
    if (webRTCAdaptor) {
      webRTCAdaptor.join(streamName);
    }
  };

  const leave = () => {
    
    if (webRTCAdaptor) {
      webRTCAdaptor.leave(streamName);
    }
  };

  // ... rest of the component ...

  return (
    <div className="container" style={{ padding: '40px 15px', textAlign: 'center' }}>
      {/* ... (Rest of your HTML structure) ... */}
      <input
        type="text"
        className="form-control"
        value={streamName}
        onChange={(e) => setStreamName(e.target.value)}
        placeholder="Type stream name"
      />
      <span className="input-group-btn">
        <button className="btn btn-primary" onClick={join} disabled={!webRTCAdaptor}>
          Join
        </button>
        <button className="btn btn-primary" onClick={leave} disabled={!webRTCAdaptor}>
          Leave
        </button>
      </span>
      {/* ... (Rest of your HTML structure) ... */}
    </div>
  );
};

export default WebRTCComponent;
