import { useState } from "react";
import { GiMagnifyingGlass } from "react-icons/gi";
import AutoCompleteList from "./AutoCompleteList";
import { CityInfo } from "../types";

const pako = require("pako");

type Props = {
  onSubmit: (city: CityInfo) => void;
  limit: number;
};

const SearchBar = ({ onSubmit, limit }: Props): JSX.Element => {
  const [input, setInput] = useState<string>("");
  const [filteredList, setFilteredList] = useState<CityInfo[]>([]);
  const [cachedCityList, setCachedCityList] = useState<CityInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function addCity(city: CityInfo): void {
    onSubmit(city);
    setInput("");
  }

  function handleFormSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const mappedTo: CityInfo | undefined = cachedCityList?.find(
      (city: CityInfo) => city.name.toLowerCase().startsWith(input)
    );
    if (input.length > 0 && mappedTo) {
      addCity(mappedTo);
    }
  }

  function handleFormChanged(e: React.FormEvent): void {
    e.preventDefault();
    //@ts-ignore
    const formInput: string = e.target.value.toLowerCase();

    let matchingCities: CityInfo[] = cachedCityList?.filter((city: CityInfo) =>
      city.name.toLowerCase().startsWith(formInput)
    );

    setInput(formInput);
    setFilteredList(matchingCities);
  }

  function getCities() {
    if (cachedCityList.length === 0 && !isLoading) {
      setIsLoading(true);
      fetch("weather-forecast/cities.json.gz", {
        headers: {
          "Accept-Encoding": "gzip",
          "responseType": "arraybuffer",
        },
      })
        .then((res) => res.arrayBuffer())
        .then((res) => pako.ungzip(res, { to: "string" }))
        .then((res) => setCachedCityList(JSON.parse(res)))
        .then(() => setIsLoading(false))
        .catch((err) => console.log(err));
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      onClick={(e) => e.stopPropagation()}
      className={"bg-white z-10 px-2 max-w-xs rounded-full"}
      onBlur={() => setTimeout(() => setFilteredList([]), 200)}
    >
      <div className={"flex pl-2 items-center relative"}>
        <GiMagnifyingGlass
          size={24}
          fill={"grey"}
          className={"-rotate-90 opacity-80"}
        />
        <input
          value={input}
          className={"ml-2 py-2 w-full bg-transparent"}
          onChange={handleFormChanged}
          onClick={getCities}
          type={"text"}
          placeholder={"Search new phrase"}
        />
        {input && input.length > 1 && (
          <AutoCompleteList
            list={filteredList}
            onClick={addCity}
            limitResults={limit}
          />
        )}
      </div>
    </form>
  );
};

export default SearchBar;
