import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { testimonials } from '../../data';
import { renderStars } from '../../utils/helpers';
import Card, { CardContent } from '../ui/Card';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };
  
  return (
    <section className="section-padding bg-brunswick-green text-baby-powder">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat">
            What Our Guests Say
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-baby-powder/80">
            Read experiences from travelers who have enjoyed their stay at Plumeria Retreat.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Slider {...settings}>
            {testimonials.map((testimonial) => {
              const stars = renderStars(testimonial.rating);
              
              return (
                <div key={testimonial.id} className="px-4">
                  <Card className="text-center p-8 bg-opacity-10 bg-white">
                    <CardContent className="text-center">
                      <div className="mb-6 w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-rose-taupe">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        {stars.map((type, index) => (
                          <Star 
                            key={index}
                            size={20}
                            fill={type === 'empty' ? 'none' : '#FDFFFC'}
                            color="#FDFFFC"
                          />
                        ))}
                      </div>
                      
                      <blockquote className="text-lg italic mb-6 text-baby-powder/90">
                        "{testimonial.text}"
                      </blockquote>
                      
                      <div>
                        <h4 className="font-bold text-xl mb-1">{testimonial.name}</h4>
                        <p className="text-baby-powder/70">{testimonial.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </Slider>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;