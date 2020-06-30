import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { useDrawer } from '../../contexts/drawer';

import useStyles from './styles';

const Header: React.FC = () => {
  const classes = useStyles();

  const { open, setOpen } = useDrawer();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          <b>Matricula</b>
          {' '}
          Alunos
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
