import React, { useState, useEffect } from "react";

const ProvinceDropdown = () => {
  const [loading, setLoading] = useState(true);
  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://isaacdarcilla.github.io/philippine-addresses/province.json"
        );
        const data = await response.json();
        setProvinceList(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return (
    <div>
      <label>Select Province:</label>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          <option value="" disabled>
            Select a province
          </option>
          {provinceList.map((province) => (
            <option key={province.province_code} value={province.province_code}>
              {province.province_name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ProvinceDropdown;
