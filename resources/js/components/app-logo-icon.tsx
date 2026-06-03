import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg 
            {...props} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Custom Premium ERS Wellness Heart-Wave Icon */}
            <path style={{ fill: 'none' }} d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5" />
            <path style={{ fill: 'none' }} d="M12 5.5v15.5" strokeDasharray="3 3" strokeWidth="1" />
            <path style={{ fill: 'none' }} d="M5 11h2.5l1.5-3 2 7 2-9 1.5 5h4.5" />
        </svg>
    );
}
