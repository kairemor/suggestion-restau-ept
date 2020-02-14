import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';
import { sugges_url } from '../../config';
import CircularProgress from '@material-ui/core/CircularProgress';


import { AppContext } from '../../App';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    minWidth: 250,
  },
  search: {
    padding: 4,
    marginBottom: 10
  },
  center: {
    marginLeft: "25%",
    marginRight: "25%"
  },
}));

function Suggestions() {
  const [suggestions, setSuggestions] = useState();
  const [search, setSearch] = useState('');
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleChange = name => event => {
    let cherche = {};

    if (name === 'thisWeek') {
      console.log(event.target.checked);
      setSearch({
        ...search,
        [name]: event.target.checked
      });
      cherche = {
        ...search,
        [name]: event.target.checked
      };
    } else {
      setSearch({
        ...search,
        [name]: event.target.value
      });
      cherche = {
        ...search,
        [name]: event.target.value
      };
    }
    console.log(cherche);
    fetchSuggestions(cherche);
  };

  const fetchSuggestions = useCallback((search = false) => {
    axios.defaults.headers = {
      Authorization: `Bearer ${state.token}`,
      'Content-Type': 'application/json'
    };
    setLoading(true);
    if (!search) {
      axios.get(`${sugges_url}/suggestion?appreciationRepas=false`)
        .then(res => {
          setLoading(false);
          // console.log(res);
          setSuggestions(res.data);
        })
        .catch(err => console.log(err));
    } else {
      let check = JSON.stringify(search);
      axios.get(`${sugges_url}/suggestion?appreciationRepas=false&search=${check}`)
        .then(res => {
          setLoading(false);
          // console.log(res);
          setSuggestions(res.data);
        })
        .catch(err => console.log(err));
    }
  }, [state]);
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const onRead = (suggestion) => (e) => {
    console.log(suggestion);
    let alreadyReaded = suggestion.readBy.split(',').find(id => id === state.id);
    if (!alreadyReaded) {
      axios.put(`${sugges_url}/suggestion/${suggestion._id}`, {
        readBy: state.id
      })
        .then(suggestion => {
          console.log(suggestion);
        })
        .catch(err => console.log(err));
    }
    // else {
    //   fetchSuggestions();
    // }
  };

  const printSuggestion = suggestion => {
    let alreadyReaded = suggestion.readBy.split(',').find(id => id === state.id);

    if (!alreadyReaded) {
      return (
        <Grid key={suggestion._id} item xs={12} md={6} lg={6}>
          <Badge badgeContent={1} color="secondary">
            <Paper>
              <ExpansionPanel onClick={onRead(suggestion)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}> classe : {suggestion.classroom + ' <--> Sexe : ' + suggestion.sex}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails >
                  <Typography>
                    {suggestion.suggestion}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Paper>
          </Badge>
        </Grid>
      )
    } else {
      return (
        <Grid key={suggestion._id} item xs={12} md={6} lg={6}>
          <Paper>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>classe : {suggestion.classroom + ' <--> Sexe : ' + suggestion.sex}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  {suggestion.suggestion}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Paper>
        </Grid>
      )
    }
  }
  return (

    <div className={classes.root}>
      <div className={classes.search} >
        <h3>Rechercher</h3>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleChange('thisWeek')}
                  color="primary"
                  checked={search.thisWeek}
                />
              }
              label="Semaine Courante"
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">
                Selectionner une classe
            </InputLabel>
              <Select onChange={handleChange('classroom')} displayEmpty className={classes.selectEmpty}>
                <MenuItem value="" disabled>Selectionner une classe</MenuItem>
                <MenuItem value='TC1'>TC1</MenuItem>
                <MenuItem value='TC2'>TC2</MenuItem>
                <MenuItem value='DIC1'>DIC1</MenuItem>
                <MenuItem value='DIC2'>DIC2</MenuItem>
                <MenuItem value='DIC3'>DIC3</MenuItem>
              </Select>
              <FormHelperText>Selectionner une classe</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">
                Selectionner un sexe
            </InputLabel>
              <Select onChange={handleChange('sex')} displayEmpty className={classes.selectEmpty}>
                <MenuItem value="" disabled>Selectionner un sexe</MenuItem>
                <MenuItem value='Masculin'>Masculin</MenuItem>
                <MenuItem value='Feminin'>Feminin</MenuItem>
              </Select>
              <FormHelperText>Selectionner un sexe</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      {
        loading ? (
          <div className={classes.center}>
            <CircularProgress />
          </div>
        ) : (
            <div>
              <div>
                <h3>{search.classroom ? `Les suggestions des eleves de la ${search.classroom}` : ''}</h3>
                <h3> Sex : {search.sex ? search.sex : ''}</h3>
              </div>
              <Grid container spacing={3}>
                {suggestions ? suggestions.map(suggestion => {
                  if (suggestion.suggestion.length) {
                    return (
                      printSuggestion(suggestion)
                    )
                  }
                }) : ''}
              </Grid>
            </div>
          )
      }
    </div>
  );
}

export default Suggestions;