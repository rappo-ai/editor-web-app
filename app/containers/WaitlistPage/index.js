/**
 *
 * WaitlistPage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';

import { getAccessToken } from 'utils/cookies';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { setupHeader } from 'containers/App/actions';
import { makeSelectUser } from 'containers/App/selectors';
import { updateUserProfile } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectWaitlistPage from './selectors';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  message: {
    marginTop: theme.spacing(1),
  },
  gridContainer: {
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export function WaitlistPage({
  user,
  waitlistPage,
  onSetupHeader,
  onUpdateClick,
}) {
  useInjectReducer({ key: 'waitlistPage', reducer });
  useInjectSaga({ key: 'waitlistPage', saga });

  const accessToken = getAccessToken();
  const classes = useStyles();
  const firstName = user.profile.givenName;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [useCase, setUseCase] = useState('');

  const [updateStatusSnackbarOpen, setUpdateStatusSnackbarOpen] = useState(
    false,
  );

  useEffect(() => {
    if (user && user.profile) {
      setPhoneNumber(user.profile.phoneNumber || '');
      setLinkedinUrl(user.profile.linkedinUrl || '');
      setUseCase(user.profile.useCase || '');
    }
  }, [user]);

  useEffect(() => {
    const menuIcon = user.profile.profilePic;
    const menuItems = [
      {
        name: 'Logout',
        click: () => {
          window.location.href = '/logout';
        },
      },
    ];
    const actionButtons = [];
    onSetupHeader({
      title: 'Waiting for approval',
      menuIcon,
      menuItems,
      actionButtons,
    });
  }, []);

  useEffect(() => {
    if (
      waitlistPage.updateStatus === 'updateSuccess' ||
      waitlistPage.updateStatus === 'updateError'
    ) {
      setUpdateStatusSnackbarOpen(true);
    }
  }, [waitlistPage]);

  return (
    <>
      <Helmet>
        <title>Waitlist</title>
      </Helmet>
      <CssBaseline />
      <Paper className={classes.paper}>
        {/* <Typography component="h1" variant="h4" align="center">
          Waiting for approval
  </Typography> */}
        <Box className={classes.message}>
          <Typography component="p" variant="body1" align="justify" paragraph>
            Thank you {firstName} for your interest in Rappo. You will receive
            an email from us once your request has been reviewed.
          </Typography>
          <Typography component="p" variant="body1" align="justify" paragraph>
            Please provide us with some additional info which will help us get
            you onboarded as soon as possible.
          </Typography>
        </Box>
        <Typography component="h2" variant="h6" gutterBottom>
          Additional Info
        </Typography>
        <form noValidate autoComplete="off">
          <Grid className={classes.gridContainer} container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="LinkedIn Profile Url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Briefly describe your requirement"
                value={useCase}
                onChange={e => setUseCase(e.target.value)}
                fullWidth
                multiline
                rows={1}
                rowsMax={4}
              />
            </Grid>
          </Grid>
          <Box className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              disabled={waitlistPage.updateStatus === 'updateInProgress'}
              onClick={() =>
                onUpdateClick({
                  accessToken,
                  phoneNumber,
                  linkedinUrl,
                  useCase,
                })
              }
            >
              Update
            </Button>
          </Box>
        </form>
        <Snackbar
          open={updateStatusSnackbarOpen}
          autoHideDuration={2000}
          onClose={() => setUpdateStatusSnackbarOpen(false)}
        >
          <Alert
            severity={
              waitlistPage.updateStatus === 'updateSuccess'
                ? 'success'
                : 'error'
            }
          >
            {waitlistPage.updateStatus === 'updateSuccess'
              ? 'Info updated'
              : 'Update error'}
          </Alert>
        </Snackbar>
      </Paper>
    </>
  );
}

WaitlistPage.propTypes = {
  user: PropTypes.object,
  waitlistPage: PropTypes.object,
  onSetupHeader: PropTypes.func,
  onUpdateClick: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  waitlistPage: makeSelectWaitlistPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetupHeader: ({ title, menuIcon, menuItems, actionButtons }) =>
      dispatch(setupHeader({ title, menuIcon, menuItems, actionButtons })),
    onUpdateClick: ({ accessToken, phoneNumber, linkedinUrl, useCase }) =>
      dispatch(
        updateUserProfile({
          accessToken,
          phoneNumber,
          linkedinUrl,
          useCase,
        }),
      ),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(WaitlistPage);
