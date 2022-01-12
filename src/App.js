import { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api/index'

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

function App() {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([])
  const [childClicked, setChildClicked] = useState(null);

  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({ sw: { lat: 0, lng: 0 }, ne: { lat: 0, lng: 0 } });

  const [isLoading, setisLoading] = useState(false)
  const [type, setType] = useState('restaurants')
  const [rating, setRating] = useState('')
  const [filteredPlaces, setfilteredPlaces] = useState([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude })
    })
  }, [])

  useEffect(() => {
    // getPlacesData(bounds.sw, bounds.ne).then((data) => {
    //   setPlaces(data)
    // })
    if (bounds.sw && bounds.ne) {
      setisLoading(true)

      async function getWeather() {
        const data = await getWeatherData(coordinates.lat, coordinates.lng)
        setWeatherData(data)
      }

      async function getData() {
        const data = await getPlacesData(type, bounds.sw, bounds.ne)
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0))
        setfilteredPlaces([])
        setisLoading(false)
      }
      getWeather();
      getData();
    }

  }, [type, bounds])

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating >= rating)
    setfilteredPlaces(filteredPlaces)
  }, [rating])

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
