import React, { useEffect, useState } from 'react';
import './styles.css';
import { io } from 'socket.io-client';

const socket = io();

export default function App() {
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState('Carregando...');

  useEffect(() => {
    // Receber QR Code do backend
    socket.on('qr', (qrUrl) => {
      setQrCode(qrUrl); // Atualiza o QR Code quando disponível
      setStatus('Running'); // Atualiza o status após carregar o QR Code
    });

    // Atualizar status do sistema
    socket.on('status', (status) => {
      setStatus(status === 'connected' ? 'Conectado!' : 'Carregando...');
    });

    // Listener para erros de conexão
    socket.on('connect_error', () => {
      setStatus('Erro de conexão. Tentando novamente...');
    });

    // Limpar os listeners quando o componente é desmontado
    return () => {
      socket.off('qr');
      socket.off('status');
      socket.off('connect_error');
    };
  }, []);

  // Função para pausar o chat
  const handlePause = () => {
    socket.emit('pause'); // Envia o comando de pausa para o backend
  };

  // Função para retomar o chat
  const handleResume = () => {
    socket.emit('resume'); // Envia o comando de retomada para o backend
  };

  return (
    <div className="App">
      <h1>Gerenciador de Mensagens do WhatsApp</h1>
      <div id="qr-container">
        <h2>Escaneie o QR Code para conectar</h2>
        {qrCode ? (
          <img id="qr-code" src={qrCode} alt="QR Code" />
        ) : (
          <p>Carregando QR Code...</p> // Exibe a mensagem enquanto o QR Code não estiver disponível
        )}
      </div>
      <div id="status">
        <p>Status: <span id="status-text">{status}</span></p>
      </div>
      <button id="pause-btn" onClick={handlePause}>Pausar</button>
      <button id="resume-btn" onClick={handleResume}>Continuar</button>
    </div>
  );
}
