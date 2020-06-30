import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { useDrawer } from '../../contexts/drawer';

import useStyles from './styles';

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
}

const ListItemLink: React.FC<ListItemLinkProps> = ({ icon, primary, to }) => {
  const CustomLink = React.useMemo(
    () => React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((linkProps, ref) => (
      <RouterLink ref={ref} to={to} {...linkProps} />
    )),
    [to],
  );

  return (
    <ListItem button component={CustomLink}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItem>
  );
};

const SideBar: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();

  const { open, setOpen } = useDrawer();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <List dense>
        <ListItemLink icon={<DashboardIcon />} primary="Dashboard" to="/" />
      </List>
      <Divider />
      <List dense>
        <ListItemLink icon={<MailIcon />} primary="Endereços" to="/endereco" />
        <ListItemLink icon={<InboxIcon />} primary="Responsável" to="/responsavel" />
      </List>
    </Drawer>
  );
};

export default SideBar;
