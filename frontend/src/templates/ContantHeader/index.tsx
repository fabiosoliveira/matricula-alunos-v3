import React from 'react';
import Typography from '@material-ui/core/Typography';

interface IProps {
  title: string
  small: string
}

const ContantHeader: React.FC<IProps> = ({ title, small }) => (
  <section>
    <Typography variant="h5" component="h2" gutterBottom>
      {title}
      {' '}
      <small>{small}</small>
    </Typography>
  </section>
);

export default ContantHeader;
