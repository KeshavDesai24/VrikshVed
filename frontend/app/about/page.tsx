'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';
import { PiHeadCircuitFill } from "react-icons/pi";
import { FiCode, FiLayers, FiTrendingUp, FiZap } from 'react-icons/fi';
import Link from 'next/link';

interface Leaf {
  id: number;
  style: {
    left: string;
    top: string;
    scale: number;
    rotate: number;
  };
}

const features = [
    { 
      icon: FiZap, 
      title: "Transfer Learning",
      content: "Utilized pretrained weights from ResNet50 and EfficientNet architectures",
      color: "bg-emerald-100"
    },
    { 
      icon: FiLayers, 
      title: "Deep CNN Architecture",
      content: "8 convolutional layers with max pooling and batch normalization",
      color: "bg-teal-100"
    },
    { 
      icon: FiCode, 
      title: "Optimization",
      content: "Adam optimizer with learning rate scheduling and early stopping",
      color: "bg-sky-100"
    },
  ];

export default function ModelPage() {
  const [floatingLeaves, setFloatingLeaves] = useState<Array<Leaf>>([]);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    // Generate floating leaves for background animation
    const generatedLeaves = Array(12).fill(null).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        scale: 0.5 + Math.random() * 0.5,
        rotate: Math.random() * 360,
      },
    }));
    setFloatingLeaves(generatedLeaves);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden pt-25">
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
              rotate: leaf.style.rotate + 360,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={leaf.style}
          >
            <FaLeaf className="w-8 h-8" />
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 text-center px-4 relative max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div whileHover={{ scale: 1.1 }}>
            <PiHeadCircuitFill className="text-emerald-900 w-24 h-24 mb-8 animate-float" />
            </motion.div>
            <div className="absolute inset-0 bg-emerald-100 blur-2xl opacity-50 rounded-full" />
          </div>
          <h1 className="text-6xl font-bold text-emerald-800 mb-6 font-poppins">
            Our ML Model
          </h1>
          <p className="text-2xl text-emerald-700 mb-12 max-w-2xl mx-auto font-semibold">
            An in-depth look at the architecture, frameworks, and innovative techniques behind our AI-powered plant disease detection.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/upload"
              className="inline-flex items-center px-12 py-5 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 transition-all shadow-lg text-lg font-medium"
            >
              Explore More
              <FiTrendingUp className="ml-4 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
    );
  }
