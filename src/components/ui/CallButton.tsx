import React from 'react';
import { Phone } from 'lucide-react';

const CallButton: React.FC = () => {
	const phoneNumber = '+919226869678';

	return (
		<a
			href={`tel:${phoneNumber}`}
			className="fixed bottom-4 right-6 z-50 bg-rose-taupe hover:bg-rose-taupe/90 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
			aria-label="Call us"
		>
			<Phone size={24} />
		</a>
	);
};

export default CallButton;


