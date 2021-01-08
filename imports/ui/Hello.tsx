import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ClicksCollection, Click } from '../api/clicks';

export const Hello = () => {
  //<<< const [counter, setCounter] = useState(0);
  const clicks = useTracker(() => {
    return ClicksCollection.find().fetch();
  });

  const increment = () => {
      ClicksCollection.insert({createdAt: new Date()});
    //<<< setCounter(counter + 1);
  };

  return (
    <div>
      <button onClick={increment}>Click Me</button>
      <p>You've pressed the button {clicks.length} times.</p>
    </div>
  );
};
