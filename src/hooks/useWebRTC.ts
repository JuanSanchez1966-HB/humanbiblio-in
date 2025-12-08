import { useState, useRef, useCallback, useEffect } from 'react';

interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  isConnected: boolean;
  isCallActive: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  callType: 'voice' | 'video' | null;
}

interface WebRTCHook {
  state: WebRTCState;
  startCall: (type: 'voice' | 'video', recipientId: string) => Promise<void>;
  answerCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  sendMessage: (message: any) => void;
}

export function useWebRTC(): WebRTCHook {
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    isConnected: false,
    isCallActive: false,
    isMuted: false,
    isVideoEnabled: true,
    callType: null
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Configuración STUN servers (gratuitos para demo)
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(rtcConfiguration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // En producción, enviar candidate via signaling server
        console.log('ICE Candidate:', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      setState(prev => ({
        ...prev,
        remoteStream: event.streams[0]
      }));
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      setState(prev => ({
        ...prev,
        isConnected: pc.connectionState === 'connected'
      }));
    };

    return pc;
  }, []);

  const getMediaStream = useCallback(async (type: 'voice' | 'video') => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (localVideoRef.current && type === 'video') {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw new Error('No se pudo acceder a la cámara/micrófono');
    }
  }, []);

  const startCall = useCallback(async (type: 'voice' | 'video', recipientId: string) => {
    try {
      const stream = await getMediaStream(type);
      const pc = createPeerConnection();

      // Agregar tracks locales
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Crear oferta
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      setState(prev => ({
        ...prev,
        localStream: stream,
        peerConnection: pc,
        isCallActive: true,
        callType: type
      }));

      // En producción: enviar offer via signaling server
      console.log('Call started:', { type, recipientId, offer });
      
      // Simular respuesta automática para demo
      setTimeout(() => {
        simulateCallAnswer(pc, type);
      }, 2000);

    } catch (error) {
      console.error('Error starting call:', error);
      alert('Error al iniciar la llamada: ' + error.message);
    }
  }, [getMediaStream, createPeerConnection]);

  const simulateCallAnswer = async (pc: RTCPeerConnection, type: 'voice' | 'video') => {
    try {
      // Simular stream remoto
      const remoteStream = await getMediaStream(type);
      
      // Crear respuesta simulada
      const answer = await pc.createAnswer();
      await pc.setRemoteDescription(answer);

      setState(prev => ({
        ...prev,
        remoteStream,
        isConnected: true
      }));

    } catch (error) {
      console.error('Error in simulated answer:', error);
    }
  };

  const answerCall = useCallback(async () => {
    if (!state.peerConnection) return;

    try {
      const stream = await getMediaStream(state.callType || 'voice');
      
      stream.getTracks().forEach(track => {
        state.peerConnection!.addTrack(track, stream);
      });

      setState(prev => ({
        ...prev,
        localStream: stream,
        isCallActive: true
      }));

    } catch (error) {
      console.error('Error answering call:', error);
    }
  }, [state.peerConnection, state.callType, getMediaStream]);

  const endCall = useCallback(() => {
    // Detener streams
    state.localStream?.getTracks().forEach(track => track.stop());
    state.remoteStream?.getTracks().forEach(track => track.stop());

    // Cerrar peer connection
    state.peerConnection?.close();

    // Limpiar video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setState({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      isConnected: false,
      isCallActive: false,
      isMuted: false,
      isVideoEnabled: true,
      callType: null
    });
  }, [state.localStream, state.remoteStream, state.peerConnection]);

  const toggleMute = useCallback(() => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = state.isMuted;
        setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
      }
    }
  }, [state.localStream, state.isMuted]);

  const toggleVideo = useCallback(() => {
    if (state.localStream) {
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = state.isVideoEnabled;
        setState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
      }
    }
  }, [state.localStream, state.isVideoEnabled]);

  const sendMessage = useCallback((message: any) => {
    // En producción: enviar via data channel o signaling server
    console.log('Sending message:', message);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    state,
    startCall,
    answerCall,
    endCall,
    toggleMute,
    toggleVideo,
    sendMessage
  };
}