import React, { useState } from 'react'

const BillingViewSelectedLabtests = ({selectedLabRequests, setSelectedLabRequests}) => {
    const [selectedPayMethodOptions, setSelectedPayMethodOptions] = useState({});

    const handleToggle = (itemId, option) => {
        setSelectedLabRequests(prevState => {
          const itemIndex = prevState.findIndex(item => item.id === itemId);
      
          if (itemIndex !== -1) {
            return [
              ...prevState.slice(0, itemIndex), // All items before the updated item
              {
                ...prevState[itemIndex],
                payMethod: option === prevState[itemIndex].payMethod ? "cash" : option, // Add paymentMethod selected and cash if unselected
              },
              ...prevState.slice(itemIndex + 1), // All items after the updated item
            ];
          }
      
          // If the item is not found, return the original state
          return prevState;
        });
      };


  return (
    <div className='space-y-2'>
        <h2 className='text-primary'> Lab Test Requests </h2>
        <ul>
            {selectedLabRequests.map(testReq=> (
                <li className='flex justify-between text-xs' key={testReq.id}>
                <span className='w-full'>{testReq.test_profile_name}</span> 
                <div className='flex gap-2 text-xs w-full px-2'>
                    <div className='flex gap-2 text-xs'>
                    <p
                        className={`text-success ${testReq.payMethod === 'mpesa' ? 'font-bold' : ''}`}
                        
                    >
                        M-Pesa
                    </p>
                    <input onClick={() => handleToggle(testReq.id, 'mpesa')} type='checkbox' checked={testReq.payMethod === 'mpesa'} />
                    </div>
                    <div className='flex gap-2 text-xs'>
                    <p
                        className={`text-orange ${testReq.payMethod === 'insurance' ? 'font-bold' : ''}`}
                    >
                        Insurance
                    </p>
                    <input onClick={() => handleToggle(testReq.id, 'insurance')} type='checkbox' checked={testReq.payMethod === 'insurance'} />
                    </div>
                </div>
                <span className='w-full flex justify-end'>{`ksh ${testReq.sale_price}`}</span>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default BillingViewSelectedLabtests