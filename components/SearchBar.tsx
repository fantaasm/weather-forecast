import React, {useState} from "react";
import cities1 from "../public/cities1.json"
import cities2 from "../public/cities2.json"
import cities3 from "../public/cities3.json"
import {GiMagnifyingGlass} from "react-icons/gi";
import AutoCompleteList from "./AutoCompleteList";
import {CityInfo} from "../types/weather";

type Props = {
  onSubmit: (city:CityInfo) => void
  limit: number
}

const SearchBar = ({onSubmit, limit}: Props): JSX.Element => {
  const [input, setInput] = useState<string>("");
  const [filteredList, setFilteredList] = useState<CityInfo[]>([])

  function addCity(city: CityInfo): void {
    onSubmit( city)
    setInput("")
  }

  function handleFormSubmit(e: React.FormEvent): void {
    e.preventDefault()
    const mappedTo: CityInfo = getCombinedCities().find((city: CityInfo) => city.name.toLowerCase().startsWith(input))
    if (input.length > 0 && mappedTo) {
      addCity(mappedTo)
    }
  }

  function handleFormChanged(e: React.FormEvent): void {
    e.preventDefault()
    const formInput: string = e.target.value.toLowerCase()

    // ugly but otherwise wont compile on netlify :/
    let matchingCities: CityInfo[] = getCombinedCities().filter((city: CityInfo) => city.name.toLowerCase().startsWith(formInput))

    setInput(formInput);
    setFilteredList(matchingCities)
  }

  return (
    <form onSubmit={handleFormSubmit} onClick={(e)=>e.stopPropagation()} className={"bg-white z-10 px-2 max-w-xs rounded-full"} onBlur={() => setTimeout(() => setFilteredList([]), 200)}>
      <div className={"flex pl-2 items-center relative"}>
        <GiMagnifyingGlass size={24} fill={"grey"} className={"-rotate-90 opacity-80"} />
        <input value={input} className={"ml-2 py-2 w-full bg-transparent"} onChange={handleFormChanged} type={"text"} placeholder={"Search new phrase"} />
        {input && input.length > 1 &&
            <AutoCompleteList list={filteredList} onClick={addCity} limitResults={limit} />
        }
      </div>
    </form>
  );
}

function getCombinedCities():CityInfo[] {
  return [...cities1,...cities2,...cities3];
}

export default SearchBar
