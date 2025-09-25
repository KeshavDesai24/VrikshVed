"use client";



import React, { JSX, useEffect, useState } from "react";

import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

import { HiOutlineMenu, HiX } from "react-icons/hi";

import { FaLeaf } from "react-icons/fa";

import { Playfair_Display } from "next/font/google";



const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });



type NavLink = { name: string; path: string };



export default function Navbar(): JSX.Element {

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [scrolled, setScrolled] = useState<boolean>(false);



  useEffect(() => {

    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);



  const navLinks: NavLink[] = [

    { name: "Home", path: "/" },

    { name: "Model", path: "/about" },

  ];



  const menuVariants = {

    open: {

      opacity: 1,

      y: 0,

      transition: { type: "spring", mass: 0.5, staggerChildren: 0.1, delayChildren: 0.2 },

    },

    closed: {

      opacity: 0,

      y: -20,

      transition: { duration: 0.3, staggerChildren: 0.05, staggerDirection: -1 },

    },

  } as const;



  const itemVariants = {

    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },

    closed: { opacity: 0, y: -15, transition: { duration: 0.2 } },

  } as const;



  return (

    <nav

      className={`fixed left-1/2 -translate-x-1/2 top-4 z-50 transition-all duration-500 rounded-2xl ${

        scrolled ? "backdrop-blur-xl bg-white/30" : "backdrop-blur-lg bg-white/60"

      } border border-white/20 shadow-glass w-[90%] md:w-[65%]`}

    >

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center h-20">

          {/* Logo */}

          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>

            <Link href="/" className="flex items-center group space-x-3">

              <motion.div whileHover={{ rotate: -15, scale: 1.1 }} whileTap={{ scale: 0.95 }} className="origin-center">

                <FaLeaf className="w-9 h-9 text-emerald-600 transition-colors" />

              </motion.div>

              <span className={`${playfair.variable} text-3xl font-bold text-slate-800 tracking-tight`}>VrikshVed</span>

            </Link>

          </motion.div>



          {/* Desktop Navigation */}

          <div className="hidden md:flex items-center gap-8">

            <div className="flex gap-8">

              {navLinks.map((link) => (

                <motion.div key={link.name} whileHover={{ scale: 1.05 }}>

                  <Link href={link.path} className="relative text-slate-600 hover:text-slate-800 font-medium transition-colors">

                    <motion.span className="block relative py-1" initial={{ scale: 1 }} whileHover={{ scale: 1.05 }}>

                      {link.name}

                      <motion.span

                        className="absolute bottom-0 left-0 w-full h-px bg-emerald-500/50 origin-left"

                        initial={{ scaleX: 0 }}

                        whileHover={{ scaleX: 1 }}

                        transition={{ duration: 0.3 }}

                      />

                    </motion.span>

                  </Link>

                </motion.div>

              ))}

            </div>

          </div>



          {/* Mobile Menu Toggle */}

          <motion.button

            onClick={() => setMobileMenuOpen((s) => !s)}

            className="md:hidden p-2.5 rounded-xl hover:bg-slate-100/50"

            whileHover={{ scale: 1.05 }}

            whileTap={{ scale: 0.95 }}

          >

            {mobileMenuOpen ? <HiX className="w-7 h-7 text-slate-700" /> : <HiOutlineMenu className="w-7 h-7 text-slate-700" />}

          </motion.button>

        </div>

      </div>



      {/* Mobile Menu */}

      <AnimatePresence>

        {mobileMenuOpen && (

          <motion.div

            initial="closed"

            animate="open"

            exit="closed"

            variants={menuVariants}

            className="md:hidden absolute w-full top-20 bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-glass"

          >

            <div className="px-6 py-5 space-y-3">

              {navLinks.map((link) => (

                <motion.div key={link.name} variants={itemVariants}>

                  <Link href={link.path} onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3.5 text-slate-700 hover:bg-slate-100/50 rounded-xl transition-colors">

                    {link.name}

                  </Link>

                </motion.div>

              ))}

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        body {

          font-family: 'Poppins', sans-serif;

        }

      `}</style>

    </nav>

  );

}

