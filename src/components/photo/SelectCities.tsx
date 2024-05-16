"use client";

import { Check, MapPin, Search, X } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";
import { useCallback, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Icons } from "../Icons";
import { buttonVariants } from "../ui/button";

interface SelectCitiesProps {
  label: string;
  country: string;
}

const SelectCities = ({ label, country }: SelectCitiesProps) => {
  const [selected, setSelected] = useState(
    !label || !country ? "" : label + ", " + country
  );
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setSelected("");
  });

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className={`bg-white text-sm w-full p-2 flex items-center rounded border ${
          !selected && "text-gray-700"
        }`}
      >
        <MapPin className="w-4 h-4 mr-1" />
        {selected ? selected : "Select Country"}
      </div>
      {open && (
        <div
          className={`absolute bg-white top-full h-80 overflow-y-auto inset-x-0 shadow rounded-b-md`}
        >
          <div className="flex items-center sticky top-0 bg-white">
            <Search className="w-4 h-4 absolute top-3 left-3" />
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toLowerCase())}
              placeholder="Enter country name"
              className="placeholder:text-gray-700 p-2 outline-none pl-9 rounded-b-none"
            />

            {inputValue.length > 0 && (
              <X
                className="w-4 h-4 absolute top-3 right-3"
                onClick={() => setInputValue("")}
              />
            )}
          </div>

          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200  ${
              "tokyo, japan" === selected?.toLowerCase() && "bg-gray-200"
            } ${"tokyo, japan".startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {
              if ("tokyo, japan" !== selected.toLowerCase()) {
                setSelected("Tokyo, Japan");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            Tokyo, Japan <Icons.japanFlag className="w-3.5 h-3.5 ml-2" />
          </div>
          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200 ${
              "delhi, india" === selected?.toLowerCase() && "bg-gray-200"
            } ${"delhi, india".startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {
              if ("delhi, india" !== selected.toLowerCase()) {
                setSelected("Delhi, India");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            Delhi, India <Icons.indiaFlag className="w-3.5 h-3.5 ml-2" />
          </div>
          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200 ${
              "shanghai, china" === selected?.toLowerCase() && "bg-gray-200"
            } ${"shanghai, china".startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {
              if ("shanghai, china" !== selected.toLowerCase()) {
                setSelected("Shanghai, China");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            Shanghai, China <Icons.chinaFlag className="w-3.5 h-3.5 ml-2" />
          </div>
          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200 ${
              "são paulo, brazil" === selected?.toLowerCase() && "bg-gray-200"
            } ${
              "são paulo, brazil".startsWith(inputValue) ? "block" : "hidden"
            }`}
            onClick={() => {
              if ("são paulo, brazil" !== selected.toLowerCase()) {
                setSelected("São Paulo, Brazil");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            São Paulo, Brazil <Icons.brazilFlag className="w-3.5 h-3.5 ml-2" />
          </div>
          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200 ${
              "mexico city, mexico" === selected?.toLowerCase() && "bg-gray-200"
            } ${
              "mexico city, mexico".startsWith(inputValue) ? "block" : "hidden"
            }`}
            onClick={() => {
              if ("mexico city, mexico" !== selected.toLowerCase()) {
                setSelected("Mexico City, Mexico");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            Mexico City, Mexico{" "}
            <Icons.mexicoFlag className="w-3.5 h-3.5 ml-2" />
          </div>
          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200 ${
              "osaka, japan" === selected?.toLowerCase() && "bg-gray-200"
            } ${"osaka, japan".startsWith(inputValue) ? "block" : "hidden"}`}
            onClick={() => {
              if ("osaka, japan" !== selected.toLowerCase()) {
                setSelected("Osaka, Japan");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            Osaka, Japan <Icons.japanFlag className="w-3.5 h-3.5 ml-2" />
          </div>
          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200 ${
              "Los Angeles, US".toLowerCase() === selected?.toLowerCase() &&
              "bg-gray-200"
            } ${
              "Los Angeles, US".toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={() => {
              if ("Los Angeles, US".toLowerCase() !== selected.toLowerCase()) {
                setSelected("Los Angeles, US");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            Los Angeles, US <Icons.usFlag className="w-3.5 h-3.5 ml-2" />
          </div>
          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200 ${
              "Paris, France".toLowerCase() === selected?.toLowerCase() &&
              "bg-gray-200"
            } ${
              "Paris, France".toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={() => {
              if ("Paris, France".toLowerCase() !== selected.toLowerCase()) {
                setSelected("Paris, France");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            Paris, France <Icons.franceFlag className="w-3.5 h-3.5 ml-2" />
          </div>
          <div
            className={`p-2 text-sm flex items-center hover:cursor-pointer hover:bg-gray-200 ${
              "Ho Chi Minh City, Vietnam".toLowerCase() ===
                selected?.toLowerCase() && "bg-gray-200"
            } ${
              "Ho Chi Minh City, Vietnam".toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={() => {
              if (
                "Ho Chi Minh City, Vietnam".toLowerCase() !==
                selected.toLowerCase()
              ) {
                setSelected("Ho Chi Minh City, Vietnam");
                setOpen(false);
                setInputValue("");
              }
            }}
          >
            Ho Chi Minh City, Vietnam{" "}
            <Icons.vietnamFlag className="w-3.5 h-3.5 ml-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectCities;
