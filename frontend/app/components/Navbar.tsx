"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { FaLeaf } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../store/languageSlice";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const dispatch = useDispatch();
  const currentLanguage = useSelector(
    (state: any) => state.language.currentLanguage
  );

  const languages = ["English", "Hindi", "Marathi", "Tamil"];
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Model", path: "/about" },
  ];

  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    closed: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -15 },
  };

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 top-4 z-50 w-[90%] md:w-[65%] bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <FaLeaf className="w-9 h-9 text-emerald-600" />
          <span className="text-3xl font-bold text-slate-800">VrikshVed</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-slate-600 hover:text-slate-800 font-medium">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowLangMenu((s) => !s)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-emerald-100/60 text-emerald-700 font-medium shadow-sm hover:bg-emerald-200/70 transition-all">
              {currentLanguage}
            </motion.button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        dispatch(setLanguage(lang));
                        setShowLangMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-slate-700 hover:bg-emerald-50 transition ${
                        currentLanguage === lang
                          ? "bg-emerald-50 font-semibold text-emerald-700"
                          : ""
                      }`}>
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          onClick={() => setMobileMenuOpen((s) => !s)}
          className="md:hidden p-2.5 rounded-xl hover:bg-slate-100/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          {mobileMenuOpen ? (
            <HiX className="w-7 h-7 text-slate-700" />
          ) : (
            <HiOutlineMenu className="w-7 h-7 text-slate-700" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden absolute w-full top-20 bg-white/90 backdrop-blur-xl border-t border-white/20 shadow-glass">
            <div className="px-6 py-5 space-y-3">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <Link
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-5 py-3.5 text-slate-700 hover:bg-slate-100/50 rounded-xl transition-colors">
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Language Selector */}
              <div className="mt-4">
                <label className="text-slate-600 font-medium block mb-2">
                  Select Language:
                </label>
                <select
                  value={currentLanguage}
                  onChange={(e) => dispatch(setLanguage(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition">
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
