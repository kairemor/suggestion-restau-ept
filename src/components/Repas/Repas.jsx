import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { AppContext } from '../../App';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


function Repas() {
  const [repas, setRepas] = useState();
  const { state } = useContext(AppContext);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openMsg, setOpenMsg] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState({});
  const [newData, setNewData] = React.useState({});

  const fetchRepas = useCallback(() => {
    axios.defaults.headers = {
      Authorization: `Bearer ${state.token}`,
      'Content-Type': 'application/json'
    };

    axios.get('http://localhost:3500/repas')
      .then(res1 => {
        setRepas(res1.data);
      })
      .catch(err => console.log(err));

  }, [state.token]);

  const handleOpen = (repas) => () => {
    setSelectedDay(repas);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseMsg = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMsg(false);
  };

  const submitForm = event => {
    event.preventDefault();
    axios.defaults.headers = {
      Authorization: `Bearer ${state.token}`,
      'Content-Type': 'application/json'
    };

    axios.put(`http://localhost:3500/repas/${selectedDay.day_number}`, newData)
      .then(res => {
        setOpenMsg(true)
        setOpen(false)
        fetchRepas()
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  const handleChange = (name) => event => {
    setNewData({
      ...state,
      [name]: event.target.value,
    });
  };

  useEffect(() => {
    fetchRepas();
  }, [fetchRepas]);

  return (
    <div className={classes.root}>
      {
        repas ? (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Jour</TableCell>
                  <TableCell align="center">Repas</TableCell>
                  <TableCell align="right">Diner</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {repas.map(repa => (
                  <TableRow key={repa.day_number}>
                    <TableCell component="th" scope="row">
                      {repa.day}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      {repa.repas}
                    </TableCell>
                    <TableCell align="right">{repa.diner}</TableCell>
                    <TableCell align="right"><EditIcon onClick={handleOpen(repa)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : ''
      }
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      ><div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Modifier repas du {selectedDay.day}</h2>
          <form onSubmit={submitForm} className={classes.form}>
            <TextField label="Jour" value={selectedDay.day} disabled />
            <TextField label="Repas" defaultValue={selectedDay.repas} onChange={handleChange('repas')} />
            <TextField label="Diner" defaultValue={selectedDay.diner} onChange={handleChange('diner')} />
            <Button size='large' variant="contained" type="submit" color="primary">
              Modifier
            </Button>
          </form>
        </div>
      </Modal>
      <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleCloseMsg} severity="success">
          Modification reussi !!!
      </Alert>
      </Snackbar>
    </div>
  );
}

export default Repas;
