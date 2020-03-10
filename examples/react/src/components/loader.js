import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

function Loader() {
    return (
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 500}}> 
        <CircularProgress />
    </div>
    );
  }
  
  export default Loader;
  