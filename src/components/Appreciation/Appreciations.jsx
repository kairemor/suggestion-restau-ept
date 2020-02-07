import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { AppContext } from '../../App';
import { sugges_url } from '../../config';

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
  table: {
    minWidth: 650,
  },
  search: {
    padding: 4,
    marginBottom: 10
  }
}));

function Appreciations() {
  const [appreciations, setAppreciations] = useState([]);
  const [repas, setRepas] = useState();
  const [search, setSearch] = useState('');
  const { state } = useContext(AppContext);
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

  const prepareData = (datas, repas) => {
    const preparedData = datas.map(data => {
      let apprec = data.appreciationRepas.map(appr => {
        const app = JSON.parse(appr);
        let repa = repas.find(res => res.day_number == app.day_number);
        return {
          ...repa,
          appreciation_repas: app.repas,
          appreciation_diner: app.diner
        };

      });
      return apprec;
    });
    console.log(repas);
    console.log(preparedData.flat());
    let flat_data = preparedData.flat();
    let finalData = [];
    for (let i = 0; i <= 6; i++) {
      let repa = repas.find((rep, index) => rep.day_number === i);
      finalData.push({
        day_number: `${i}`,
        day: repa.day,
        repas: repa.repas,
        diner: repa.diner,
        appreciation_repas: {
        },
        appreciation_diner: {
        }
      });
    }

    flat_data.map(data => {
      let current_repas = finalData[data.day_number].appreciation_repas[`${data.appreciation_repas}`] ? finalData[data.day_number].appreciation_repas[`${data.appreciation_repas}`] : 0;
      let current_diner = finalData[data.day_number].appreciation_diner[`${data.appreciation_diner}`] ? finalData[data.day_number].appreciation_diner[`${data.appreciation_diner}`] : 0;
      finalData[data.day_number] = {
        ...finalData[data.day_number],
        day: data.day,
        repas: data.repas,
        diner: data.diner,
        appreciation_repas: {
          ...finalData[data.day_number].appreciation_repas,
          [data.appreciation_repas]: ++current_repas,
        },
        appreciation_diner: {
          ...finalData[data.day_number].appreciation_diner,
          [data.appreciation_diner]: ++current_diner
        },
      };
      return data;
    });

    console.log(finalData);
    setAppreciations(finalData);
  };


  const fetchSuggestions = useCallback((search = false) => {
    axios.defaults.headers = {
      Authorization: `Bearer ${state.token}`,
      'Content-Type': 'application/json'
    };
    if (!search) {
      axios.get(`${sugges_url}/suggestion?appreciationRepas=true`)
        .then(res => {
          axios.get(`${sugges_url}/repas`)
            .then(res1 => {
              setRepas(res1.data);
              prepareData(res.data, res1.data);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    } else {
      let check = JSON.stringify(search);
      axios.get(`${sugges_url}/suggestion?appreciationRepas=true&search=${check}`)
        .then(res => {
          axios.get(`${sugges_url}/repas`)
            .then(res1 => {
              setRepas(res1.data);
              prepareData(res.data, res1.data);
            })
            .catch(err => console.log(err));
          console.log(res);
        })
        .catch(err => console.log(err));
    }
  }, [state.token]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <h3>Rechercher</h3>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleChange('thisWeek')}
                  checked={search.thisWeek}
                  color="primary"
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
        appreciations ? (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Jour</TableCell>
                  <TableCell align="center">Repas</TableCell>
                  <TableCell align="right">Tres mauvais</TableCell>
                  <TableCell align="right">Mauvais</TableCell>
                  <TableCell align="right">Assez Bon</TableCell>
                  <TableCell align="right">Bon</TableCell>
                  <TableCell align="right">Tres Bon</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appreciations.map(appreciation => (
                  <>
                    <TableRow key={appreciation.day_number + "1"}>
                      <TableCell rowSpan={2} component="th" scope="row">
                        {appreciation.day}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        {appreciation.repas}
                      </TableCell>
                      <TableCell align="right">{appreciation.appreciation_repas['tres mauvais'] || 0}</TableCell>
                      <TableCell align="right">{appreciation.appreciation_repas['mauvais'] || 0}</TableCell>
                      <TableCell align="right">{appreciation.appreciation_repas['bon'] || 0}</TableCell>
                      <TableCell align="right">{appreciation.appreciation_repas['assez bon'] || 0}</TableCell>
                      <TableCell align="right">{appreciation.appreciation_repas['tres bon'] || 0}</TableCell>
                    </TableRow>
                    <TableRow key={appreciation.day_number + "2"}>
                      <TableCell component="th" align="center" scope="row">
                        {appreciation.diner}
                      </TableCell>
                      <TableCell align="right">{appreciation.appreciation_diner['tres mauvais'] || 0}</TableCell>
                      <TableCell align="right">{appreciation.appreciation_diner['mauvais'] || 0}</TableCell>
                      <TableCell align="right">{appreciation.appreciation_diner['bon'] || 0}</TableCell>
                      <TableCell align="right">{appreciation.appreciation_diner['assez bon'] || 0}</TableCell>
                      <TableCell align="right">{appreciation.appreciation_diner['tres bon'] || 0}</TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        ) : ''
      }
    </div>
  );
}

export default Appreciations;
