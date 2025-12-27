import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePokedex = () => {
    const isMounted = useRef(false);
    
    const [isLoading, setLoading] = useState(true);
    const [capturedData, setCapturedData] = useState([]);
    const [encounteredData, setEncounteredData] = useState([]);
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const cap = await AsyncStorage.getItem("capturedData");
                const enc = await AsyncStorage.getItem("encounteredData");
                if (cap) setCapturedData(JSON.parse(cap));
                if (enc) setEncounteredData(JSON.parse(enc));
                isMounted.current = true;
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        loadProgress();
    }, []);
    useEffect(() => {
        if (!isMounted.current) return;
        AsyncStorage.setItem("capturedData", JSON.stringify(capturedData));
        AsyncStorage.setItem("encounteredData", JSON.stringify(encounteredData));
    }, [capturedData, encounteredData]);

    const handleButtons = (type, pokemonId) => {
        const setter = type === 'setCaptured' ? setCapturedData : setEncounteredData;
        setter(prev => 
            prev.includes(pokemonId) ? prev.filter(id => id !== pokemonId) : [...prev, pokemonId]
        );

        if(type==='setCaptured') {
            setCapturedData(prev => 
            prev.includes(pokemonId) ? prev.filter(id => id !== pokemonId) : [...prev, pokemonId]
        );
        setEncounteredData(prev => 
            prev.includes(pokemonId) ? prev : [...prev, pokemonId]
        );
    }
    if(type==='setCaptured') {
        setCapturedData(prev => 
        prev.includes(pokemonId) ? prev.filter(id => id !== pokemonId) : [...prev, pokemonId]
    );
}
    };

    return { capturedData, encounteredData, handleButtons, isLoading };
};