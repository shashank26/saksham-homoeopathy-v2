import { LoaderScreen } from "@/components/LoaderScreen";
import { getPhoneCountries, PhoneCountry } from "@/constants/phoneCountries";
import { createContext, useContext, useEffect, useState } from "react";

export type PhoneCountriesContextType = {
    phoneCountries: PhoneCountry[];
    defaultPhoneCountry: PhoneCountry | null;
};

export const PhoneCountriesContext = createContext<PhoneCountriesContextType>({
    phoneCountries: [],
    defaultPhoneCountry: null,
});

export const usePhoneCountries = () => {
    return useContext(PhoneCountriesContext);
};

export const PhoneCountriesProvider = ({ children }: React.PropsWithChildren) => {
    const [phoneCountries, setPhoneCountries] = useState<PhoneCountry[]>([]);
    const [defaultPhoneCountry, setDefaultPhoneCountry] = useState<PhoneCountry | null>(null);

    useEffect(() => {
        getPhoneCountries().then((countries) => {
            if (countries.length > 0) {
                setPhoneCountries(countries);
                setDefaultPhoneCountry(countries[0]);
            } else {
                setPhoneCountries([]);
                setDefaultPhoneCountry(null);
            }
        });
    }, []);

    if (phoneCountries.length === 0) {
        return <LoaderScreen />;
    }

    return (
        <PhoneCountriesContext.Provider value={{ phoneCountries, defaultPhoneCountry }}>
            {children}
        </PhoneCountriesContext.Provider>
    );
};