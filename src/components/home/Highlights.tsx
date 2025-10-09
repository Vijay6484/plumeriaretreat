import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Home as HomeIcon, Sparkles, MapIcon } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';

interface HighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  gradient: string;
}

const Highlight: React.FC<HighlightProps> = ({ icon, title, description, delay, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.15, duration: 0.6, ease: "easeOut" }}
      className="group"
    >
      <Card className="h-full hover:shadow-2xl border border-gray-100">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${gradient} transform group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 font-montserrat text-primary">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Highlights: React.FC = () => {
  const highlights = [
    {
      icon: <Waves size={36} />,
      title: 'Waterfront Excellence',
      description: 'Immerse yourself in pristine lakeside beauty with exclusive water activities and breathtaking panoramic vistas.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <HomeIcon size={36} />,
      title: 'Luxury Accommodations',
      description: 'Experience refined comfort in our meticulously designed cottages and premium tents, blending elegance with natural charm.',
      gradient: 'from-primary to-primary-dark'
    },
    {
      icon: <Sparkles size={36} />,
      title: 'Twilight Gatherings',
      description: 'Unwind at our curated evening experiences featuring gourmet refreshments and celestial observation sessions.',
      gradient: 'from-accent to-amber-600'
    },
    {
      icon: <MapIcon size={36} />,
      title: 'Curated Adventures',
      description: 'Embark on guided expeditions through picturesque landscapes, tailored to your preferences and adventure level.',
      gradient: 'from-emerald-500 to-teal-600'
    },
  ];

  return (
    <section id="highlights" className="section-padding bg-gradient-to-b from-neutral-light to-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 font-montserrat text-neutral-dark">
            Elevated Lakeside Living
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Discover what sets Serene Stays apart as your premier destination for refined waterfront escapes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => (
            <Highlight
              key={index}
              icon={highlight.icon}
              title={highlight.title}
              description={highlight.description}
              delay={index}
              gradient={highlight.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
