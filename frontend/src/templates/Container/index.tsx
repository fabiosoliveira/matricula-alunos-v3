import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import useStyles from './styles';

const Container: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      { children }
    </div>
  );
};

export default Container;
