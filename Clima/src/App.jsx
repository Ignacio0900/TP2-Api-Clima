import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '30d38b26954359266708f92e1317dac0';

function App() {
    const [clima, setClima] = useState(null);
    const [ciudad, setCiudad] = useState("Tucuman");
    const [buscar, setBuscar] = useState("");
    const [historial, setHistorial] = useState([]);

    const iconoUrl = clima ? `./src/iconos/${clima.weather[0].icon}.svg` : "";

    const fetchClima = async (ciudad) => {
        const respuesta = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`
        );
        const datos = await respuesta.json();
        setClima(datos);
    };

    const saveSearch = async (ciudad) => {
        try {
            await axios.post('http://localhost:5000/api/search', { city: ciudad });
            fetchHistorial();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHistorial = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/history');
            setHistorial(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClima(ciudad);
        fetchHistorial();
    }, [ciudad]);

    const ClickCiudad = async (lugar) => {
        setCiudad(lugar);
        await fetchClima(lugar);
        await saveSearch(lugar);
    };

    const CambioBuscar = (evento) => {
        setBuscar(evento.target.value);
    };

    const manejarBusqueda = async () => {
        if (buscar.trim() !== "") {
            setCiudad(buscar);
            await fetchClima(buscar);
            await saveSearch(buscar);
            setBuscar("");
        }
    };

    const Enter = (evento) => {
        if (evento.key === "Enter") {
            manejarBusqueda();
        }
    };

    return (
        <>
            <nav>
                <h1>Clima</h1>
                <ul className="ciudades">
                    <ul>
                        <li>
                            <a href="#" className="ciudad" onClick={() => ClickCiudad("Tucuman")}>Tucuman</a>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a href="#" className="ciudad" onClick={() => ClickCiudad("Salta")}>Salta</a>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a href="#" className="ciudad" onClick={() => ClickCiudad("Buenos Aires")}>Buenos Aires</a>
                        </li>
                    </ul>
                </ul>
            </nav>

            <input
                className="buscar"
                type="search"
                placeholder="Buscar"
                aria-label="Buscar"
                value={buscar}
                onChange={CambioBuscar}
                onKeyDown={Enter}
            />

            <main>
                {ciudad && clima && (
                    <article className="contenedor">
                        <header>
                            <h2>{ciudad}</h2>
                        </header>
                        <div className="iconos">
                            <img src={iconoUrl} alt="Climas" />
                        </div>
                        <footer>
                            <h2>Temperatura: {clima.main.temp}°C</h2>
                            <p>Minima: {clima.main.temp_min}°C / Maxima: {clima.main.temp_max}°C</p>
                            <p>Humedad: {clima.main.humidity}%</p>
                        </footer>
                    </article>
                )}
                <section>
                    <h2>Historial de Búsquedas</h2>
                    <ul>
                        {historial.map((item, index) => (
                            <li key={index}>{item.city} - {new Date(item.date).toLocaleString()}</li>
                        ))}
                    </ul>
                </section>
            </main>
        </>
    );
}

export default App;
