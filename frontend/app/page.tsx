'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useTransform, useScroll } from 'framer-motion';
import { 
  FiUpload, 
  FiActivity, 
  FiBarChart2, 
  FiGlobe, 
  FiArrowRight, 
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiPlay,
  FiInfo
} from 'react-icons/fi';
import { FaLeaf, FaSeedling } from 'react-icons/fa';
import { FaBoxesStacked } from 'react-icons/fa6';
import ScrollIndicator from './components/ScrollIndicator';

export default function Home() {
  useEffect(() => {
    console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
    console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    console.log("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
    console.log("NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
    console.log("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
  }, []);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalScroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: FiUpload, title: "Easy Image Upload", color: "bg-amber-400" },
    { icon: FiActivity, title: "Accurate Detection", color: "bg-emerald-400" },
    { icon: FiBarChart2, title: "Detailed Analysis", color: "bg-teal-400" },
    { icon: FiGlobe, title: "Global Impact", color: "bg-sky-400" },
  ];


  //FLoating Elements
  const [floatingLeaves, setFloatingLeaves] = useState<{ id: number; style: { left: string; top: string; scale: number; rotate: number } }[]>([]);
  
  useEffect(() => {
    const leaves = [...Array(12)].map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        scale: 0.5 + Math.random() * 0.5,
        rotate: Math.random() * 360
      }
    }));
    setFloatingLeaves(leaves);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Floating Leaves Background */}
            <div className="fixed inset-0 pointer-events-none">
              {floatingLeaves.map((leaf) => (
                <motion.div
                  key={leaf.id}
                  className="absolute text-green-300/30"
                  initial={{ y: 0, x: 0, rotate: leaf.style.rotate }}
                  animate={{
                    y: [0, -100, -200, 0],
                    x: [0, 50, -50, 0],
                    rotate: leaf.style.rotate + 360
                  }}
                  transition={{
                    duration: 15 + Math.random() * 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={leaf.style}
                >
                  <FaLeaf className="w-8 h-8" />
                </motion.div>
              ))}
            </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <FaLeaf className="text-emerald-900 w-24 h-24 mb-8 animate-float" />
            <div className="absolute inset-0 bg-emerald-100 blur-2xl opacity-50 rounded-full" />
          </div>
            <h1 className="text-6xl font-bold text-emerald-800 mb-6 font-sans font-poppins font-extrabold">
            Vriksh<span className="text-stone-700">Ved</span>
            </h1>
          <p className="text-2xl text-emerald-700 mb-12 max-w-2xl leading-relaxed font-semibold">
            "Smart plant care assistant for accurate identification and health diagnosis."
          </p>
          <motion.div whileHover={{ scale: 1 }}>
            <Link
              href="/upload"
              className="inline-flex items-center px-12 py-5 bg-emerald-800 text-white rounded-full 
              hover:bg-emerald-900 transition-all shadow-lg text-lg font-medium group"
            >
              <span>Get Started</span>
              <FiArrowRight className="ml-4 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }

        @keyframes scroll-pulse {
        0% { transform: translateY(0); opacity: 0.8; }
        50% { transform: translateY(8px); opacity: 1; }
        100% { transform: translateY(0); opacity: 0.8; }
      }
      `}</style>
    </div>
  );
}