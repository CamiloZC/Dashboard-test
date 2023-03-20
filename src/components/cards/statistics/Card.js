import PropTypes from 'prop-types';

// material-ui
import { Box, Grid, Typography } from '@mui/material';

// assets
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticCard = ({ count, percentage, subInfo }) => {

    const isLoss = parseFloat(percentage) < 0 ? true : false;
    
    return(
    <Grid container alignItems="left" direction="column" xs={4}>
        <Grid container direction="row" flexWrap="nowrap">
            <Grid item>
                {<Typography variant="h4" color="inherit">
                    {count}
                </Typography>}
            </Grid>
            {percentage && (
                <Grid>
                    <Typography color={isLoss ? 'red' : 'green'}>
                        {!isLoss && <CaretUpOutlined style={{ fontSize: '0.75rem', color: 'green' }} />}
                        {isLoss && <CaretDownOutlined style={{ fontSize: '0.75rem', color: 'red' }} />}
                        {percentage}
                    </Typography>
                </Grid>
            )}
        </Grid>
        <Box>
            <Typography variant="caption" color="textSecondary">
                <Typography component="span" variant="caption">
                    {subInfo}
                </Typography>
            </Typography>
        </Box>
    </Grid>
);
}
export default AnalyticCard;
