import { useState } from "react";

const useSortable = () => {
  const [sortOption, setSortOption] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (option) => {
    if (option === sortOption) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection("asc");
    }
  };

  return { sortOption, sortDirection, handleSort };
};

export default useSortable;
