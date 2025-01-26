import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useIsSafari } from '../hooks/useIsSafari';

const API_URL = import.meta.env.VITE_API_URL;

function CallProgress(): JSX.Element {
  const navigate = useNavigate();
  const [callStatus, setCallStatus] = useState<string>('registered');
  const isSafari = useIsSafari();

  useEffect(() => {
    const fetchCallStatus = async () => {
      const callId = localStorage.getItem("callId");

      try {
        if (callId) {
          const response = await axios.get(`${API_URL}/call-details/${callId}`);
          
          setCallStatus(response.data.call_status || 'registered');
          
          if (response.data.call_status === 'ended') {
            navigate('/call-results', { state: { from: 'app' } });
          } else if (response.data.call_status === 'error') {
            setTimeout(() => navigate('/error'), 2000);
          }
        }
      } catch (error) {
        console.error("Error fetching call status:", error);
        setTimeout(() => navigate('/error'), 2000);
      }
    };

    fetchCallStatus();
    const intervalId = setInterval(fetchCallStatus, 2000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  const getStatusText = () => {
    switch (callStatus) {
      case 'registered':
        return 'Initiating your call...';
      case 'ongoing':
        return 'Your conversation is in progress...';
      case 'error':
        return 'There was an error with your call...';
      default:
        return 'Processing your conversation...';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <video autoPlay loop muted playsInline className="w-1/2 sm:w-1/4 md:w-1/6 pointer-events-none">
        <source 
          src={isSafari ? "/blob.mov" : "/blob.webm"} 
          type={isSafari ? "video/quicktime" : "video/webm"} 
        />
      </video>
      <div className="text-center mt-8 space-y-6">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-heading py-4">
          {getStatusText()}
        </h2>
        <p className="text-neutral-200 text-lg sm:text-xl md:text-2xl font-body">
          Your call is currently in progress. The phone should ring anytime now. The analysis will appear once the call is completed.
        </p>
      </div>
    </motion.div>
  );
}

export default CallProgress;
