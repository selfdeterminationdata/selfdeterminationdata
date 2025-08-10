import React, {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface CountryOption {
    label: string;
    key: string;
}

interface SearchBarProps {
    onSelect: (value: string) => void;
    onCountrySelect: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSelect, onCountrySelect}) => {
    const [countriesList, setCountriesList] = useState<CountryOption[]>([]);

    useEffect(() => {
        fetch(
            "https://selfdeterminationdata-codebackend-19450166485.europe-west1.run.app/countries"
        )
            .then((response) => response.json())
            .then((data) => {
                const countryList = data.map((country) => ({
                    key: country.ccode,
                    label: country.countryname
                }));
                setCountriesList(countryList);
            })
            .catch((error) => {
                console.error("Error fetching countries:", error);
            });
    }, []);

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Autocomplete
                disablePortal
                options={countriesList}
                onChange={(_, value) => {
                    onSelect(value ? value.key : "");
                    onCountrySelect(value ? value.label : "");
                }}
                sx={{
                    position: "absolute",
                    zIndex: 1200,
                    width: "80vw",
                    height: "5vh",
                    paddingTop: "70px",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "25px",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.5)"
                    },
                    "& .MuiAutocomplete-inputRoot": {
                        paddingLeft: "20px",
                        paddingTop: "10px"
                    }
                }}
                componentsProps={{
                    paper: {
                        sx: {
                            borderRadius: "25px",
                            backgroundColor: "rgba(255, 255, 255, 0.5)"
                        }
                    }
                }}
                renderInput={(params) => <TextField {...params} label="Enter a country" />}
            />
        </div>
    );
};

export default SearchBar;
