import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  let today = new Date();

  const [currentTime, setCurrentTime] = useState(today.getHours());
  const [currentLocation, setCurrentLocation] = useState({});
  const [weather, setWeather] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentLocation({
        latitude: position.coords.latitude.toFixed(2),
        longitude: position.coords.longitude.toFixed(2),
      });
    });
  }, []);

  useEffect(() => {
    // early return when values are not ready
    if (
      currentLocation.latitude === undefined ||
      currentLocation.longitude === undefined
    )
      return;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}&hourly=rain`
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setWeather(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentLocation.latitude, currentLocation.longitude]);

  return (
    <>
      <Head>
        <title>Is It Raining Outside?</title>
        <meta name="description" content="Check if it's raining outside." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>
          {weather && weather.hourly.rain[currentTime] > 0.2 ? "YES" : "NO"}
        </h1>
      </main>
    </>
  );
}
