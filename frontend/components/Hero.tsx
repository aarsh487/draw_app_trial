"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Cloudy, Handshake, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

export const Hero = () => {

    const [token, setToken] = useState<string | null>(null);
  
    useEffect(() => {
      const storedToken = localStorage.getItem('authorization');
      setToken(storedToken);
    }, []);
  const router = useRouter();

  const routeToRooms = () => {
    if(token){
      router.push('/create-room')
    }
    router.push('/signin')
  }
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f7f9fb] to-[#e0e7ef] flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 mt-20 mb-20">
        <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-6xl p-10 flex flex-col md:flex-row items-center gap-10">
          {/* Text Content */}
          <div className="flex-1">
            <motion.h1
              className={`text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight`}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Create, <span className="text-primary">Collaborate</span>, and
              Share Your Art
            </motion.h1>

            <motion.p
              className="text-gray-500 text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Experience real-time collaborative drawing. Share ideas, sketch
              freely, and build beautiful creations with your team and friends!
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <Button
                variant="primary"
                className="px-6 rounded-full text-white text-lg"
                onClick={() => (routeToRooms())}
              >
                Create Room
              </Button>
            </motion.div>

            <p className="text-gray-400 mt-8 text-sm leading-relaxed">
              Get started for free. Collaborate instantly and unleash your
              creativity today.
            </p>
          </div>

          {/* Image Content */}
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-auto"
            >
              <Image
                alt="Creative Team Drawing"
                src="/images/icon3.png"
                width={1000}
                height={1000}
                className="w-full h-auto object-contain"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Why You'll Love It
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 flex flex-col items-center gap-2 bg-gray-50 rounded-2xl hover:shadow-xl transition-all">
            <div className="text-orange-400 text-4xl mb-2"><Palette size={40} /></div>
            <h3 className="font-bold text-xl text-black">Intuitive Interface</h3>
              <p className="text-gray-500">
                Simple and easy-to-use drawing tools that feel natural and
                powerful.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 flex flex-col items-center gap-2 bg-gray-50 rounded-2xl hover:shadow-xl transition-all">
              {/* <div className="text-pink-400 text-4xl mb-4">🤝</div> */}
              <div className="text-orange-400 text-4xl mb-2"><Handshake size={40} /></div>
              <h3 className="font-bold text-xl text-black">
                Real-Time Collaboration
              </h3>
              <p className="text-gray-500">
                Draw together with your team from anywhere in the world with
                instant updates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 flex flex-col items-center gap-2 bg-gray-50 rounded-2xl hover:shadow-xl transition-all">
              {/* <div className="text-blue-400 text-4xl mb-4">☁️</div> */}
              <div className="text-orange-400 text-4xl mb-2"><Cloudy size={40} /></div>

              <h3 className="font-bold text-xl text-black">Cloud Storage</h3>
              <p className="text-gray-500">
                Your creations are automatically saved and securely backed up in
                the cloud.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row justify-around gap-10">
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg">
              <div className="text-green-400 text-4xl mb-4">1</div>
              <h3 className="font-bold text-xl mb-2">Create a Room</h3>
              <p className="text-gray-500">
                Set up a room for you and your team to join and start
                collaborating instantly.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg">
              <div className="text-blue-400 text-4xl mb-4">2</div>
              <h3 className="font-bold text-xl mb-2">Invite Team Members</h3>
              <p className="text-gray-500">
                Send invites to your colleagues or friends to join your creative
                space.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl shadow-lg">
              <div className="text-purple-400 text-4xl mb-4">3</div>
              <h3 className="font-bold text-xl mb-2">Start Drawing</h3>
              <p className="text-gray-500">
                Let the creativity flow as you sketch, design, and iterate in
                real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#f7f9fb] to-[#e0e7ef] text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Start collaborating and creating with your team today!
        </p>
        <Button
          variant="primary"
          className="px-8 rounded-full text-white text-lg"
          onClick={() => (routeToRooms())}
        >
          Create Your Room Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#f5f7f9] text-center text-gray-500 text-sm">
        © 2025 Aarsh Creative App. All rights reserved.
      </footer>
    </section>
  );
};
