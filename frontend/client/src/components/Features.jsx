import React from "react";
import { motion } from "framer-motion";

function Features() {
  return (
    <section id="features" className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white py-24 px-6">

      {/* Section Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light">
          Why Choose
          <span className="text-blue-400 font-semibold"> Edunova.AI</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Built with modern AI technology for smarter learning.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {[
          { title: "AI Learning", desc: "Personalized AI-powered education support.", delay: 0 },
          { title: "Analytics", desc: "Track learning performance in real time.", delay: 0.2 },
          { title: "Interactive UI", desc: "Modern and engaging learning experience.", delay: 0.4 },
        ].map(({ title, desc, delay }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 shadow-sm dark:shadow-none"
          >
            <h3 className="text-2xl mb-4 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400">{desc}</p>
          </motion.div>
        ))}

      </div>
    </section>
  );
}

export default Features;
