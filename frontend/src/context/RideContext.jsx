import { createContext, useContext, useState } from "react";

const RideContext = createContext(null);

const initialState = {
  pickup: null,
  drop: null,
  fareEstimate: null,
  activeRide: null,
};

export function RideProvider({ children }) {
  const [pickup, setPickup] = useState(initialState.pickup);
  const [drop, setDrop] = useState(initialState.drop);
  const [fareEstimate, setFareEstimate] = useState(initialState.fareEstimate);
  const [activeRide, setActiveRide] = useState(initialState.activeRide);

  const resetBooking = () => {
    setPickup(null);
    setDrop(null);
    setFareEstimate(null);
  };

  return (
    <RideContext.Provider
      value={{
        pickup,
        setPickup,
        drop,
        setDrop,
        fareEstimate,
        setFareEstimate,
        activeRide,
        setActiveRide,
        resetBooking,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error("useRide must be used within RideProvider");
  return ctx;
}
