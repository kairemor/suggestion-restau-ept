import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { auth_url } from '../../config';

import * as actions from '../../store/actions/actions';
import { AppContext } from '../../App';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <p>
        Suggestion Commission Restauration
      </p>
      {''}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loading: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function SignIn({ history }) {
  const classes = useStyles();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(AppContext)
  // const [formErrors, setFormErrors] = useState('');
  const handleChange = (name) => event => {
    setData({
      ...data,
      [name]: event.target.value
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    authLogin(data.username, data.password)
    console.log(data);
  }

  const authLogin = (username, password) => {
    dispatch(actions.authStart());
    setLoading(true)
    axios
      .post(`${auth_url}/users/login`, {
        username, password
      })
      .then(res => {
        console.log(res);
        const user = {
          token: res.data.token,
          id: res.data.id
        }
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(actions.authSuccess(user));
        // dispatch(actions.checkAuthTimeout(3600))
        history.push("/dashboard");
        setLoading(false)
      })
      .catch(err => {
        dispatch(actions.authFail("Le nom utilisateur ou mot de passe pas valide"));
        // setFormErrors("Le nom utilisateur ou mot de passe pas valide");
        console.log(err)
        setLoading(false)
      });
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form method="POST" onSubmit={onSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onBlur={handleChange('username')}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onBlur={handleChange('password')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Sign In
          </Button>
          {
            loading ? (

              <div classeName={classes.loading}>
                <CircularProgress />
              </div>
            ) : ('')
          }
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignIn;