import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { CircularProgress } from 'material-ui';

const CircularProgress = () => (
  <div>
    <CircularProgress 
     size={100} //set size
     thickness={5}//set thinkness
     mode= "indeterminate"//set mode 
     color="#616161"//set color
     value={0.25}//set speed
     />
     
  </div>
);

export default CircularProgressExampleSimple;
