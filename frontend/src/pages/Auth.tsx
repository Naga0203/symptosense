import React from 'react';
import Navbar from '../components/landing/Navbar';
import AuthForm from '../components/auth/AuthForm';

export default function Auth() {
  return (
    <div className="min-h-screen mesh-gradient flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <AuthForm />
      </main>

      <footer className="py-8 text-center text-slate-600 text-[10px] tracking-widest uppercase">
        © 2026 SymptoSense Intelligence • SECURE HEALTH AUTHENTICATION
      </footer>
    </div>
  );
}
