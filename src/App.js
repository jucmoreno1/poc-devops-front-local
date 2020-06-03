import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [resData, setResData] = useState('');
  const [nombre, setName] = useState('');
  const [fechaNacimiento, setDate] = useState('');
  const [edad, setEdad] = useState(0);
  const misCabeceras = new Headers();
  const miInitGet = {
    method: 'GET',
    headers: misCabeceras,
    mode: 'cors',
    cache: 'default',
  };

  const URL = process.env.REACT_APP_API_URL
  const PORT = process.env.REACT_APP_API_PORT
  const APIV1 = process.env.REACT_APP_API_V1
  const APIV2 = process.env.REACT_APP_API_V2
  const CALCULAEDAD = process.env.REACT_APP_API_CALCULAEDAD


  const handleGetApi = (url) => {
    fetch(url, miInitGet)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        alert(data)
      });
  };

  const obj = JSON.stringify({nombre, fechaNacimiento})
  console.log(obj) 

  const endpointCalcularEdad = URL + ':' + PORT + CALCULAEDAD
  const endpointApiV1 = URL + ':' + PORT + APIV1
  const endpointApiV2 = URL + ':' + PORT + APIV2

  console.log({endpointApiV1})


  const handlePost = (event) => {
    console.log(event.target);
    event.preventDefault();
    //'http://pocdevops-bk-local-cloudendpoint-api.endpoints.gcpcert-272801.cloud.goog/api/calcularEdad?key=AIzaSyAlNvPY20t6WAOOdpA2ZqlhJB2JNQ0aZD0'

    fetch('http://104.196.130.222:8080/api/calcularEdad', {
      method: 'POST',
      body: obj,
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setEdad(data.edad);
      });
  };



  const handleChange = (event) => {
    if (event.target.name === 'nombre') {
      setName(event.target.value);
    } else if (event.target.name === 'date') {
      setDate(event.target.value);
    }
  };


  return (
    <div className='App' >
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>PoC para el pipeline de cloud</p>
        <p>Api que calcula tu edad</p>
        <form className="form" onSubmit={handlePost}>
          <label>
            <div>Name:</div> 
            <input
              type='text'
              value={nombre}
              name='nombre'
              onChange={handleChange}
            />
          </label>
          <label>
            <div>Fecha de nacimiento:</div>           
            <input
              type='date'
              value={fechaNacimiento}
              name='date'
              onChange={handleChange}
            />
          </label>
          <input type='submit'className='form-button' value='Calcular Edad' />
        </form>
        {edad !== 0 && <p>
        Hola {nombre} Tienes {edad} 
      </p>}

      <div className="button-container">
        <div className="button">
          <a
            className='App-link'
            onClick={() => {
              handleGetApi('http://104.196.130.222:8080/api/v1');
            }}
            rel='noopener noreferrer'
          >
            Backend V1
          </a>
        </div>
        <div className="button">
          <a
            className='App-link'
            onClick={() => {
              handleGetApi('http://104.196.130.222:8080/api/v2');
            }}
            rel='noopener noreferrer'
          >
            Backend V2
          </a>
        </div>
      </div>
      </header>
    </div>
  );
}

export default App;
