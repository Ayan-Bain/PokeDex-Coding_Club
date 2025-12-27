import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePokedex } from './usePokedex';

const KANTO_POKEDEX_URL = 'https://pokeapi.co/api/v2/pokedex/kanto';
const PokedexContext = createContext();

export const PokedexProvider = ({ children }) => {
    const pokedex = usePokedex(); 
    const [pokeData, setPokeData] = useState([]); // Master list
    const [isListLoading, setListLoading] = useState(true);

    const fetchPokedexList = async () => {
        setListLoading(true);
        try {
            const cached = await AsyncStorage.getItem("full_pokemon_data");
            if (cached) {
                const parsed = JSON.parse(cached);
                setPokeData(parsed);
            } else {
                const res = await fetch(KANTO_POKEDEX_URL);
                const json = await res.json();
                
                // Deep fetch
                const detailed = await Promise.all(json.pokemon_entries.map(async (p) => {
                    const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.pokemon_species.name}`);
                    const detailJson = await detailRes.json();
                    return {
                        ...p,
                        imageUrl: detailJson.sprites.other["official-artwork"].front_default,
                        types: detailJson.types.map(t => t.type.name),
                        abilities: detailJson.abilities.map(t=> t.ability.name),
                        cries: detailJson.cries,
                        weight: detailJson.weight,
                        height: detailJson.height,
                        stats: detailJson.stats,
                    };
                }));

                setPokeData(detailed);
                console.log('Deep fetch successfull');
                await AsyncStorage.setItem('full_pokemon_data', JSON.stringify(detailed));
            }
        } catch (e) { console.error(e); }
        finally { setListLoading(false); }
    };

    useEffect(() => { fetchPokedexList(); }, []);

    return (
        <PokedexContext.Provider value={{ 
            ...pokedex, 
            pokeData, 
            isListLoading
        }}>
            {children}
        </PokedexContext.Provider>
    );
};

export const useGlobalPokedex = () => useContext(PokedexContext);