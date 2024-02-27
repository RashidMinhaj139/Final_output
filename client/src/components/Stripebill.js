import React, { useEffect, useState } from 'react';

const StripeBill = () => {
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch('https://api.stripe.com/v1/invoices/id', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer sk_test_51OWlUjSJVmxydYk7nN4BWM8Pon4qF85qfSKcgeV3wZGxkxpS53XXlngKWysIreznhoj92kmavAMQ3L9l3JqXphI300PxX50RRY:',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setInvoiceData(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      }
    };

    fetchInvoice();
  }, []); // Empty dependency array to ensure the effect runs only once when the component mounts

  return (
    <div>
      <h1>Invoice Data:</h1>
      <pre>{JSON.stringify(invoiceData, null, 2)}</pre>
    </div>
  );
};

export default StripeBill;
