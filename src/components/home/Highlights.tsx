import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Tent, Flame, Mountain } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';

interface HighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Highlight: React.FC<HighlightProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.2, duration: 0.5 }}
    >
      <Card className="h-full">
        <CardContent className="flex flex-col items-center text-center">
          <div className="text-brunswick-green mb-4 p-3 bg-brunswick-green/10 rounded-full">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2 font-montserrat text-brunswick-green">{title}</h3>
          <p className="text-black/70">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Highlights: React.FC = () => {
  const highlights = [
    {
      icon: <Droplets size={32} />,
      title: 'Lake Activities',
      description: 'Enjoy swimming, boating, and fishing in our crystal-clear private lake with stunning mountain views.',
    },
    {
      icon: <Tent size={32} />,
      title: 'Premium Accommodations',
      description: 'Choose from luxury cottages to rustic tents, all designed for comfort while staying close to nature.',
    },
    {
      icon: <Flame size={32} />,
      title: 'Evening Campfires',
      description: 'Gather around our community campfire for storytelling, s\'mores, and stargazing experiences.',
    },
    {
      icon: <Mountain size={32} />,
      title: 'Hiking Adventures',
      description: 'Explore miles of scenic trails through forests and hills with guides or self-guided options.',
    },
  ];

  return (
    <section id="highlights" className="section-padding bg-baby-powder">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-brunswick-green">
            An Unforgettable Nature Experience
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-black/70">
            Discover what makes Plumeria Retreat the perfect destination for your next getaway.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <Highlight
              key={index}
              icon={highlight.icon}
              title={highlight.title}
              description={highlight.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;