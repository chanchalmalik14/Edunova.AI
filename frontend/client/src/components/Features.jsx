import React from "react";
import { motion } from "framer-motion";

function Features() {
  return (
<section
  id="features"
  className="bg-gray-950 text-white py-24 px-6"
>

      {/* Section Heading */}
      <div className="text-center mb-16">

        <h2 className="text-4xl font-light">
          Why Choose
          <span className="text-blue-400 font-semibold">
            {" "}Edunova.AI
          </span>
        </h2>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Built with modern AI technology for smarter learning.
        </p>

      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
        >

          <h3 className="text-2xl mb-4">
            AI Learning
          </h3>

          <p className="text-gray-400">
            Personalized AI-powered education support.
          </p>

        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
        >

          <h3 className="text-2xl mb-4">
            Analytics
          </h3>

          <p className="text-gray-400">
            Track learning performance in real time.
          </p>

        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
        >

          <h3 className="text-2xl mb-4">
            Interactive UI
          </h3>

          <p className="text-gray-400">
            Modern and engaging learning experience.
          </p>

        </motion.div>

      </div>

    </section>
  );
}

export default Features;