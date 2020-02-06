import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { sugges_url } from '../../../config';

import { ValidatorForm } from 'react-material-ui-form-validator';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  barbar: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    alignContent: 'center'
  },
  appreciations: {
    marginBottom: 50
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function FormSuggestion() {
  const classes = useStyles();
  const [repas, setRepas] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    classe: '',
    sex: 'Masculin'
  });


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleChange1 = (name) => event => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  const inputLabel = React.useRef(null);

  useEffect(() => {
    axios.get(`${sugges_url}/repas`)
      .then(data => {
        console.log(data);
        setRepas(data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const submitForm = event => {
    event.preventDefault();
    let appreciations;
    for (let i = 0; i <= 6; i++) {
      if (state.hasOwnProperty(`appreciation${i}repas`) || state.hasOwnProperty(`appreciation${i}diner`)) {
        appreciations === undefined ? appreciations = `${i},${state['appreciation' + i + 'repas']},${state['appreciation' + i + 'diner']}`
          : appreciations += `:${i},${state['appreciation' + i + 'repas']},${state['appreciation' + i + 'diner']}`;
      }
    }
    if (state.hasOwnProperty(`appreciation5repas`)) {
    }

    console.log(appreciations);
    axios.post(`${sugges_url}/suggestion`, {
      sex: state.sex,
      classroom: state.classe,
      suggestion: state.suggestion || '',
      appreciationRepas: appreciations
    })
      .then(data => {
        console.log(data);

        setOpen(true)
        setSuccessMsg("Suggestion envoye avec succes");
        setTimeout(() => {
          setSuccessMsg(false)
        }, 10000)
        setState({
          classe: '',
          sex: 'Masculin',
          suggestion: ''
        })
      })
      .catch(err => {
        setErrorMsg(err);
        setTimeout(() => {
          setErrorMsg(false)
        }, 10000)
        console.log(err)
      });
  };

  return (
    <div >
      <div className={classes.barbar}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Formulaire de suggestion pour la commission restauration
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Grid className={classes.root} item alignContent="center" alignItems="center" xs={12} md={9} lg={9}>
        <ValidatorForm method="POST" onSubmit={submitForm} >
          <div>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
                Classe
              </InputLabel>
              <Select
                native
                required
                value={state.classe}
                onChange={handleChange1('classe')}
                labelWidth={labelWidth}
                inputProps={{
                  name: 'classe',
                  id: 'outlined-age-native-simple',
                }}
              >
                <option value="" disabled />
                <option value='TC1'>TC1</option>
                <option value='TC2'>TC2</option>
                <option value='DIC1'>DIC1</option>
                <option value='DIC2'>DIC2</option>
                <option value='DIC3'>DIC3</option>
              </Select>
              <FormHelperText>Selectionner Votre classe</FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Sexe</FormLabel>
              <RadioGroup required aria-label="gender" name="gender1" value={state.sex} onChange={handleChange1('sex')}>
                <FormControlLabel value="Masculin" control={<Radio />} label="Masculin" />
                <FormControlLabel value="Feminin" control={<Radio />} label="Feminin" />
              </RadioGroup>
              <FormHelperText>Selectionner Votre sexe</FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl className={classes.formControl}>
              <TextField
                id="outlined-textarea"
                label="Votre suggestion"
                placeholder="Suggestion"
                multiline
                variant="outlined"
                onBlur={handleChange1('suggestion')}
              />
              <FormHelperText>Votre suggestion pour la commission restauration</FormHelperText>
            </FormControl>
          </div>
          <div className={classes.appreciations}>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h2 className={classes.heading}>Votre appreciation des plats </h2>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  {repas.map(repa => {
                    return (
                      <Grid className={classes.root} item alignContent="center" alignItems="center" md={12} >
                        <h4>{repa.day}</h4>
                        <div>
                          <FormControl variant="outlined" className={classes.formControl} >
                            <FormLabel>
                              {repa.repas}
                            </FormLabel>
                            <Select
                              native
                              value={state.age}
                              onChange={handleChange1(`appreciation${repa.day_number}repas`)}
                              labelWidth={labelWidth}
                              inputProps={{
                                name: 'appreciation',
                                id: 'outlined-age-native-simple',
                              }}
                            >
                              <option value="" />
                              <option value='tres mauvais'>tres mauvais </option>
                              <option value='mauvais'>mauvais</option>
                              <option value='assez bon'>assez bon</option>
                              <option value='bon'> bon</option>
                              <option value='tres bon'>tres bon </option>
                            </Select>
                          </FormControl>
                          <FormControl variant="outlined" className={classes.formControl} >
                            <FormLabel>
                              {repa.diner}
                            </FormLabel>
                            <Select
                              native
                              value={state.age}
                              onChange={handleChange1(`appreciation${repa.day_number}diner`)}
                              labelWidth={labelWidth}
                              inputProps={{
                                name: 'appreciation',
                                id: 'outlined-age-native-simple',
                              }}
                            >
                              <option value="" />
                              <option value='tres mauvais'>tres mauvais </option>
                              <option value='mauvais'>mauvais</option>
                              <option value='assez bon'>assez bon</option>
                              <option value='bon'> bon</option>
                              <option value='tres bon'>tres bon </option>
                            </Select>
                          </FormControl>
                        </div>
                      </Grid>
                    )
                  })}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
          <Box component="span" m={1}>
            <Button size='large' variant="contained" type="submit" color="primary">
              Envoyer
            </Button>
          </Box>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Suggestion Envoye avec succes ! Merci
            </Alert>
          </Snackbar>

          <div>
            {
              errorMsg ? (
                <Alert severity="error">{errorMsg}</Alert>
              ) : ('')
            }
          </div>
          <div>

            {
              //     successMsg ? (
              //       <Alert severity="success">{successMsg}</Alert>
              //     ) : ('')
              //   
            }
          </div>
        </ValidatorForm>
      </Grid>
    </div>
  );
}

export default FormSuggestion;