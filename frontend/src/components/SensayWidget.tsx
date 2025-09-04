
'use client';

// This is a placeholder for the Sensay Web Widget.
// In a real project, you would install the Sensay SDK and initialize it here.

import { useEffect } from 'react';

const SensayWidget = () => {
  useEffect(() => {
    // Example of what the Sensay SDK initialization might look like
    /*
    if (window.Sensay) {
      window.Sensay.init({
        appId: 'YOUR_SENSAY_APP_ID',
        user: {
          id: 'USER_123',
          name: 'John Doe',
        },
      });
    }
    */
   console.log("Sensay Widget placeholder loaded. Integrate Sensay SDK here.");
  }, []);

  return (
    <div
      id="sensay-widget-container"
      className="fixed bottom-4 right-4 w-16 h-16 bg-blue-600 rounded-full shadow-lg cursor-pointer flex items-center justify-center text-white text-2xl"
    >
      S
    </div>
  );
};

export default SensayWidget;
