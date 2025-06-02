import { BASE_API_URL } from "@/lib/api-config";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface DataContextType {
  data: any;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      fetch(BASE_API_URL + "/users/me", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        });
    }
  }, []);

  return <DataContext.Provider value={{ data, isLoading }}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
