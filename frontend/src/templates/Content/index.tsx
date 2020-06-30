import React from 'react';

import useStyles from './styles';

const Content: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      { children }
    </main>
  );
};

export default Content;
