import React, { createContext, useContext } from 'react';
import { usePokedex } from './usePokedex'; // Import your current hook

const PokedexContext = createContext();

export const PokedexProvider = ({ children }) => {
    const pokedex = usePokedex(); 
    
    return (
        <PokedexContext.Provider value={pokedex}>
            {children}
        </PokedexContext.Provider>
    );
};

export const useGlobalPokedex = () => useContext(PokedexContext);