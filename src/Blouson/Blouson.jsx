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
import InputAdornment from '@material-ui/core/InputAdornment';
import axios from 'axios';
import clsx from 'clsx';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import { ValidatorForm } from 'react-material-ui-form-validator';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

function BlousonForm() {

  const classes = useStyles();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    classroom: '',
  });

  const [loading, setLoading] = useState(false);
  const [send, setSend] = useState(false);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <div >
      <div className={classes.barbar}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Formulaire demande de blouson
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Grid className={classes.root} item alignContent="center" alignItems="center" xs={12} md={9} lg={9}>
        <ValidatorForm method="POST" onSubmit={""} >
          <div>
            <FormControl className={classes.formControl}>
            <TextField id="outlined-basic" label="Prenom" variant="outlined" />
            </FormControl>
          </div> 
          <div>
            <FormControl className={classes.formControl}>
            <TextField id="outlined-basic" label="Nom" variant="outlined" />
            </FormControl>
          </div>
          <div>
            <FormControl className={classes.formControl}>
            <TextField
              id="standard-number"
              label="Numero Telephone"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
            </FormControl>
            <div>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
                Pack Choisi
              </InputLabel>
              <Select
                native
                required
                value={state.classroom}
                onChange={""}
                labelWidth={labelWidth}
                inputProps={{
                  name: 'classe',
                  id: 'outlined-age-native-simple',
                }}
              >
                <option value="" disabled />
                <option value='TC1'>Debardeur uniquement</option>
                <option value='TC2'>Blouson uniquement</option>
                <option value='DIC1'>Blouson + Debardeur</option>
                <option value='DIC2'>Blouson + </option>
                <option value='DIC3'>DIC3</option>
              </Select>
              <FormHelperText>Selectionner le pack choisi</FormHelperText>
            </FormControl>
          </div>

          <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup aria-label="gender" name="gender1" value={""} onChange={""}>
            <FormControlLabel value="female" control={<Radio />} label="Blouson" />
            <FormControlLabel value="male" control={<Radio />} label="Debardeur" />
            <FormControlLabel value="other" control={<Radio />} label="Maillot" />
            <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
          </RadioGroup>
        </FormControl>


          </div>
              <p>Vos Mesures</p>
              <FormControl className={classes.formControl}>
              <TextField
              label="With normal TextField"
              id="standard-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              InputProps={{
                startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
              }}
            />
              </FormControl>
          <div>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
                Classe
              </InputLabel>
              <Select
                native
                required
                value={state.classroom}
                onChange={""}
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
              
          </div>
        
          <Box component="span" m={1}>
            <Button disabled={loading || send} size='large' variant="contained" type="submit" color="primary">
              Envoyer
            </Button>
            {
              loading ? (
                <div>
                  <CircularProgress />
                </div>
              ) : ('')
            }
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
          </div>
        </ValidatorForm>
      </Grid>
    </div>
  )
}

export default BlousonForm;