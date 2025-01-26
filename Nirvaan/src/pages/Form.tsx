import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useIsSafari } from '../hooks/useIsSafari';

const ChatIcon = () => (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const API_URL = import.meta.env.VITE_API_URL;

function Form(): JSX.Element {
    const isSafari = useIsSafari();
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_URL}/submit`, {
                phone_number: countryCode + phone
            });
            localStorage.setItem("callId", response.data);
            navigate("/call-progress", { state: { from: 'app' } });
        } catch (error) {
            console.error("Error:", error);
            navigate("/error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 sm:px-8 max-w-2xl mx-auto w-full py-12 sm:py-16"
        >
            <header className="flex flex-col items-center text-center gap-y-8">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-48 sm:w-56 md:w-64 pointer-events-none"
                >
                    <source 
                        src={isSafari ? "/waves.mov" : "/waves.webm"} 
                        type={isSafari ? "video/quicktime" : "video/webm"} 
                    />
                </video>
                <div className="space-y-6">
                    <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-500 bg-clip-text text-transparent text-6xl sm:text-7xl md:text-8xl font-heading">
                        Nirvaan
                    </h1>
                    <div className="space-y-3">
                        <h2 className="text-xl sm:text-2xl text-neutral-100 font-bold font-body">
                            Your Trusted Mental Health Companion
                        </h2>
                        <p className="text-neutral-300 font-body text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                            Connect with our empathetic AI assistant for a supportive conversation about your feelings. We're here 24/7, ready to listen without judgement.
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                <div className="relative">
                    <label className="block text-sm font-medium text-neutral-200 mb-3">
                        Enter your phone number to begin your journey:
                    </label>
                    <div className="flex">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="h-full px-4 py-3 flex items-center gap-2 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-l-xl hover:bg-neutral-800 transition-colors focus:outline-none"
                            >
                                <img 
                                    src={countryCode === "+91" ? "/in.svg" : "/us.svg"}
                                    alt={countryCode === "+91" ? "India" : "USA"}
                                    className="w-5 h-4"
                                />
                                <span className="text-neutral-200">{countryCode}</span>
                                <svg
                                    className="w-4 h-4 text-neutral-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute mt-2 w-48 bg-neutral-800/90 backdrop-blur-xl border border-neutral-700 rounded-xl shadow-xl z-50"
                                >
                                    {[
                                        { code: "+91", country: "India", flag: "/in.svg" },
                                        { code: "+1", country: "United States", flag: "/us.svg" },
                                    ].map((option) => (
                                        <button
                                            key={option.code}
                                            type="button"
                                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                            onClick={() => {
                                                setCountryCode(option.code);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            <img src={option.flag} alt={option.country} className="w-5 h-4" />
                                            <span className="text-neutral-200">{option.country}</span>
                                            <span className="ml-auto text-neutral-400">{option.code}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 bg-neutral-800/50 backdrop-blur-sm text-neutral-200 border border-l-0 border-neutral-700 rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={loading || !phone}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl font-medium 
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                        shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200
                        flex items-center justify-center gap-3 text-lg"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Connecting...
                        </span>
                    ) : (
                        <>
                            <ChatIcon />
                            <span>Begin Your Journey</span>
                            <svg 
                                className="w-5 h-5" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14m-7-7l7 7-7 7" />
                            </svg>
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
}

export default Form;
